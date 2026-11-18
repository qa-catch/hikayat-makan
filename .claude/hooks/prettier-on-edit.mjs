// PostToolUse (Write|Edit) : formate le fichier modifié avec le Prettier du projet.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { relative, isAbsolute, resolve } from "node:path";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;
const input = JSON.parse(raw);
const file = input.tool_response?.filePath ?? input.tool_input?.file_path;
if (!file || !existsSync(file)) process.exit(0);

// Ignore les fichiers hors du projet.
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const rel = relative(root, resolve(file));
if (rel.startsWith("..") || isAbsolute(rel)) process.exit(0);

const result = spawnSync(
  process.execPath,
  [
    resolve(root, "node_modules/prettier/bin/prettier.cjs"),
    "--write",
    "--ignore-unknown",
    "--log-level",
    "warn",
    file,
  ],
  { cwd: root, stdio: "inherit" },
);
process.exit(result.status ?? 0);
