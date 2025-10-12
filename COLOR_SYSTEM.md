# 🎨 Simple Ink Studios - Color System Reference

## Single Source of Truth: `@theme` Block in globals.css

All colors are now defined in ONE place and automatically work with light/dark mode.

---

## 📍 Where to Change Colors

**File:** `app/globals.css`

### Light Mode Colors (lines 12-58)
```css
@theme {
  --color-darkcyan: #042634;
  --color-purple: #2a0434;
  --color-neon-purple: #f600f7;
  --color-background: #ffffff;
  --color-foreground: #171717;
  // ... etc
}
```

### Dark Mode Colors (lines 61-93)
```css
[data-theme="dark"] {
  --color-background: #0a0a0a;
  --color-foreground: #ffffff;
  --color-primary: #f600f7;
  // ... etc
}
```

---

## 🎯 How to Use Colors

### In Tailwind Classes (Recommended)
```tsx
<div className="bg-primary text-primary-foreground">
<div className="bg-card border-border text-card-foreground">
<p className="text-muted-foreground">
```

### In Custom CSS Classes
```css
.my-custom-class {
  background: var(--color-primary);
  color: var(--color-text);
}
```

### In Inline Styles (Use Sparingly)
```tsx
<div style={{ color: 'var(--color-neon-purple)' }}>
```

---

## 📋 Available Color Variables

### Brand Colors (Consistent across themes)
- `--color-darkcyan` → `#042634`
- `--color-purple` → `#2a0434`
- `--color-neon-purple` → `#f600f7`

### Theme-Aware Colors (Change with light/dark mode)

#### Base Colors
- `--color-background` (page background)
- `--color-foreground` (main text color)
- `--color-surface` (card/surface backgrounds)
- `--color-surface-2` (secondary surface)

#### Text Colors
- `--color-text` (body text)
- `--color-text-muted` (muted/secondary text)
- `--color-text-inverse` (opposite of current theme)

#### Shadcn/UI Component Tokens
- `--color-primary` / `--color-primary-foreground`
- `--color-secondary` / `--color-secondary-foreground`
- `--color-destructive` / `--color-destructive-foreground`
- `--color-muted` / `--color-muted-foreground`
- `--color-accent` / `--color-accent-foreground`
- `--color-card` / `--color-card-foreground`
- `--color-popover` / `--color-popover-foreground`
- `--color-border`
- `--color-input`
- `--color-ring`

#### Accent Colors
- `--color-accent-primary` (darkcyan in light, neon-purple in dark)
- `--color-accent-secondary` (purple in light, neon-purple in dark)
- `--color-accent-hover` (hover state color)

---

## 🔄 Theme Mapping

### Light Mode
| Variable | Value | Usage |
|----------|-------|-------|
| `--color-primary` | `#042634` (darkcyan) | Primary buttons, links |
| `--color-background` | `#ffffff` | Page background |
| `--color-foreground` | `#171717` | Main text |
| `--color-card` | `#ffffff` | Card backgrounds |

### Dark Mode
| Variable | Value | Usage |
|----------|-------|-------|
| `--color-primary` | `#f600f7` (neon-purple) | Primary buttons, links |
| `--color-background` | `#0a0a0a` | Page background |
| `--color-foreground` | `#ffffff` | Main text |
| `--color-card` | `#1a1a1a` | Card backgrounds |

---

## ✅ Benefits of This System

1. **Change Once, Update Everywhere**
   - Modify a color in `@theme` block
   - All Tailwind classes AND custom CSS update automatically

2. **Theme-Aware by Default**
   - Light/dark mode works automatically
   - No need to manually define dark: variants

3. **Type-Safe**
   - Tailwind config maps to these variables
   - VSCode autocomplete works

4. **Maintainable**
   - Single source of truth
   - Clear naming conventions
   - Well-documented

---

## 🚫 Important Rules

1. **NEVER define colors outside the `@theme` block**
   - Exception: Theme overrides in `[data-theme="dark"]`

2. **ALWAYS use `--color-` prefix for variables**
   - Correct: `var(--color-primary)`
   - Wrong: `var(--primary)`

3. **Prefer Tailwind classes over inline styles**
   - Good: `className="bg-primary"`
   - Okay: `style={{ background: 'var(--color-primary)' }}`

4. **Don't hardcode colors**
   - Bad: `className="bg-[#042634]"`
   - Good: `className="bg-primary"`

---

## 🛠️ Adding a New Color

1. Add to `@theme` block in `globals.css`:
   ```css
   @theme {
     --color-my-new-color: #123456;
   }
   ```

2. Add dark mode override if different:
   ```css
   [data-theme="dark"] {
     --color-my-new-color: #654321;
   }
   ```

3. (Optional) Add to Tailwind config for class usage:
   ```ts
   // tailwind.config.ts
   colors: {
     "my-new-color": "var(--color-my-new-color)",
   }
   ```

4. Use it:
   ```tsx
   <div className="bg-my-new-color">
   // or
   <div style={{ color: 'var(--color-my-new-color)' }}>
   ```

---

## 📚 Related Files

- **Color Definitions:** `app/globals.css` (lines 11-94)
- **Tailwind Mapping:** `tailwind.config.ts` (lines 21-64)
- **Theme Provider:** `app/layout.tsx`
- **Theme Toggle:** `components/ui/ThemeToggle.tsx`

---

**Last Updated:** 2025-10-09
