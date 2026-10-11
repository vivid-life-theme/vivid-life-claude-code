// Reads foundation tokens from @vivid-life-theme/design-system and emits
// one Claude Code custom theme (.json) per (flavor, variant) into themes/,
// plus the plugin manifest (its version follows package.json).
// https://code.claude.com/docs/en/terminal-config#create-a-custom-theme
// https://code.claude.com/docs/en/plugins/components#themes-and-output-styles
//
//   node build.mjs           write themes/ and .claude-plugin/plugin.json
//   node build.mjs --check   exit 1 if either is out of date

import {
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import tokens from "@vivid-life-theme/design-system";

import { buildTheme, FLAVORS, slug } from "./src/theme-template.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = join(__dirname, "themes");
const MANIFEST = join(__dirname, ".claude-plugin", "plugin.json");
const CHECK = process.argv.includes("--check");

const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8"));
const json = (value) => JSON.stringify(value, null, 2) + "\n";

/** path → expected contents */
const outputs = new Map();
let count = 0;

for (const flavor of FLAVORS) {
  for (const variant of tokens.variant_hues) {
    const file = `${slug(flavor, variant)}.json`;
    count++;
    outputs.set(
      join(THEMES_DIR, file),
      json(buildTheme(flavor, variant, tokens)),
    );
  }
}

outputs.set(
  MANIFEST,
  json({
    name: "vivid-life-theme",
    displayName: "Vivid Life Theme",
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    homepage: pkg.homepage,
    repository: pkg.repository.url.replace(/^git\+/, "").replace(/\.git$/, ""),
    license: pkg.license,
    keywords: ["theme", "color-theme", "wcag", "accessibility", "vivid-life"],
    // No `experimental.themes`: the default themes/ scan picks up all 24.
    // /theme sorts plugin themes by name, so a manifest list can't impose
    // Midnight → Noon order anyway.
  }),
);

if (CHECK) {
  const stale = [...outputs].filter(
    ([path, body]) => !existsSync(path) || readFileSync(path, "utf8") !== body,
  );
  const orphans = readdirSync(THEMES_DIR).filter(
    (f) => f.endsWith(".json") && !outputs.has(join(THEMES_DIR, f)),
  );
  for (const [path] of stale)
    console.error(`stale: ${path.slice(__dirname.length + 1)}`);
  for (const file of orphans) console.error(`orphan: themes/${file}`);
  if (stale.length || orphans.length) {
    console.error("Generated files are out of date — run `npm run build`.");
    process.exit(1);
  }
  console.log(`✓ ${count} themes and plugin.json are up to date.`);
} else {
  mkdirSync(THEMES_DIR, { recursive: true });
  mkdirSync(dirname(MANIFEST), { recursive: true });
  // Clean stale files so renames don't leave orphans.
  for (const file of readdirSync(THEMES_DIR)) {
    if (file.endsWith(".json")) rmSync(join(THEMES_DIR, file));
  }
  for (const [path, body] of outputs) writeFileSync(path, body, "utf8");
  console.log(
    `Built ${count} themes (${FLAVORS.length} flavors x ${tokens.variant_hues.length} variants) into themes/, and .claude-plugin/plugin.json`,
  );
}
