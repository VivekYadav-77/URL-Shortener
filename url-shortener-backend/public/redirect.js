import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sendInvalidLinkPage = (res) => {
  return res
    .status(410)
    .sendFile(path.join(__dirname, "./error/link-invalid.html"));
};
