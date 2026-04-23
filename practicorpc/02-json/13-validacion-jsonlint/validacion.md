# Validación de los JSON del práctico

## Archivos a validar

- `../10-alumnos-json/alumnos.json`
- `../11-inventario-json/inventario_informatica.json`
- `../12-censo-json/censo_2022_5_registros.json`

## Validación pedida por el enunciado: JSONLint

1. Abrí <https://jsonlint.com/>.
2. Pegá el contenido de cualquiera de los tres archivos.
3. Ejecutá la validación.

## Validación local adicional

También quedó un script local para comprobar sintaxis con Node.js:

```bash
node validar_json.js
```

## Resultado esperado

Los tres archivos deben validar correctamente porque son JSON sintácticamente válidos y fueron probados localmente.
