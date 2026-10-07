import fs from "node:fs";
const css = fs.readFileSync(new URL("./g.css", import.meta.url), "utf8");
const blocks = css.split("/* ").filter(b => b.startsWith("latin */"));
let out = "";
let i = 0;
for (const b of blocks) {
  const fam = b.match(/font-family: '([^']+)'/)[1].replace(/ /g, "");
  const w = b.match(/font-weight: (\d+)/)[1];
  const url = b.match(/url\(([^)]+)\)/)[1];
  const name = `${fam}-${w}.woff2`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(new URL(`./${name}`, import.meta.url), buf);
  out += "/* " + b.replace(url, name);
  i++;
}
fs.writeFileSync(new URL("./fonts.css", import.meta.url), out);
console.log(i, "fonts");
