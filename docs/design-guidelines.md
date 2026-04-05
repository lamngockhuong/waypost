# Waypost - Design Guidelines

UI/UX and design system documentation for Waypost admin interface.

## Design System

### Brand Colors

**Violet Theme** (Primary Brand Color)

- Light mode primary: `#7c3aed` (Violet 600)
- Dark mode primary: `#a78bfa` (Violet 400)
- Primary hover: `#6d28d9` (light) / `#8b5cf6` (dark)

**Semantic Colors**

- Success: `#16a34a` (Green 600, light) / `#22c55e` (Green 500, dark)
- Destructive: `#dc2626` (Red 600, light) / `#ef4444` (Red 500, dark)
- Accent: `#ea580c` (Orange 600, light) / `#fb923c` (Orange 400, dark)

**Background & Surface**

Light mode:

- Background: `#faf8ff` (Violet 50)
- Surface: `#ffffff` (White)
- Surface hover: `#f5f3ff` (Violet 100)
- Muted: `#ede9fe` (Violet 200)
- Border: `#e5e2f0` (Violet 300)

Dark mode:

- Background: `#131125` (Violet 950)
- Surface: `#1c1930` (Violet 925)
- Surface hover: `#262340` (Violet 900)
- Muted: `#2a2745` (Violet 850)
- Border: `#3a3755` (Violet 800)

**Text & Typography**

Light mode:

- Foreground: `#1e1b3a` (Violet 950)
- Heading: `#1e1b3a`
- Label: `#4a4560` (Violet 700)
- Subtle: `#6b6580` (Violet 600)
- Muted: `#8b8598` (Violet 500)
- Placeholder: `#a8a3b8` (Violet 400)

Dark mode:

- Foreground: `#e8e5f5` (Violet 100)
- Heading: `#f5f3ff` (Violet 50)
- Label: `#c8c3d8` (Violet 200)
- Subtle: `#a8a3b8` (Violet 300)
- Muted: `#8b8598` (Violet 400)
- Placeholder: `#6b6580` (Violet 500)

### Typography

**Font Stack**

- Sans: "Fira Sans", system-ui, sans-serif
- Monospace: "Fira Code", monospace

**Font Weights**

- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

**Scale** (Tailwind-based)

- Text XS: 12px / 16px
- Text SM: 14px / 20px
- Text base: 16px / 24px
- Text LG: 18px / 28px
- Text XL: 20px / 28px
- Text 2XL: 24px / 32px

**Headings**

- H1: 32px / bold / -0.03em letter-spacing
- H2: 24px / bold / -0.02em letter-spacing
- H3: 20px / semibold / -0.01em letter-spacing
- H4: 18px / semibold
- H5: 16px / semibold

### Spacing

Tailwind's default 4px base unit:

- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- 2xl: 32px
- 3xl: 48px
- 4xl: 64px

### Border Radius

- sm: 6px
- md: 8px
- lg: 12px
- xl: 16px
- 2xl: 20px
- full: 9999px

### Shadows

Used sparingly for elevation:

- sm: 0 1px 2px 0 rgba(0,0,0,0.05)
- md: 0 4px 6px -1px rgba(0,0,0,0.1)
- lg: 0 10px 15px -3px rgba(0,0,0,0.1)

### Animations

Defined in `src/admin/styles/globals.css`:

- `slideInRight`: 250ms ease-out
- `slideInUp`: 200ms ease-out
- `fadeIn`: 150ms ease-out

## Component Patterns

### Buttons

**Primary Button**

- Background: Primary color
- Text: White (light), Dark text (dark mode for contrast)
- Hover: Primary hover color
- Padding: 12px 28px (md)
- Border radius: 12px
- Font weight: 600

```tsx
<button className="px-7 py-3 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold transition">
  Action
</button>
```

**Secondary Button**

- Background: Surface / transparent
- Border: 1.5px primary border
- Text: Foreground
- Hover: Surface hover + primary border
- Padding: 12px 28px (md)

```tsx
<button className="px-7 py-3 rounded-lg border-[1.5px] border-primary text-foreground hover:bg-surface-hover transition">
  Action
</button>
```

### Cards

- Background: Surface
- Border: 1px border color
- Border radius: 16px
- Padding: 24px
- Hover: Translate Y-3px, subtle shadow

```tsx
<div className="bg-surface border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-[3px] transition">
  Content
</div>
```

### Input Fields

- Background: Surface
- Border: 1px border color
- Border radius: 8px
- Padding: 12px 16px
- Focus: Primary border, outline none
- Placeholder: Muted text

```tsx
<input
  className="w-full px-4 py-3 rounded-lg bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
  placeholder="Placeholder text"
/>
```

### Modals/Dialogs

- Background: Surface
- Border radius: 16px
- Padding: 24px
- Overlay: Dark backdrop (opacity 50%)
- Z-index: 40+

### Sidebar

- Width: 240px (lg screens)
- Background: Surface
- Border right: 1px border color
- Fixed position on desktop
- Collapsible on mobile

### Responsive Behavior

**Mobile-first breakpoints** (Tailwind defaults):

- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

Sidebar hidden on mobile, toggled via hamburger menu. Mobile nav uses full screen.

## Dark Mode

Dark mode activates automatically via `prefers-color-scheme: dark` media query.

**Implementation:**

- CSS custom properties switch in `@media (prefers-color-scheme: dark)`
- No JS required for automatic switching
- Manual toggle possible via adding `dark` class to `<html>`

**Testing dark mode:**

- Browser dev tools > Rendering > Emulate CSS media feature
- OS-level preference (macOS System Preferences > General > Appearance)

## Accessibility

### Keyboard Navigation

- Tab order follows visual flow
- Focus visible (outline or ring)
- Keyboard shortcuts for common actions (if applicable)

### Color Contrast

- Text on background: WCAG AA minimum (4.5:1)
- UI elements on background: WCAG A minimum (3:1)
- Violet theme verified for contrast in light/dark modes

### Semantic HTML

- Use `<button>` for buttons, not `<div>`
- Use `<input>` for form fields
- Use `<label>` for form labels
- Use `<table>` for tabular data
- Use `<nav>` for navigation
- Use `<main>`, `<header>`, `<footer>` for layout

### ARIA

- Add `aria-label` for icon-only buttons
- Add `aria-describedby` for form validation messages
- Use `role="button"` only on interactive divs (avoid when possible)
- Keep ARIA minimal, rely on semantic HTML first

### Focus Management

- Focus visible on all interactive elements
- Modal should trap focus (keep tab within modal)
- Return focus after modal closes

## Layout Patterns

### Two-Column Layout

Admin detail pages use:

- Left: Sidebar navigation / info panel
- Right: Main content area

Sidebar width: 240px on lg+, hidden on mobile with toggle.

### Dashboard Grid

KPI cards in responsive grid:

- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column

Gap: 16px

### Forms

- Single column on all screen sizes
- Input width: 100% within container
- Label above input
- Validation message below input
- Submit button: Full width on mobile, auto on desktop

### Tables

- Horizontal scroll on mobile
- Min-width on columns to prevent squishing
- Alternating row backgrounds (optional)
- Hover state on desktop only (no hover on touch)

## Icon System

**lucide-preact** icons used throughout:

- Size: 20px (md), 24px (lg)
- Color: Inherit from text color (foreground, subtle, etc.)
- Stroke width: 2

Common icons:

- Menu (hamburger)
- X (close)
- ChevronDown / ChevronUp (expand/collapse)
- Edit / Trash (actions)
- Plus (create)
- Link (external)
- AlertCircle / CheckCircle (status)

## Motion & Transitions

**Smooth transitions for:**

- Color changes: 150ms ease-out
- Scale/transform: 200ms ease-out
- Slide animations: 250ms ease-out

**Disabled animations:**

- Respect `prefers-reduced-motion: reduce`
- All animations set to 0.01ms in preferences

## Charts

**Chart.js** integration via Preact wrappers:

- Primary color: Violet
- Secondary colors: From semantic palette
- Fonts: Inherit from global font-family
- Responsive: Canvas resizes with container
- Tooltips: Styled with surface colors

## Landing Page

Separate marketing landing page:

- Static HTML generated in `src/admin/landing-html.ts`
- Violet theme with gradient accents
- Animated background grid + glow effect
- Responsive: 2-column grid on desktop, 1 column on mobile
- CTA buttons: Primary and secondary styles
- Links: To admin panel and GitHub

## Design Tokens (CSS Custom Properties)

All colors defined as custom properties in `src/admin/styles/globals.css`:

```css
--color-primary        /* Brand color */
--color-primary-hover  /* Hover state */
--color-accent         /* Secondary action */
--color-destructive    /* Delete, error */
--color-success        /* Confirmation */

--color-surface        /* Card background */
--color-surface-hover  /* Hover background */
--color-background     /* Page background */
--color-muted          /* Secondary background */
--color-border         /* Border color */

--color-foreground     /* Main text */
--color-heading        /* Heading text */
--color-label          /* Form labels */
--color-subtle         /* Secondary text */
--color-muted-fg       /* Muted text */
--color-placeholder    /* Placeholder text */

--font-sans            /* Body font */
--font-mono            /* Code font */

--animate-*            /* Animation definitions */
```

Use via:

```css
background: var(--color-surface);
color: var(--color-foreground);
font-family: var(--font-sans);
animation: var(--animate-fade-in);
```

## Brand Voice

**Admin UI copy:**

- Clear, action-oriented
- Avoid jargon (unless technical)
- Confirm destructive actions ("Are you sure?")
- Provide helpful error messages
- Use active voice

**Example:**

- ✓ "Add domain"
- ✗ "Domain addition interface"
- ✓ "Delete this rule permanently?"
- ✗ "Proceed with domain removal?"

## Future Considerations

- **Theming**: Design system supports swapping primary color
- **Localization**: No hard-coded text (i18n-ready structure)
- **High contrast mode**: Already supported via semantic color tokens
- **Font loading**: Google Fonts included, fallbacks in place
