import { useContext } from "react";
import { AppProviderContext } from "./context";

export const useApp = () => {
  const context = useContext(AppProviderContext);

  if (context === undefined)
    throw new Error("useApp must be used within an AppProvider");

  return context;
};
