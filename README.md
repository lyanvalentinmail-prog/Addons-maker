# CraftLab · Creador de addons para Minecraft Bedrock

Aplicación web instalable (PWA) en español para diseñar elementos de addons y exportarlos como paquetes `.mcaddon` que Minecraft Bedrock puede importar. Desde un navegador compatible, usa **Instalar app** para añadir CraftLab a tu dispositivo; no requiere una descarga de APK.

## Ejecutar

```bash
npm install
npm run dev
```

Para generar una versión de producción:

```bash
npm run build
npm run preview
```

## Qué incluye

- Creación y edición de entidades, objetos, bloques, recetas, botín, biomas, funciones y efectos.
- Edición de propiedades como vida, daño, durabilidad, resistencia, luz, ingredientes y probabilidades.
- Opción de usar entidades u objetos vanilla como base para modificarlos.
- Guardado automático local en el navegador e importación/exportación de proyectos CraftLab en JSON.
- Exportación de un `.mcaddon` con paquetes de comportamiento y recursos, manifiestos y archivos JSON de juego.

El contenido generado es una base editable: según la categoría y la versión de Bedrock, puede requerir texturas, modelos o ajustes adicionales dentro del juego.
