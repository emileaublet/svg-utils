import parse from "html-react-parser";
import { useApp } from "./app-provider";

export const SvgPreview = () => {
  const { svg } = useApp();
  if (!svg) return null;

  return (
    <div className="w-full h-full max-h-full *:object-contain *:w-full *:h-full">
      {parse(svg)}
    </div>
  );
};
