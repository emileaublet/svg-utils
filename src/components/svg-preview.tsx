import parse from "html-react-parser";
import { useApp } from "./app-provider";
import { useState, useMemo } from "react";

export const SvgPreview = () => {
  const { svg } = useApp();
  const [bgColor, setBgColor] = useState("#80808011");

  // Memoize the SVG modification so it only runs when svg content changes
  const modifiedSvg = useMemo(() => {
    if (!svg) return null;

    // Parse the SVG and add a bounds rectangle
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    const svgElement = doc.querySelector("svg");

    if (svgElement) {
      const width = svgElement.getAttribute("width");
      const height = svgElement.getAttribute("height");
      const viewBox = svgElement.getAttribute("viewBox");

      let boundsRect = null;
      if (viewBox) {
        const [x, y, w, h] = viewBox.split(" ").map(Number);
        boundsRect = { x, y, width: w, height: h };
      } else if (width && height) {
        const w = parseFloat(width);
        const h = parseFloat(height);
        boundsRect = { x: 0, y: 0, width: w, height: h };
      }

      // Add bounds rectangle to the SVG
      if (boundsRect) {
        const rect = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", boundsRect.x.toString());
        rect.setAttribute("y", boundsRect.y.toString());
        rect.setAttribute("width", boundsRect.width.toString());
        rect.setAttribute("height", boundsRect.height.toString());
        rect.setAttribute("fill", "currentColor");

        // Insert as the last element so it appears on top
        svgElement.prepend(rect);
      }
    }

    return new XMLSerializer().serializeToString(doc);
  }, [svg]); // Only re-run when svg content changes

  // Memoize the parsed React elements
  const parsedSvg = useMemo(() => {
    if (!modifiedSvg) return null;
    return parse(modifiedSvg);
  }, [modifiedSvg]);

  if (!parsedSvg) return null;

  return (
    <>
      <input
        type="color"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
        className="absolute top-2 right-2"
      />
      <div
        className="w-full h-full max-h-full *:object-contain *:w-full *:h-full"
        style={{ color: bgColor }}
      >
        {parsedSvg}
      </div>
    </>
  );
};
