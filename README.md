# Addons Maker for Minecraft Bedrock

Creador web instalable para diseñar complementos de Minecraft Bedrock y exportarlos en formato `.mcaddon`. La interfaz está en español y los proyectos se guardan automáticamente en este navegador.

## Instalar desde GitHub

Cuando GitHub Actions complete la publicación en Pages, abre **https://lyanvalentinmail-prog.github.io/Addons-maker/** desde el dispositivo donde quieras usar la app y elige **Instalar app**.

- **Android / Chrome:** toca *Instalar app* o abre el menú ⋮ → *Instalar app* / *Añadir a pantalla principal*.
- **iPhone / iPad:** en Safari toca *Compartir* → *Añadir a pantalla de inicio*.
- **Computadora:** en Chrome o Edge usa el icono de instalación de la barra de direcciones o el menú del navegador.

La publicación se realiza automáticamente al actualizar `main`, mediante el workflow **Deploy Addons Maker to GitHub Pages**. Si GitHub Pages aún no está habilitado en el repositorio, selecciónalo en **Settings → Pages → Build and deployment → GitHub Actions**.

## Ejecutar en desarrollo

```bash
npm ci
npm run dev
```

Crear una compilación de producción y probarla localmente:

```bash
npm run build
npm run preview
```

## Funciones

- Crear y editar entidades, objetos, bloques, recetas, botín, biomas, funciones y efectos.
- Ajustar propiedades como vida, daño, durabilidad, resistencia, luz, ingredientes y probabilidades.
- Elegir entidades y objetos vanilla como base de personalización.
- Guardar/importar proyectos de Addons Maker en JSON y exportar paquetes `.mcaddon`.
- Instalar como PWA desde GitHub Pages y abrir la app sin conexión tras la primera carga.

El addon exportado es un punto de partida editable; según la categoría y la versión de Bedrock, puede requerir texturas, modelos o ajustes adicionales en el juego.
