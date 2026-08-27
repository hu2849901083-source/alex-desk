import { build } from "esbuild";

await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  external: ["obsidian"],
  platform: "node",
  format: "cjs",
  target: "es2020",
  outfile: "main.js",
  loader: { ".ps1": "text" },
  sourcemap: false,
  minify: false,
  legalComments: "eof",
});
