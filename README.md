# Portafolio · Luis Ángel Castelar Hernández

Sitio estático, bilingüe (ES/EN), sin dependencias ni build. Se publica tal cual en GitHub Pages.

```
index.html      → todo el contenido (ES y EN conviven; el CSS oculta el idioma inactivo)
styles.css      → paleta, layout y motion del sitio
demos.css       → estilos de las demos interactivas
mockups.css     → maquetas de producto (cada app con SU paleta, no la del sitio)
main.js         → idioma, scroll-reveal, contadores, progreso, botón magnético
cats.css        → posición y movimiento de los gatos
demos.js        → las 4 demos interactivas
mockups.js      → las 3 maquetas de producto
cats.js         → sprites pixel de los gatos y su comportamiento
scenes.css      → escenarios de fondo
scenes.js       → sakura, torii, pagoda, monte, bambú y olas
assets/         → CV en PDF
.nojekyll       → evita que GitHub Pages procese el sitio con Jekyll
```

## Paleta

El estilo es **pixel japonés**: laca negra, carmesí y oro. Los tonos viven en
`:root` de `styles.css`:

| Variable | Color | Uso |
|---|---|---|
| `--sumi` | `#121312` | fondo, laca negra |
| `--crimson` | `#ad0013` | sol naciente, botones, títulos grandes |
| `--gold` / `--gold-lt` | `#a67d43` / `#c9a15c` | acentos y texto destacado |
| `--washi` | `#ece5d8` | texto principal |

> El carmesí sobre negro da **3.3:1**. Alcanza para titulares grandes, pero no
> para texto pequeño. En etiquetas y textos chicos se usa `--gold-lt` (7.8:1).

Tipografías: **DotGothic16** para títulos (pixel japonés y legible) y
**Zen Maru Gothic** para leer. Antes se usaba Pixelify Sans y confundía la C
con la O.

Las maquetas de producto **no** usan esta paleta: cada una conserva la de su
app real, en los temas `.t-paystream`, `.t-paymet` y `.t-rms` de `mockups.css`.

## Escenarios de tinta

Cada proyecto tiene su propio ambiente, dibujado en SVG dentro de `scenes.js`.
No son imágenes: son paths, así que pesan poco y se ven limpios a cualquier
tamaño.

| Escena | Dónde | Motivo |
|---|---|---|
| `sakura` | el nombre | Rama con flores de cinco pétalos y pétalos cayendo |
| `nubes` | Gestión de Solicitudes | Nubes japonesas en bandas, con volutas en las puntas |
| `koi` | Devengo | Tres carpas nadando entre corrientes y remolinos |
| `grullas` | Paymet | Luna, niebla en trazos y grullas en vuelo |
| `crisantemo` | Gestión de Recursos | Crisantemos de tres capas de pétalos sobre sus tallos |
| `asanoha` | Stack | Trama geométrica de hoja de cáñamo |

Cada escena se divide en tres capas (`capa-lenta`, `capa-media`, `capa-rapida`)
que se desplazan a distinta velocidad **con el scroll**. El movimiento nunca es
en bucle: la guía de UX que se consultó es explícita en que las animaciones
infinitas decorativas distraen. Si el usuario no se mueve, la escena tampoco.

Todas van detrás del contenido (`z-index: 0` contra `1`) y con una máscara que
las desvanece antes de llegar al texto.

## La katana

El cursor es una katana (`katana.js`). Sigue al puntero con un retraso suave,
gira al hacer clic y deja una estela en diagonal con unos pétalos saltando.
Se oculta sola en pantallas táctiles, en móvil y con `prefers-reduced-motion`.

El botón **Efectos** de la barra superior apaga la katana y los pétalos, y lo
recuerda en `localStorage`. Importante: al apagar, el contenido sigue visible.
La clase `.no-cats` fuerza `opacity: 1` sobre lo que normalmente aparece al
hacer scroll, para que nadie se quede con una página en blanco.

## Sin rayas largas

El texto evita el guion largo a propósito. Si editas contenido, usa coma, dos
puntos, paréntesis o punto y seguido en su lugar.

> Cuidado al tocar `styles.css`: la regla global `b, strong { color: var(--fg) }`
> se cuela dentro de las maquetas. `mockups.css` la neutraliza con
> `.mk b { color: inherit }`. Sin eso, el tema claro queda ilegible.

## Las demos

Cuatro demos funcionan de verdad dentro de la página, sin servidor:

| Demo | Dónde | Qué demuestra |
|---|---|---|
| Flujo de solicitudes | Caso UAEM | Máquina de estados, permisos por rol, auditoría, generación de documento |
| Modelo entidad-relación | Caso UAEM | Diseño de esquema e índices justificados por consulta |
| Control de acceso | Caso UAEM | Autorización del lado del servidor, 200 vs 403 |
| Salario devengado | Caso Devengo | Reglas de negocio financieras en tiempo real |

Son **reconstrucciones con datos ficticios**. El código es original de estas demos,
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
> `https://gatogrozero.github.io/portafolio` y todo funciona igual, porque las rutas son relativas.

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

## Antes de publicar, revisar

- [ ] El correo, teléfono, LinkedIn y GitHub en la sección de contacto son correctos
- [ ] `assets/CV_Luis_Castelar.pdf` es la versión más reciente del CV
- [ ] Ningún caso de estudio menciona datos confidenciales de un cliente
