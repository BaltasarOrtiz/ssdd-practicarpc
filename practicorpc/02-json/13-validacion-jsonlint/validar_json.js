const fs = require("node:fs");
const path = require("node:path");

const files = [
  "../10-alumnos-json/alumnos.json",
  "../11-inventario-json/inventario_informatica.json",
  "../12-censo-json/censo_2022_5_registros.json",
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  JSON.parse(raw);
  console.log(`OK -> ${file}`);
}

console.log("Todos los archivos JSON son sintácticamente válidos.");
