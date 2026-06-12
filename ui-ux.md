# UI/UX & Design System Guidelines

## 1. Aesthetic Identity: "Dark Enterprise Glassmorphism"
The app must seamlessly mirror the WebGL landing page: highly professional, clean, dark-themed, and data-forward.
* **Background:** Deep space dark (`bg-[#030305]`) for the main application background.
* **Cards/Containers:** Dark glassmorphism (`bg-[rgba(12,12,18,0.85)]` or `bg-white/5`), subtle white borders (`border-white/10`), and deep shadows with `backdrop-blur-xl`.
* **Border Radius:** Moderate rounding (`rounded-xl` or `rounded-2xl`).
* **Hover States:** Inputs and interactive elements should glow on focus/hover (e.g., `focus-visible:ring-[#00F0FF]`, `hover:border-[#00F0FF]/50`).

## 2. Typography
* **Font Family:** `Space Grotesk` (via Tailwind `font-space`) for headers, `Outfit` or `Inter` (via Tailwind `font-sans`) for body.
* **Headers:** Crisp white (`text-[#fafafa]`), tracking tight.
* **Body:** Highly readable muted gray (`text-zinc-400` or `#A1A1AA`).
* **Micro-copy (Timestamps, labels):** Smaller, highly muted (`text-zinc-500`).

## 3. Dashboard Chart Specifications (Apache ECharts)
* **Color Palette:** Use glowing, data-viz friendly accents. Primary: Cyan (`#00F0FF`). Secondary: Emerald (`#10B981`). Accents for alerts: Neon Red/Magenta.
* **Interactivity:** All charts must have tooltips enabled on hover, styled with dark glassmorphism.
* **Grid:** Hide thick grid lines; use very faint, dashed horizontal lines (`rgba(255,255,255,0.05)`) for Y-axes.
* **Text Elements:** Chart legends and axis labels must be `text-zinc-400` (`#A1A1AA`).

## 4. Conversational UI
* **Containers:** Chat window must sit inside a dark glass card with `border-white/10`.
* **User Messages:** Stylized with Cyan accents (`bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30`). Right-aligned.
* **AI Messages:** Left-aligned, subtle dark glass bubble (`bg-white/5 text-zinc-300`).
* **Inputs:** Match the landing page's `portal-input`: `bg-black/40 border-white/10 text-white focus-visible:ring-[#00F0FF]`.
* **Render Markdown:** Cleanly using `react-markdown` with specific dark-mode Tailwind styling for tables (bordered, striped rows) and code blocks.

## 5. Responsiveness
* Mobile-first design principles. Dashboards must stack vertically on screens smaller than `md`.