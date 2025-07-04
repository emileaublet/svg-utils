import { getAspectRatio } from "./getAspectRatio";

export const svgStats = (svg: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    throw new Error("Invalid SVG content");
  }

  const w = parseFloat(svgElement.getAttribute("width") || "0");
  const h = parseFloat(svgElement.getAttribute("height") || "0");
  const viewBox = (svgElement.getAttribute("viewBox") || "0 0 0 0")
    .split(" ")
    .map(Number);

  const width = w || viewBox[2] - viewBox[0] || 0;
  const height = h || viewBox[3] - viewBox[1] || 0;

  const aspectRatio = getAspectRatio(width, height);

  // count all different elements in the svg (e.g. {rect: 12, circle: 5, path: 8})
  const elementsCount: Record<string, number> = {};
  const elements = doc.querySelectorAll("*");
  elements.forEach((el) => {
    if (el.tagName.includes(":")) {
      // Skip namespaced elements (e.g. "svg:rect")
      return;
    }
    const tagName = el.tagName.toLowerCase();
    elementsCount[tagName] = (elementsCount[tagName] || 0) + 1;
  });

  // Add the elements count to the SVG string
  svg += `\n<!-- Elements count: ${JSON.stringify(elementsCount)} -->`;

  // describe the SVG as a tree structure ([{svg: [{g: [rect, rect, path, path]}, {g: [circle, circle]}]}])
  type TreeNode = string | Record<string, (string | TreeNode)[]>;

  const describeElement = (
    element: Element
  ): Record<string, (string | TreeNode)[]> => {
    const children = Array.from(element.children);
    if (children.length === 0) {
      return { [element.tagName.toLowerCase()]: [] };
    }

    const childElements = children.map((child): string | TreeNode => {
      const grandchildren = Array.from(child.children);
      if (grandchildren.length === 0) {
        return child.tagName.toLowerCase();
      } else {
        return describeElement(child);
      }
    });

    return { [element.tagName.toLowerCase()]: childElements };
  };

  const svgTree = [describeElement(svgElement)];

  // Calculate the size of the SVG string
  const svgBlob = new Blob([svg], { type: "image/svg+xml" });
  const svgSize = svgBlob.size;

  const uniqueColorsInSvg = new Set<string>();
  const colorAttributes = ["fill", "stroke", "stop-color"];
  const ignoreList = [
    "none",
    "currentColor",
    "transparent",
    "inherit",
    "initial",
    "unset",
  ];
  elements.forEach((el) => {
    colorAttributes.forEach((attr) => {
      const color = el.getAttribute(attr);

      if (!color || ignoreList.includes(color)) {
        return;
      }

      if (color) {
        uniqueColorsInSvg.add(color);
      }
    });
  });

  return {
    uniqueColorsInSvg: Array.from(uniqueColorsInSvg),
    width,
    height,
    aspectRatio,
    viewBox,
    elementsCount,
    size: svgSize,
    svgTree,
  };
};
