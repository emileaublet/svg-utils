import SVGPathCommander from "svg-path-commander";

/**
 * Converts all SVG shape elements (<circle>, <rect>, <ellipse>, <line>, <polyline>, <polygon>)
 * within an SVG string to <path> elements, preserving other attributes.
 *
 * @param svgString - The input SVG as a string.
 * @returns The transformed SVG string with only <path> elements.
 * @throws If the input string does not contain a valid <svg> element.
 */
export function svgToPaths(svgString: string): string {
  // Parse SVG into a DOM (native in browsers)
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = doc.documentElement;

  if (!svgElement || svgElement.tagName.toLowerCase() !== "svg") {
    throw new Error("Invalid SVG string: no <svg> element found.");
  }

  // Shape tags to convert
  const shapeTags = [
    "circle",
    "ellipse",
    "rect",
    "line",
    "polyline",
    "polygon",
  ] as const;

  // Convert each shape to a <path>
  for (const tag of shapeTags) {
    const nodes = Array.from(doc.getElementsByTagName(tag));
    for (const el of nodes) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pathEl = SVGPathCommander.shapeToPath(el as any, true, doc as any);
      // Copy over non-shape-specific attributes
      if (pathEl && typeof pathEl !== "boolean") {
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          if (
            !/^(cx|cy|r|rx|ry|x|y|width|height|points|x1|y1|x2|y2)$/i.test(
              attr.name
            )
          ) {
            pathEl.setAttribute(attr.name, attr.value);
          }
        }
        el.parentNode?.replaceChild(pathEl, el);
      }
    }
  }

  // Serialize and return the updated <svg>
  return new XMLSerializer().serializeToString(svgElement);
}
