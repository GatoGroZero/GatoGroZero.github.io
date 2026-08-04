# Brief de rediseño · Portafolio de Luis Ángel Castelar

> Este documento es para entregárselo a otra herramienta de diseño o a un
> diseñador. Contiene todo lo necesario para rehacer el sitio sin haber estado
> en las conversaciones anteriores. Copia desde aquí hacia abajo.

---

## 1. Quién es y qué necesita

Luis Ángel Castelar Hernández, desarrollador Full Stack en Jiutepec, Morelos,
México. Estudia TSU en Desarrollo de Software Multiplataforma en la UTEZ y
trabaja en la Universidad Autónoma del Estado de Morelos.

Su terreno fuerte es **Java 21 con Spring Boot** del lado del servidor y
**React / Next.js** del lado del cliente, con **MySQL y PostgreSQL** debajo.
También hace móvil con Flutter y diseña las interfaces él mismo en Figma.

Necesita un portafolio web que le consiga entrevistas. Hoy tiene uno publicado
en `https://gatogrozero.github.io` que funciona pero cuyo diseño no lo
convence.

## 2. Audiencia

Dos, con el mismo peso:

- **México**: reclutadores de instituciones, consultoras y empresas locales.
  Perfil conservador. Revisan el sitio junto al CV.
- **Remoto internacional**: startups y empresas de producto. Toleran más
  personalidad, pero exigen claridad técnica inmediata.

Por eso el sitio es **bilingüe español e inglés**, con un botón para cambiar.

## 3. Dirección de diseño

**Sobrio y profesional, con un gato pixel como firma personal.**

La versión actual está construida sobre un tema completo de gatos samurái,
pixel art japonés y colores negro, carmesí y oro. Es demasiado. La nueva
versión debe invertir la proporción:

- El diseño base debe sentirse **serio, limpio y con buen manejo de espacio**,
  como el sitio de un estudio de producto o de un ingeniero senior.
- El **gato pixel aparece una sola vez**, pequeño, como sello. Puede estar
  junto al nombre, en el pie, o como favicon. Nunca como estructura.
- Cero animaciones decorativas por default. El movimiento debe servir para algo
  (guiar la mirada, dar retroalimentación), no para adornar.

### Lo que NO hay que hacer

Esto viene de iteraciones que ya se probaron y no funcionaron:

- Nada de ámbar o violeta neón sobre negro. Se ve genérico, es la paleta que
  produce media internet ahora.
- Nada de tipografías pixel para leer. Se probó Pixelify Sans y confundía la
  C con la O. Si se usa una pixel, que sea solo en piezas cortas.
- Nada de rayas largas en el texto (—). Es una petición explícita de Luis.
  Usar coma, dos puntos, paréntesis o punto y seguido.
- Nada de gatos caminando por franjas entre secciones. Se probó y satura.

## 4. Restricción que manda sobre todo lo demás

**Luis no puede mostrar el trabajo real.** Los sistemas pertenecen a las
instituciones y empresas para las que los hizo. No hay código público, no hay
capturas, no hay datos.

La solución que ya funciona y **debe conservarse** es esta: en lugar de enseñar
el trabajo, el sitio **reconstruye sus mecanismos**. Todo con datos inventados
y código escrito desde cero.

Esto no es un adorno, es el corazón del sitio y su mayor diferenciador. Un
portafolio que solo describe proyectos es intercambiable. Uno donde el
reclutador puede *usar* algo, no.

### Las cuatro demos que deben sobrevivir

Funcionan hoy, sin servidor ni dependencias, dentro de la página:

| Demo | Qué demuestra |
|---|---|
| **Flujo de solicitudes** | Cambias entre 4 roles y mueves una solicitud por su ciclo. El sistema te bloquea cuando no te toca y te dice a quién le corresponde. Máquina de estados y permisos. |
| **Modelo entidad-relación** | Diagrama interactivo. Cada tabla explica por qué existe cada índice. |
| **Control de acceso** | Eliges rol, llamas un endpoint y ves 200 o 403 con la anotación que tomó la decisión. |
| **Motor de salario devengado** | Mueves sueldo, ciclo de nómina y antigüedad, y las reglas de negocio se recalculan en vivo. |

### Las tres maquetas de producto

Pantallas dibujadas desde cero que representan cómo se ven las plataformas.
Cada una conserva la paleta real de su producto, distinta a la del sitio.
Deben seguir viéndose como capturas enmarcadas, no como parte del portafolio.

Es obligatorio que el sitio diga con claridad que **son prototipos, no
pantallas finales**, porque las reales están sujetas a las empresas.

## 5. Contenido que debe estar

### Encabezado
Nombre, rol (Desarrollador Full Stack), ubicación con disponibilidad para
reubicación, dos botones (ver trabajo, descargar CV) y el cambio de idioma.

### Aviso de confidencialidad
Un bloque visible que explique, sin sonar a disculpa, por qué no hay capturas
reales y qué es lo que sí se está mostrando.

### Casos de estudio (4)

**1. Sistema de Gestión de Solicitudes · UAEM · 2026 a la fecha · en producción**
Una universidad llevaba las solicitudes de servicio en papel y hojas de cálculo
sueltas. Nadie sabía en qué estado estaba cada trámite ni quién lo había
aprobado, y el reporte mensual se transcribía a mano.
Lo que hace: ordena el trámite entre cuatro perfiles, deja rastro de cada
aprobación, genera el reporte solo, resuelve dudas frecuentes con un asistente
y avisa por correo en cada cambio.
Stack: Java 21, Spring Boot, Spring Security, JPA, MySQL, React.
Aquí van las cuatro demos.

**2. Devengo · Hackathon Track Genesis, CDMX · 2026**
Un trabajador que ya ganó su salario no debería esperar a la quincena ni
recurrir a préstamos abusivos. La plataforma permite el adelanto con sus
reglas, controles de riesgo y liquidación.
Stack: Next.js 16, React 19, TypeScript, Tailwind 4, Node, Rust sobre Soroban
y Stellar, Expo, Flutter, PostgreSQL, Keycloak, Docker.

**3. Paymet Bienestar · 2026**
Mucha gente llega a fin de quincena sin haber apartado nada, no por falta de
voluntad sino porque ahorrar exige decidirlo cada vez. Paymet lo vuelve
prestación: la empresa lo ofrece, el trabajador fija una meta y la aportación
sale sola de la nómina. Tiene tres caras (API, app móvil y panel de recursos
humanos) y las reglas del dinero no podían escribirse tres veces.
Stack: Kotlin, Gradle, Flutter, Dart, REST, SQL.

**4. Sistema de gestión de recursos · Centro de Desarrollo UTEZ · 2026**
El centro presta equipo caro a estudiantes y docentes. El control vivía en
libretas, se perdía material cada semestre y nadie sabía quién tenía qué. El
sistema lo pone en un solo lugar con préstamos fechados y alertas.
Fue además su primer proyecto formal en equipo.
Stack: React, Spring Boot, Kotlin, Android, MySQL, Git.

### Proyectos personales (3, breves)
Asistente de voz que corre sin internet (Python, Vosk). Servidor con HTTPS
local para seguimiento facial en el navegador (Node, WebRTC, TLS). Suites de
pruebas automatizadas (Selenium, Cypress).

### Stack
Agrupado en back end, front end, datos y herramientas.

### Perfil
Trabaja en la costura entre capas: diseña el modelo de datos, escribe el
endpoint, prototipa en Figma y lo construye. Se toma en serio la seguridad del
lado del servidor y la documentación, porque un sistema que solo su autor puede
desplegar no está terminado.

### Trayectoria
UAEM 2026 a la fecha, Track Genesis 2026, Centro de Desarrollo UTEZ 2026,
Servicio Médico UTEZ 2025, TSU en UTEZ desde 2024.
Certificación Oracle en fundamentos de bases de datos.

### Contacto
castelar999@gmail.com · linkedin.com/in/luisangelcastelar ·
github.com/GatoGroZero · +52 777 360 4976

## 6. Restricciones técnicas

- **Sitio estático puro.** HTML, CSS y JavaScript. Sin build, sin framework,
  sin dependencias. Se publica tal cual en GitHub Pages.
- **Bilingüe.** Cada texto existe dos veces en el HTML, con atributos `data-es`
  y `data-en`; el CSS oculta el idioma inactivo. La elección se guarda.
- **Sin recursos externos** salvo tipografías de Google Fonts.
- **Accesibilidad real.** Contraste mínimo 4.5:1 en texto pequeño, foco visible
  por teclado, y respetar `prefers-reduced-motion`.
- **Responsive** verificado en 375, 768, 1024 y 1440 píxeles. Sin scroll
  horizontal en ningún ancho.

## 7. Tropiezos ya documentados

Errores reales que costaron tiempo. Vale la pena no repetirlos:

- Una regla global `b, strong { color: ... }` se colaba dentro de las maquetas
  y dejaba el texto de la maqueta clara en 1.19:1, invisible. Cualquier
  componente con tema propio necesita blindarse.
- El scroll reveal con IntersectionObserver dejaba secciones invisibles para
  siempre si el usuario saltaba con un ancla o Ctrl+End: el elemento pasa de
  estar debajo a estar encima sin cruzar el viewport y el observador nunca
  dispara. Conviene comprobar posición en scroll.
- `min-width: auto` en items de grid: un hijo ancho (un diagrama SVG) infla la
  página entera en móvil. Hace falta `min-width: 0`.
- `preserveAspectRatio="slice"` en SVG decorativos recorta el dibujo y solo
  deja ver una franja.

## 8. Cómo sabremos que quedó bien

1. Un reclutador entiende **en diez segundos** qué hace Luis y de qué nivel es.
2. Llega a las demos y **usa al menos una** sin que nadie se lo explique.
3. El sitio se ve igual de sólido en un teléfono que en un monitor.
4. Nadie se pregunta por qué no hay capturas reales: ya está contestado.
5. No parece una plantilla ni un sitio hecho con inteligencia artificial.
   Debe sentirse escrito y armado por una persona.

## 9. Tono del texto

Formal pero humano. Que no dé flojera leerlo. Menos jerga técnica, más
consecuencia concreta. Frases cortas. Nada de rayas largas.

Comparación:

- Así no: "Implementación de mecanismos de autenticación y autorización basada
  en roles mediante Spring Security, garantizando la integridad de la
  información."
- Así sí: "La seguridad vive en el servidor. Ocultar un botón no es seguridad."
