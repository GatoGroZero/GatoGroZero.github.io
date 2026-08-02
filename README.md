# Portafolio — Luis Ángel Castelar Hernández

Sitio estático, bilingüe (ES/EN), sin dependencias ni build. Se publica tal cual en GitHub Pages.

```
index.html      → todo el contenido (ES y EN conviven; el CSS oculta el idioma inactivo)
styles.css      → estilos del sitio
demos.css       → estilos de las demos interactivas
main.js         → cambio de idioma, header al hacer scroll, animaciones de entrada
demos.js        → las 4 demos interactivas
assets/         → CV en PDF
.nojekyll       → evita que GitHub Pages procese el sitio con Jekyll
```

## Las demos

Cuatro demos funcionan de verdad dentro de la página, sin servidor:

| Demo | Dónde | Qué demuestra |
|---|---|---|
| Flujo de solicitudes | Caso UAEM | Máquina de estados, permisos por rol, auditoría, generación de documento |
| Modelo entidad-relación | Caso UAEM | Diseño de esquema e índices justificados por consulta |
| Control de acceso | Caso UAEM | Autorización del lado del servidor, 200 vs 403 |
| Salario devengado | Caso Devengo | Reglas de negocio financieras en tiempo real |

Son **reconstrucciones con datos ficticios**. El código es original de estas demos —
no contienen nada de los sistemas de los clientes. Cada demo lo dice en su pie.

Para agregar o cambiar una: todo vive en `demos.js`, un módulo por demo, y se monta
en el `<div data-demo="...">` correspondiente de `index.html`.

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
