import { createContext } from "react";

export const AppProviderContext = createContext<{
  files: File[] | undefined;
  setFiles: (files: File[] | undefined) => void;
  minSize?: number;
  maxSize?: number;
  svg?: string;
  setSvg?: (svg?: string) => void;
}>({
  files: undefined,
  setFiles: () => {},
  minSize: 1024, // Default to 1KB
  maxSize: 50 * 1024 * 1024, // Default to 50MB
});
