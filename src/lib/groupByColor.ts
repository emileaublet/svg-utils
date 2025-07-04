import { parseStyle } from "./parseStyle";

export function groupByColor(svgString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgEl = doc.documentElement;

  if (!svgEl || svgEl.tagName.toLowerCase() !== "svg") {
    throw new Error("Invalid SVG string: no <svg> element found.");
  }

  // Extract simple class-based styles from <defs><style>
  const classStyles: Record<string, Record<string, string>> = {};
  Array.from(doc.querySelectorAll("defs style")).forEach((styleEl) => {
    const css = styleEl.textContent || "";
    css
      .split("}")
      .map((r) => r.trim())
      .filter(Boolean)
      .forEach((rule) => {
        const [selector, declBlock] = rule.split("{").map((s) => s.trim());
        if (!selector || !declBlock) return;
        // support comma-separated selectors
        selector.split(",").forEach((sel) => {
          sel = sel.trim();
          if (sel.startsWith(".")) {
            const cls = sel.slice(1);
            classStyles[cls] = parseStyle(declBlock);
          }
        });
      });
  });

  // Preserve original child order
  const groupMap = new Map<string, SVGGElement>();

  // Recursively find all shape elements (path, circle, rect, ellipse, etc.)
  const findAllShapes = (element: Element): Element[] => {
    const shapes: Element[] = [];
    const shapeElements = [
      "path",
      "circle",
      "rect",
      "ellipse",
      "polygon",
      "polyline",
      "line",
    ];

    if (shapeElements.includes(element.tagName.toLowerCase())) {
      shapes.push(element);
    }

    // Recursively search children
    Array.from(element.children).forEach((child) => {
      shapes.push(...findAllShapes(child));
    });

    return shapes;
  };

  // Get all shapes from the entire SVG
  const allShapes = findAllShapes(svgEl); // Remove all existing shapes from their current locations
  allShapes.forEach((shape) => {
    if (shape.parentNode) {
      shape.parentNode.removeChild(shape);
    }
  });

  const getColorKey = (shape: Element): string => {
    // Helper function to get inherited styles from parent elements
    const getInheritedStyle = (
      element: Element,
      property: string
    ): string | null => {
      let current: Element | null = element;
      while (current) {
        // Check inline style
        const inline = parseStyle(current.getAttribute("style") || "");
        if (inline[property]) return inline[property];

        // Check presentation attribute
        const attr = current.getAttribute(property);
        if (attr) return attr;

        // Check class styles
        const cls = current.getAttribute("class");
        if (cls) {
          for (const c of cls.split(/\s+/)) {
            const rules = classStyles[c];
            if (rules && rules[property]) return rules[property];
          }
        }

        // Move to parent (but stop at SVG root)
        current = current.parentElement;
        if (current && current.tagName.toLowerCase() === "svg") break;
      }
      return null;
    };

    const fill = getInheritedStyle(shape, "fill");
    const stroke = getInheritedStyle(shape, "stroke");

    // If no fill is found, explicitly set it to "none" to avoid browser defaults
    if (!fill) {
      shape.setAttribute("fill", "none");
    }

    // Use the explicit or inherited fill value
    const finalFill = fill || "none";
    const finalStroke = stroke;

    // Prefer actual colors over "none"
    if (finalFill && finalFill !== "none") return `fill:${finalFill}`;
    if (finalStroke && finalStroke !== "none") return `stroke:${finalStroke}`;

    return "none";
  };

  // Group all shapes by color
  allShapes.forEach((shape) => {
    const key = getColorKey(shape);
    let g = groupMap.get(key);
    if (!g) {
      g = doc.createElement("g") as unknown as SVGGElement;
      g.setAttribute("data-group-color", key);
      groupMap.set(key, g);
      svgEl.appendChild(g);
    }
    g.appendChild(shape);
  });

  return new XMLSerializer().serializeToString(svgEl);
}
