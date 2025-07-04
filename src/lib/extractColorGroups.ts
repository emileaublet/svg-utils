export function extractColorGroups(svgString: string): Record<string, string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgEl = doc.documentElement;

  if (!svgEl || svgEl.tagName.toLowerCase() !== "svg") {
    throw new Error("Invalid SVG string: no <svg> element found.");
  }

  // Get original SVG attributes for bounding box
  const originalWidth = svgEl.getAttribute("width");
  const originalHeight = svgEl.getAttribute("height");
  const originalViewBox = svgEl.getAttribute("viewBox");
  const originalXmlns = svgEl.getAttribute("xmlns");

  // Find all groups with data-group-color attribute
  const colorGroups = Array.from(svgEl.querySelectorAll("g[data-group-color]"));

  const result: Record<string, string> = {};

  colorGroups.forEach((group) => {
    const colorKey = group.getAttribute("data-group-color");
    if (!colorKey) return;

    // Create a new SVG document
    const newDoc = parser.parseFromString("<svg></svg>", "image/svg+xml");
    const newSvgEl = newDoc.documentElement;

    // Copy original SVG attributes to maintain bounding box
    if (originalWidth) newSvgEl.setAttribute("width", originalWidth);
    if (originalHeight) newSvgEl.setAttribute("height", originalHeight);
    if (originalViewBox) newSvgEl.setAttribute("viewBox", originalViewBox);
    if (originalXmlns) newSvgEl.setAttribute("xmlns", originalXmlns);

    // Copy any defs from the original SVG (for styles, gradients, etc.)
    const originalDefs = svgEl.querySelector("defs");
    if (originalDefs) {
      const clonedDefs = originalDefs.cloneNode(true);
      newSvgEl.appendChild(clonedDefs);
    }

    // Clone the group and its contents
    const clonedGroup = group.cloneNode(true);
    newSvgEl.appendChild(clonedGroup);

    // Serialize the new SVG
    const serializedSvg = new XMLSerializer().serializeToString(newSvgEl);
    result[colorKey] = serializedSvg;
  });

  return result;
}
