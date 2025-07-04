import { useApp } from "./app-provider";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { svgStats } from "@/lib/svgStats";

export const Controls = ({ svg }: { svg: string }) => {
  const { setSvg = () => null, setFiles } = useApp();
  if (!svg) return null;
  const handleClear = () => {
    setSvg();
    setFiles(undefined);
  };

  const stats = svgStats(svg);

  return (
    <Card className="h-full max-h-full flex">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
        <CardDescription>
          This is where you can add controls to manipulate the SVG.
        </CardDescription>
      </CardHeader>
      <CardContent className="grow overflow-scroll">
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button variant="outline" className="w-full" onClick={handleClear}>
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
};
