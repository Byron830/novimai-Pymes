# Novimai — Landing Page

Landing page estática para **Novimai**, agencia de IA para PYMEs.

---

## Estructura de archivos

```
novimai-landing/
├── index.html              — Página principal
├── css/
│   ├── main.css            — Variables, reset, tipografía
│   ├── components.css      — Todos los componentes (navbar, cards, form, footer)
│   └── animations.css      — Scroll reveal, keyframes, hovers
├── js/
│   ├── main.js             — Navbar sticky, mobile menu, scroll suave
│   ├── animations.js       — IntersectionObserver para animaciones
│   └── form.js             — Envío del formulario a Formspree
└── assets/                 — Logo y recursos gráficos
```

---

## Configuración pendiente (antes de publicar)

### 1. Configurar el formulario de contacto

1. Ve a [formspree.io](https://formspree.io) y crea una cuenta gratuita
2. Crea un nuevo formulario con tu email (`hola@novimai.es` o el que uses)
3. Copia el endpoint que te dan (ej: `https://formspree.io/f/xpznkqvr`)
4. Abre `js/form.js` y reemplaza esta línea:
   ```js
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REEMPLAZA_CON_TU_ID';
   ```
   por tu endpoint real.

> El plan gratuito de Formspree permite 50 envíos al mes. Suficiente para empezar.

### 2. Añadir tu logo

1. Coloca tu archivo de logo en la carpeta `assets/` (PNG o SVG recomendado)
2. En `index.html`, busca los dos bloques de logo (navbar y footer) que dicen:
   ```html
   <span class="logo-novi">Novi</span><span class="logo-mai">mai</span>
   ```
3. Reemplázalos por:
   ```html
   <img src="assets/tu-logo.png" alt="Novimai" height="36" />
   ```

### 3. Actualizar el email de contacto

Busca en `index.html` todas las apariciones de `hola@novimai.es` y sustitúyelas por tu email real.

---

## Publicar en Netlify (gratis, 5 minutos)

### Opción A — Arrastrar carpeta (la más fácil)

1. Ve a [netlify.com](https://netlify.com) y crea cuenta gratuita
2. En el Dashboard, busca el área "**Drag & drop your site folder here**"
3. Arrastra toda la carpeta `novimai-landing` ahí
4. ¡Listo! En segundos tendrás una URL tipo `https://random-name.netlify.app`

### Opción B — Conectar con GitHub

1. Sube la carpeta a un repositorio GitHub
2. En Netlify: "Add new site" → "Import from Git"
3. Selecciona el repositorio → Deploy automático

### Cambiar la URL por defecto

Una vez publicado, en Netlify puedes ir a:
`Site settings → Domain management → Custom domains`
y cambiar la URL a algo como `novimai.netlify.app` (gratis).

Para usar un dominio propio (`novimai.es`), compra el dominio (~10€/año) y apunta los DNS a Netlify.

---

## Previsualizar en local

Simplemente abre `index.html` en tu navegador — no necesitas servidor.

> Nota: el formulario en local mostrará un mensaje de éxito simulado hasta que configures el endpoint de Formspree.

---

## Personalización rápida

### Cambiar colores
Abre `css/main.css` y modifica las variables en `:root`:
- `--cyan` → color primario (tecnología/confianza)
- `--amber` → color de acción (CTAs)

### Cambiar fuente
En `index.html`, modifica el `<link>` de Google Fonts y en `css/main.css` la variable `--font`.

### Añadir/quitar secciones
Cada sección en `index.html` está claramente comentada con `<!-- NOMBRE DE SECCIÓN -->`.
