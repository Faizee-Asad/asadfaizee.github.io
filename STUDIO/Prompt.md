Build a fully responsive, single‑page architectural studio website with the following specifications. Use HTML, Tailwind CSS, GSAP (with ScrollTrigger), and Lenis for smooth scrolling.

## Global Style
- Color palette: warm white (#FBF9F6), deep charcoal (#1C1C1C), muted gold (#C4A080), subtle gray (#8C8279), light border (#E8E3DC).
- Fonts: 'Playfair Display' for all headings, 'Inter' for body text.
- Subtle section dividers (50px wide, 2px tall, gold).
- Hover effects: underline sliding in from left on navigation links, lift and shadow on cards.
- Smooth scroll via Lenis (duration 1.2, easing exponential).

## Header (Glass Morphism)
- Fixed position, semi‑transparent background with backdrop blur (e.g., `backdrop-blur-xl`) that increases opacity on scroll.
- Logo "STUDIO." on the left, desktop nav links (About, Services, Work, Process, Contact) on the right with hover underline.
- A rounded "Inquire" button.
- Mobile: hamburger icon that transforms to X; full‑screen overlay with the same glass style, links stack vertically.

## Loading Screen
- Full‑screen overlay with warm brown background (#3E3026) that appears immediately on page load.
- Displays "STUDIO." in gold‑toned serif text, a progress bar (180px wide, gold fill), and percentage text.
- Preloads exactly 300 hero frame images. Progress updates as each image loads.
- Once all images are loaded, the loading screen fades out and the site becomes interactive.

## Hero Section
- Full viewport height (100vh/100svh).
- Contains a `<canvas>` that fills the entire background, set to `object-fit: cover`.
- The canvas plays a sequence of 300 JPEG frames (named `ezgif-frame-001.jpg` to `ezgif-frame-300.jpg` inside an `ar/` folder).
- Frame progression is scrubbed by scroll (via GSAP ScrollTrigger) while the section is pinned. The animation length is set to 350% of the viewport.
- A dark gradient overlay (transparent at top, semi‑black at bottom) ensures text readability.
- Hero text sits in the bottom‑left corner: small uppercase label, large "Precision in Design." heading, and a short description. Text is white with gold accent on the dot.

## About Section
- Two‑column layout: left large serif heading, right paragraphs about the studio.
- Stats row: 150+ projects, 16 years, 28 awards — large numbers with small labels.
- Stats animate in (fade up) on scroll.

## Services Section
- White background, 6 cards in a responsive grid (2 cols mobile/tablet, 3 cols desktop).
- Each card has a small circular icon that turns dark on hover, a bold serif title, and a light description.
- Cards fade‑up stagger on scroll.

## Projects (Horizontal Scroll)
- Section title "Selected Projects" with a hint "Scroll horizontally →".
- A horizontally scrollable row of project cards, pinned with ScrollTrigger.
- The row is inside an overflow‑hidden container; the scroll distance equals the excess width of the cards multiplied by 0.45 to create a fast, responsive scroll.
- Each card (width ~75vw on mobile, max 440px on desktop) contains a project image (from the provided URLs), a gold category label, project name, and location.
- Cards have hover lift and image scale (1.06) transitions.

## Process Section
- Dark background (#1C1C1C), 4 cards in a row.
- Each card has a large gold number (01–04), a title, and a description in lighter text.
- On hover: a top gold border slides in, the card lifts, and the number color intensifies.
- Cards stagger in from below on scroll.

## Testimonials (Marquee)
- A continuous horizontal marquee (CSS animation) of testimonial cards.
- The track contains two identical sets of cards to loop seamlessly; animation pauses on hover.
- Each card: italic quote, client initials in a circle, name, and role.
- Cards are white with a subtle border and shadow.

## Call to Action
- Light beige background, centered large serif heading "Let’s build something beautiful.", a short paragraph, and a dark rounded button "Start a Conversation".

## Footer
- Dark background, three columns: Studio address/hours, Connect (email, phone, social icons), Newsletter signup (email input + Join button).
- Bottom bar with copyright and two small links.

## Technical Implementation
- Tailwind CSS via CDN for utility classes.
- Lenis for smooth scrolling, synced with GSAP ticker.
- GSAP ScrollTrigger for: hero frame scrub + pin, horizontal scroll pin, process cards stagger, stats reveal, service cards reveal.
- Canvas resizes on window resize; drawing scales for device pixel ratio (capped at 2).
- All external images are loaded via `loading="lazy"` where appropriate.
- The site is fully responsive, with appropriate padding and font sizes on mobile, tablet, and desktop.

Provide the entire code in a single, self‑contained HTML file.