# Frontend – Pet Your Pet (React + Vite)

The UI was refined to look cleaner and more modern without changing any functionality.

Highlights:

- New typography (Inter) and a soft background gradient for better readability
- Sticky, translucent navbar with subtle shadow
- Consistent page container (`.app-shell`) providing max-width and spacing
- Polished cards, buttons, and progress bar
- Lightweight animations with reduced-motion support

## Customize the theme

Edit `src/index.css` design tokens at the top to tweak colors and sizing:

```css
:root {
  --bg: #f8fafc;
  --bg-soft: #eef2ff;
  --fg: #0f172a;
  --muted: #475569;
  --primary: #0ea5e9;
  --primary-600: #0284c7;
  --accent: #22c55e;
  --danger: #ef4444;
  --card: #ffffff;
}
```

The main content area is wrapped by `.app-shell` in `src/App.jsx` to apply consistent spacing and layout.

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview the production build
- `npm run lint` – run ESLint

Note: There is an existing ESLint warning in `src/context/AuthContext.jsx` related to Fast Refresh. It does not impact functionality and is outside the scope of the visual updates.
