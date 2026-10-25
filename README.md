# Addons Maker for Minecraft Bedrock

**Addons Maker es una app nativa para Android** hecha para crear addons de Minecraft Bedrock. Incluye una biblioteca visual local con **3.825 imágenes reales de mobs, objetos, bloques, estructuras, armas, interfaz, partículas y más**; las imágenes están dentro del APK y funcionan sin conexión.

## Descargar e instalar en Android

1. Abre la pestaña **Actions** del repositorio y elige **Build Addons Maker for Android**.
2. En una ejecución finalizada, descarga el artefacto **addons-maker-android-apk** y descomprímelo.
3. Toca `app-debug.apk` en tu teléfono. Si Android lo solicita, permite instalar aplicaciones desde esa fuente.
4. En la app, abre **Biblioteca visual**, busca un mob, ítem o bloque y toca su imagen para añadirlo al addon.
5. Pulsa **Exportar addon** y elige Minecraft en el menú para compartir. También puedes guardar el `.mcaddon` y abrirlo desde Minecraft.

El workflow construye el APK en cada push. Al publicar una etiqueta de versión como `v1.0.0`, también adjunta el instalador a un GitHub Release. La app requiere Android 7.0 (API 24) o posterior; este proyecto genera un APK Android, no un IPA para iPhone.

## Desarrollo

```bash
npm ci
npm run dev
```

Para compilar el APK localmente necesitas Android Studio, Android SDK 36 y Java 21:

```bash
npm run android:sync
cd android && ./gradlew assembleDebug
```

El APK de depuración queda en `android/app/build/outputs/apk/debug/app-debug.apk`.

## Funciones

- Biblioteca offline con 3.825 imágenes navegables y búsqueda por categoría/subcategoría.
- Importar paquetes `.mcpack`, `.mcaddon` o `.zip` propios y explorar sus imágenes bajo `textures/`; se guardan localmente en el dispositivo.
- Usar imágenes importadas como texturas para entidades, objetos y bloques personalizados y empaquetarlas en el `.mcaddon` exportado.
- Crear y editar entidades, objetos, bloques, recetas, botín, biomas, funciones y efectos.
- Añadir imágenes del catálogo a los elementos y usarlas en los iconos de ítems/bloques exportados.
- Ajustar vida, daño, durabilidad, resistencia, luz, ingredientes y probabilidades.
- Usar entidades, objetos y bloques vanilla como base de personalización.
- Guardar proyectos localmente y exportarlos/importarlos como JSON.
- Exportar paquetes `.mcaddon` para abrir o compartir con Minecraft Bedrock desde Android.

Para acceder a texturas originales de un pack, impórtalo desde **Biblioteca visual → Importar .mcpack**. También se admiten `.mcaddon` y `.zip`; las imágenes se almacenan localmente en la app y solo se incluyen en una exportación si las seleccionas para un elemento. La biblioteca incluida contiene miniaturas comunitarias, no el conjunto completo de mapas UV oficiales de Minecraft. El proyecto no redistribuye los archivos oficiales de Mojang.

## Atribución de imágenes

Las miniaturas de la biblioteca visual son de la colección abierta **[Webisso/minecraft-item-icons](https://github.com/Webisso/minecraft-item-icons)** y se incluyen con atribución y licencia MIT. Consulta `assets/minecraft-item-icons/LICENSE` y `assets/minecraft-item-icons/ATTRIBUTION.md`. Minecraft es marca de Mojang/Microsoft; Addons Maker no está afiliada a esas empresas.
