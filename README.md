# Addons Maker for Minecraft Bedrock

**Addons Maker es una aplicación nativa para Android**, empaquetada con Capacitor. No es necesario instalarla desde una página: GitHub Actions compila un APK instalable y permite descargarlo desde GitHub.

## Descargar e instalar en Android

1. Abre la pestaña **Actions** del repositorio y elige **Build Addons Maker for Android**.
2. En una ejecución finalizada, descarga el artefacto **addons-maker-android-apk** y descomprímelo.
3. Toca `app-debug.apk` en tu teléfono. Si Android lo solicita, permite instalar aplicaciones desde esa fuente.
4. Para exportar un addon, pulsa **Exportar addon** y elige Minecraft en el menú para compartir. También puedes guardarlo y abrir el `.mcaddon` desde Minecraft.

Al publicar una etiqueta de versión como `v1.0.0`, el mismo workflow adjunta el APK a un GitHub Release. La app requiere Android 7.0 (API 24) o posterior. Este proyecto genera el instalador Android; no genera un IPA para iPhone.

## Desarrollo

```bash
npm ci
npm run dev
```

Para compilar el proyecto Android necesitas Android Studio, Android SDK 36 y Java 21:

```bash
npm run android:sync
cd android && ./gradlew assembleDebug
```

El APK de depuración queda en `android/app/build/outputs/apk/debug/app-debug.apk`.

## Funciones

- Crear y editar entidades, objetos, bloques, recetas, botín, biomas, funciones y efectos.
- Ajustar propiedades de juego como vida, daño, durabilidad, resistencia, luz, ingredientes y probabilidades.
- Usar entidades u objetos vanilla como base de personalización.
- Guardar proyectos localmente y exportarlos/importarlos como JSON.
- Generar paquetes `.mcaddon` para abrir o compartir con Minecraft Bedrock.
