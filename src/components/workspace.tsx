import { useApp } from "./app-provider";
import { Controls } from "./controls";
import { SvgPreview } from "./svg-preview";

export const Workspace = () => {
  const { svg } = useApp();
  if (!svg) return null;

  return (
    <div className="h-screen w-screen grid grid-cols-[400px_1fr] grid-rows-1 p-8">
      <Controls svg={svg} />
      <SvgPreview />
    </div>
  );
};
