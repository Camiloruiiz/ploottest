import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createNextConfig } from "../../packages/config-eslint/next.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createNextConfig(__dirname);
