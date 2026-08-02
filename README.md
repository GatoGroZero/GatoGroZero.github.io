# Portafolio — Luis Ángel Castelar Hernández

Sitio estático, bilingüe (ES/EN), sin dependencias ni build. Se publica tal cual en GitHub Pages.

```
index.html      → todo el contenido (ES y EN conviven; el CSS oculta el idioma inactivo)
styles.css      → estilos
main.js         → cambio de idioma, header al hacer scroll, animaciones de entrada
assets/         → CV en PDF
.nojekyll       → evita que GitHub Pages procese el sitio con Jekyll
```

## Ver en local

```bash
python3 -m http.server 4321
# abre http://localhost:4321
```

## Publicar en GitHub Pages

1. Crea un repositorio **público** en GitHub llamado exactamente:
   `GatoGroZero.github.io`
2. Desde esta carpeta:
   ```bash
   git remote add origin https://github.com/GatoGroZero/GatoGroZero.github.io.git
   git branch -M main
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**
4. En 1–2 minutos el sitio queda en **https://gatogrozero.github.io**

> Si prefieres un repo con otro nombre (ej. `portafolio`), la URL será
> `https://gatogrozero.github.io/portafolio` y todo funciona igual — las rutas son relativas.

## Actualizar el sitio

Edita, y luego:

```bash
git add -A && git commit -m "actualiza portafolio" && git push
```

GitHub Pages redespliega solo.

## Cómo editar el contenido bilingüe

Cada texto existe dos veces dentro de `index.html`:

```html
<span data-es>Texto en español</span><span data-en>Text in English</span>
```

El CSS oculta el que no corresponde al idioma activo. Si agregas contenido nuevo,
agrega **siempre las dos versiones** o se verá vacío en un idioma.

## Antes de publicar — revisar

- [ ] El correo, teléfono, LinkedIn y GitHub en la sección de contacto son correctos
- [ ] `assets/CV_Luis_Castelar.pdf` es la versión más reciente del CV
- [ ] Ningún caso de estudio menciona datos confidenciales de un cliente
