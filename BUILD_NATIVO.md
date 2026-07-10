# Generar la app nativa (.apk / .ipa)

El proyecto ya tiene `eas.json` configurado con 3 perfiles: `development`, `preview` (para instalar directo, sin tienda) y `production` (para subir a Play Store / App Store).

## Pasos (una sola vez)

1. Crea una cuenta gratis en https://expo.dev si no tienes una.
2. En tu terminal, dentro del repo:
   ```bash
   pnpm install
   npx eas login
   npx eas init
   ```
   `eas init` vincula el repo a tu cuenta de Expo y agrega un `projectId` a `app.config.ts` automáticamente.

## Generar el APK para probar en tu Android (sin Play Store)

```bash
pnpm build:android
```

Al terminar (5-15 min, se compila en la nube de Expo, gratis en el tier free), te da un link de descarga directa del `.apk`. Lo abres desde el celular y se instala.

## Generar para iPhone

```bash
pnpm build:ios
```

Para iOS necesitas una cuenta de Apple Developer ($99/año) si quieres instalarlo fuera de simuladores — EAS te guía interactivamente para conectar las credenciales la primera vez.

## Producción (Play Store / App Store)

```bash
pnpm build:android:prod   # genera .aab para subir a Play Store
pnpm build:ios:prod       # genera build para App Store Connect
npx eas submit            # sube el build directo a la tienda (opcional)
```

## Nota
Yo (Claude) dejé todo configurado y verificado (`eas.json`, scripts en `package.json`, `eas-cli` instalado), pero `eas login` / `eas init` requieren tu cuenta personal de Expo — no puedo hacer ese paso por ti sin tus credenciales.
