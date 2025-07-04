import { AppProvider } from "./components/app-provider";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="h-screen w-screen ">
          {children}
          <Toaster position="top-right" richColors closeButton />
        </div>
      </ThemeProvider>
    </AppProvider>
  );
};
