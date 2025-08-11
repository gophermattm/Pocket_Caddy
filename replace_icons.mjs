import fs from "fs"; import path from "path";
const ROOT = "app";
const MAP = {
  Camera:"camera", ChevronRight:"chevron-right", Thermometer:"thermometer",
  Wind:"wind", Droplets:"droplets", Activity:"activity", Info:"info",
  Home:"home", Settings:"settings", Target:"target", TrendingUp:"trending-up",
  MapPin:"map-pin", Flag:"flag", Navigation:"navigation", Layers:"layers",
  Percent:"percent", Award:"award", Sun:"sun", Cloud:"cloud",
  CloudRain:"cloud-rain", CloudSnow:"cloud-snow", CloudLightning:"cloud-lightning",
  Map:"map", Plus:"plus"
};
const walk=(d)=>fs.readdirSync(d,{withFileTypes:true})
  .flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)])
  .filter(f=>/\.(t|j)sx?$/.test(f));
const files = walk(ROOT);
let changed=0;
for (const f of files) {
  let s = fs.readFileSync(f,"utf8"), o=s;
  // drop any lucide imports
  s = s.replace(/^import\s+\{[^}]*\}\s+from\s+['"]lucide-react-native['"];?\s*\n?/gm,"");
  // ensure Feather import
  if (!/@expo\/vector-icons/.test(s)) s = `import { Feather } from "@expo/vector-icons";\n` + s;
  // swap icons (self-closing + paired)
  for (const [L,F] of Object.entries(MAP)) {
    s = s.replace(new RegExp(`<${L}([^>]*)\\/\\s*>`,"g"), `<Feather name="${F}"$1/>`);
    s = s.replace(new RegExp(`<${L}([^>]*)>([\\s\\S]*?)<\\/${L}>`,"g"), `<Feather name="${F}"$1>$2</Feather>`);
  }
  if (s!==o){ fs.writeFileSync(f,s,"utf8"); console.log("Updated:",f); changed++; }
}
console.log(changed?`Done. ${changed} files updated.`:"No changes needed.");
const leftovers = files.filter(f=>fs.readFileSync(f,"utf8").includes("lucide-react-native"));
if (leftovers.length) console.log("\nLeftover lucide imports:\n"+leftovers.join("\n")); else console.log("\nLucide removed ✅");
