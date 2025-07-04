"use client";

import { useEffect, useState } from "react";
import { AppProviderContext } from "./context";
import { svgToPaths } from "@/lib/svgToPaths";
import { groupByColor } from "@/lib/groupByColor";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<File[] | undefined>(undefined);
  const [svg, setSvg] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onload = () => {
          const svgPaths = svgToPaths(reader.result as string);
          setSvg(groupByColor(svgPaths));
        };
        reader.readAsText(file);
      } else {
        setSvg(undefined);
      }
    } else {
      setSvg(undefined);
    }
  }, [files]);

  return (
    <AppProviderContext.Provider
      value={{
        files,
        setFiles,
        svg,
        setSvg,
      }}
    >
      {children}
    </AppProviderContext.Provider>
  );
};
