# Simple Ink Studios - Styling Guide
## How to Style Components to Obey Theme Toggle

### 🎯 Core Principle
**All colors must use CSS variables defined in `globals.css`**

Never use hardcoded colors like:
- ❌ `text-white`, `text-black`, `bg-gray-900`
- ❌ `style={{ color: '#ffffff' }}`
- ❌ `className="bg-[#042634]"`

---

## ✅ The Right Way to Style

### 1. **Use Theme-Aware Tailwind Classes**

These classes automatically use CSS variables from `globals.css`:

```tsx
// ✅ GOOD - Uses CSS variables
<div className="bg-background text-foreground">
  <h1 className="text-foreground">Title</h1>
  <p className="text-muted-foreground">Subtitle</p>
</div>

// ❌ BAD - Hardcoded colors
<div className="bg-white text-black">
  <h1 className="text-gray-900">Title</h1>
  <p className="text-gray-600">Subtitle</p>
</div>
```

### 2. **Available Theme-Aware Classes**

#### Text Colors:
- `text-foreground` - Main text color
- `text-muted-foreground` - Subdued/secondary text
- `text-card-foreground` - Text on cards
- `text-primary` - Brand accent text
- `text-secondary-foreground` - Secondary surfaces text
- `text-destructive` - Error/delete actions

#### Background Colors:
- `bg-background` - Main page background
- `bg-card` - Card/surface backgrounds
- `bg-secondary` - Secondary surfaces
- `bg-primary` - Primary brand color
- `bg-destructive` - Error/danger backgrounds

#### Borders:
- `border-border` - Standard borders
- `border-input` - Input field borders

#### Other:
- `ring-ring` - Focus rings

### 3. **Using CSS Variables in Inline Styles**

When you MUST use inline styles (rare cases), use CSS variables:

```tsx
// ✅ GOOD - CSS variable in inline style
<div style={{ background: 'var(--background)' }}>

// ✅ GOOD - Also works for gradients
<div style={{
  background: `conic-gradient(var(--primary) 0 ${percent}%, var(--muted) ${percent}% 100%)`
}}>

// ❌ BAD - Hardcoded color
<div style={{ background: '#ffffff' }}>
```

### 4. **Button Styling**

Use the Button component with variants:

```tsx
import { Button } from "@/components/ui/Button";

// ✅ GOOD - Uses built-in variants
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Subtle Action</Button>

// ❌ BAD - Hardcoded colors override theme
<Button className="bg-white text-black">Click me</Button>
```

### 5. **Card/Surface Styling**

```tsx
// ✅ GOOD - Theme-aware card
<div className="bg-card text-card-foreground border border-border rounded-lg p-4">
  <h2 className="text-foreground">Card Title</h2>
  <p className="text-muted-foreground">Card description</p>
</div>

// ❌ BAD - Hardcoded colors
<div className="bg-white text-black border-gray-200">
```

---

## 🎨 Where Colors Are Defined

All theme colors live in **`app/globals.css`**:

```css
/* Light Mode */
:root,
[data-theme="light"] {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #042634;
  /* ... etc */
}

/* Dark Mode */
[data-theme="dark"] {
  --background: #0a0a0a;
  --foreground: #ffffff;
  --primary: #f600f7;
  /* ... etc */
}
```

**To change a color globally:**
1. Edit `globals.css`
2. Find the color variable (e.g., `--background`)
3. Change it in both light and dark mode sections
4. ALL components using that variable update automatically!

---

## 🚫 Common Mistakes to Avoid

### Mistake 1: Hardcoded Text Colors
```tsx
// ❌ BAD
<p className="text-gray-900">Text</p>

// ✅ GOOD
<p className="text-foreground">Text</p>
```

### Mistake 2: Hardcoded Background in Inline Styles
```tsx
// ❌ BAD
<div style={{ backgroundColor: '#ffffff' }}>

// ✅ GOOD
<div className="bg-background">
```

### Mistake 3: Hardcoded Colors in Button className
```tsx
// ❌ BAD
<Button className="bg-purple-600 text-white hover:bg-purple-700">

// ✅ GOOD
<Button variant="default">Click</Button>
```

### Mistake 4: Using dark: Classes
```tsx
// ❌ BAD (unnecessary with CSS variables)
<div className="bg-white dark:bg-gray-900">

// ✅ GOOD (automatically switches)
<div className="bg-background">
```

---

## 📋 Quick Reference Cheat Sheet

| Need | Use This Class | CSS Variable |
|------|---------------|--------------|
| Main text | `text-foreground` | `var(--foreground)` |
| Muted text | `text-muted-foreground` | `var(--muted-foreground)` |
| Page background | `bg-background` | `var(--background)` |
| Card background | `bg-card` | `var(--card)` |
| Card text | `text-card-foreground` | `var(--card-foreground)` |
| Borders | `border-border` | `var(--border)` |
| Input borders | `border-input` | `var(--input)` |
| Primary button | `bg-primary` | `var(--primary)` |
| Error text | `text-destructive` | `var(--destructive)` |

---

## 🔧 How the Theme System Works

1. **User clicks theme toggle** → `ThemeToggle.tsx`
2. **next-themes updates** → Changes `<html data-theme="dark">`
3. **CSS variables switch** → `[data-theme="dark"]` selector in `globals.css`
4. **Tailwind classes respond** → `bg-background` picks up new value
5. **Components re-render** → New colors applied automatically

---

## ✨ Pro Tips

1. **Single source of truth**: Change colors ONLY in `globals.css`
2. **Test both themes**: Always check light AND dark mode when styling
3. **Use Button variants**: Don't override with custom classes
4. **Prefer Tailwind classes**: Only use inline styles when absolutely necessary
5. **Check the console**: Look for theme switching logs to debug

---

## 🐛 Debugging Theme Issues

If colors aren't switching:

1. **Check for inline styles** - Search for `style={{` in your component
2. **Check for hardcoded Tailwind classes** - Look for `text-white`, `bg-black`, etc.
3. **Verify HTML attribute** - Console: `document.documentElement.getAttribute('data-theme')`
4. **Check CSS variable values** - Console: `getComputedStyle(document.documentElement).getPropertyValue('--background')`
5. **Hard refresh** - Cmd+Shift+R to clear cached CSS

---

## 📚 Files to Know

- **`app/globals.css`** - Where all color values are defined
- **`tailwind.config.ts`** - Maps CSS variables to Tailwind classes
- **`components/ui/Button.tsx`** - Reusable button with theme support
- **`components/ui/ThemeToggle.tsx`** - The theme switcher component
- **`app/layout.tsx`** - Wraps app with ThemeProvider

---

**Remember: If you need to override styles, do it with `className`, not inline styles, and use theme-aware classes!**
