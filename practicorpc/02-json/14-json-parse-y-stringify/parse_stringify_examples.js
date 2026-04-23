const fs = require("node:fs");
const path = require("node:path");

function loadJson(fileName) {
  const filePath = path.join(__dirname, fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

const students = loadJson("../10-alumnos-json/alumnos.json");
const inventory = loadJson("../11-inventario-json/inventario_informatica.json");

console.log("=== Ejemplo 1: alumnos.json ===");
console.log("Cantidad de alumnos:", students.students.length);
console.log("Primer alumno parseado:", students.students[0]);
console.log("JSON.stringify del primer alumno:");
console.log(JSON.stringify(students.students[0], null, 2));

console.log("\n=== Ejemplo 2: inventario_informatica.json ===");
console.log("Cantidad de ítems:", inventory.inventario.length);
console.log("Primer ítem parseado:", inventory.inventario[0]);
console.log("JSON.stringify del catálogo completo:");
console.log(JSON.stringify(inventory, null, 2));
