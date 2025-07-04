import { Providers } from "./providers";
import { FileUpload } from "./components/file-upload";
import { Workspace } from "./components/workspace";

export default function App() {
  return (
    <Providers>
      <Workspace />
      <FileUpload />
    </Providers>
  );
}
