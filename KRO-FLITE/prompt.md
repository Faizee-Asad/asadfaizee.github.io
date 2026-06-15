Create a complete, self-contained HTML page for a fictional premium sandal brand called "KRO·FLITE", model "SS-26". The page must use scrollytelling to deconstruct the sandal layer by layer, with a dark, studio-lighting aesthetic, gold accents, and a strong typographic hierarchy. Everything (HTML, CSS, JS) must be in one file. No external dependencies except for placeholder images.

**Design Tokens (CSS variables):**
- Backgrounds: very dark charcoal (#0b0b0c, #131316, #1c1c20)
- Text: off-white (#f5f4ef), muted grey (#d8d6cf, #8a8880)
- Accent: warm gold (#d8c79b, #b09a6a)
- Lines: subtle white transparency (rgba(255,255,255,0.08))
- Fonts: Serif for headings ("Times New Roman", "Cormorant Garamond", Georgia), sans-serif for body, monospace for specs/labels.

**Page Structure:**
1. **Fixed navigation** with blur backdrop, brand logo "KRO·FLITE", links to sections, and a "Pre-order" CTA button. On scroll it gets a solid background.
2. **Hero section**:
   - Left: badge "SS-26 · Spring Drop · Limited 2,000 pairs", massive headline "Built layer by *layer*", intro paragraph, two buttons (Pre-order and "See the build"), and three stats (Modular parts, Weight, Recyclable).
   - Right: a rounded product visual container with a floating image (apply a gentle floating animation), a price tag overlay, and a color chip label "Espresso · 01".
   - Background: dark gradient with subtle radial glows.
3. **Features section**:
   - Headline "A sandal that *thinks* in four parts." with explanatory text.
   - A 3-column grid of feature cards (becomes 1 column on mobile). Each card has a small icon (inline SVGs), a monospace label like "01 · Cage", an italic serif title, and a short description. Cards lift on hover with a gold border and gradient background.
   - Features: Cage, Footbed, Outsole, Bungee, Stack (replaceable), Verified (field-tested).
4. **Scrolly Construction (the core interactive section)**:
   - Headline "Disassemble it with your *scroll wheel*."
   - A tall scroll container (height: 1200vh). Inside, a sticky canvas element that covers the viewport.
   - The canvas plays a frame-by-frame animation of 300 images stored in a folder `frames/`, named `frame_0001.jpg` to `frame_0300.jpg`. The images show the sandal being taken apart layer by layer.
   - On scroll, compute page progress, map it to frame index (animation plays between 10% and 90% of the scrollable height). Draw the current frame on the canvas, fitting it to cover the viewport (object-fit: cover logic).
   - **Loading**: Show a full-screen loader with a spinning ring, label "Loading SS-26", and a live frame counter "X / 300". Preload all 300 frames asynchronously with a concurrency limit of 16. Only hide the loader when *both* all frames are loaded and the window `load` event has fired.
   - **Overlay narrative steps**: As the user scrolls through the animation, show four text panels that fade in/out at specific progress thresholds:
     - Step 0 (0–18%): left side, "Step 01 · Overview", "The complete sandal.", description.
     - Step 1 (18–50%): right side, "Step 02 · Lift", "The cage separates.", description.
     - Step 2 (50–78%): left side, "Step 03 · Footbed", "The cork-blend mid-layer.", description.
     - Step 3 (78–100%): right side, "Step 04 · Outsole", "And finally, the grip.", description.
     Panels use an `.is-hidden` class to fade out. Manage display:none after transition.
5. **Gallery section**: "Stills from the build." – a grid of tiles using the same frame images (use a few key frames: 1, 150, 30, 60, 300). Each tile has a caption with timestamp. Tiles have different column spans on desktop, stack on mobile. Images scale slightly on hover.
6. **Specifications section**: Split layout. Left: headline, description, two buttons. Right: an image (frame 240) inside a visual container with a grid overlay, followed by a spec table. Each row: label (monospace), value (serif), unit (monospace, right-aligned). Responsive: rows collapse columns.
7. **Colorways section**: "Four shades. One stance." Left: description and a dynamic metadata card that updates when a swatch is clicked. Right: 4 color swatches (Espresso, Rust, Moss, Slate) – each is a gradient background representing the material. Clicking a swatch makes it active (gold border) and updates the card text (color name, descriptive sentence). Use `data-color` attributes.
8. **Testimonials section**: "Tested by 38 feet across 4,200 miles." Rating 4.8 with stars. Three quote cards with blockquote, avatar initials, name, role, and miles tested.
9. **Call-to-action / Pricing**: Left: pre-order details, guarantee list with checkmarks. Right: a price card showing $148 USD, note about spare parts, size selector buttons (US 6-13, one active by default), and "Add to bag" and "Save" buttons.
10. **Footer**: Multi-column layout with brand tagline, newsletter input, and link lists for Product, Company, Support. Bottom bar with copyright.

**JavaScript Interactions (included):**
- Nav scroll class toggle.
- Reveal on scroll: elements with class `.reveal` animate in (fade + translateY) using IntersectionObserver.
- Swatch click: remove `.active` from all, add to clicked, update the color meta card.
- Size buttons: toggle active class on click.
- Hero visual: subtle 3D parallax tilt on mouse move (perspective, rotateX/Y), reset on mouse leave.
- Scrolly engine as described: canvas resizing, frame drawing, overlay step management.
- All scroll listeners use passive: true.

**Responsive behavior**: Use CSS Grid and media queries. At max-width 900px: hero stacks vertically, features grid single column, gallery tiles full-width, specs stacks, colors stacks, testimonial grid single column, CTA stacks, footer two columns then one at 600px. Navigation menu items hide and a "Menu" button appears (no functionality needed).

**Important notes:**
- The folder `frames/` contains 300 images that must be preloaded. Use an array of Image objects, promise-based loading with a pool, and update the loader counter.
- The canvas must scale with the viewport while maintaining the 16:9 aspect ratio of the frames (1280x720). Use `devicePixelRatio` capping at 2 for performance.
- Ensure all CSS is in a `<style>` tag, all JS in a `<script>` tag at the end. No external fonts except system fallbacks.
- No actual product images; use paths like `frames/frame_0001.jpg` as placeholders. The page should still work (showing missing image fallback) but the logic must be correct.
- The overlay panels must not interfere with pointer events except on the panels themselves (use `pointer-events: none` on container, `auto` on children).

Output the full HTML file.