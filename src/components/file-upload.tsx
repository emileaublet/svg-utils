import { toast } from "sonner";
import { useApp } from "./app-provider";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "./ui/shadcn-io/dropzone";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const FileUpload = () => {
  const {
    setFiles,
    files,
    minSize = 1024, // Default to 1KB
    maxSize = 50 * 1024 * 1024,
  } = useApp();

  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  if (files && files.length > 0) return null;

  return (
    <div className="grid h-screen grid-cols-2 gap-8 w-full bg-secondary p-8">
      <Dropzone
        maxSize={maxSize}
        minSize={minSize}
        multiple={false}
        accept={{ "image/svg+xml": [] }}
        onDrop={handleDrop}
        src={files}
        onDropRejected={(rejectedFiles) => {
          const numberOfFiles = rejectedFiles.length;
          if (numberOfFiles > 1) {
            toast.error(
              `Rejected ${numberOfFiles} files. Only one file is allowed.`
            );
            return;
          }
          if (!rejectedFiles[0].file.type.includes("image/svg+xml")) {
            toast.error("Only SVG files are allowed.");
            return;
          }
          if (rejectedFiles[0].file.size > maxSize) {
            toast.error(`File size exceeds the maximum limit of 
                ${maxSize / 1024 / 1024}MB.`);
            return;
          }
          if (rejectedFiles[0].file.size < minSize) {
            toast.error(`File size is below the minimum limit of 
                ${minSize / 1024}KB.`);
            return;
          }
          toast.error("File type is not supported.");
        }}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
      <Card>
        <CardHeader>
          <CardTitle>Paste SVG Content</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-col gap-4">
          <Textarea
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text/plain");
              if (text.trim().startsWith("<svg")) {
                setFiles([
                  new File([text], "pasted.svg", { type: "image/svg+xml" }),
                ]);
              } else {
                toast.error("Pasted content is not a valid SVG.");
              }
            }}
            onChange={(e) => {
              const value = e.target.value;
              if (value.trim().startsWith("<svg")) {
                setFiles([
                  new File([value], "pasted.svg", { type: "image/svg+xml" }),
                ]);
              }
            }}
            className="w-full h-full"
            placeholder={`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n\t<circle cx="50" cy="50" r="40" fill="red" />\n</svg>
            `}
          />
        </CardContent>
      </Card>
    </div>
  );
};
