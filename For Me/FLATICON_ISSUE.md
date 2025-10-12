# Missing Flaticon Icons - Quick Fix

## Problem
Some icons don't exist with the names you're using in the `fi-ts-` (thin-straight) style.

## Icons Not Found:
- ❌ `fi-ts-envelope` → Use `fi-ts-envelopes` or `fi-ts-circle-envelope`
- ❌ `fi-ts-settings` → Use `fi-ts-gears` or `fi-ts-sliders-v`

## Fix These Files:

### 1. components/layout/navbar/Navbar.client.tsx (line 70)
```tsx
// BEFORE:
<i className="fi fi-ts-envelope" style={{ fontSize: "24px" }}></i>

// AFTER:
<i className="fi fi-ts-envelopes" style={{ fontSize: "24px" }}></i>
```

### 2. components/layout/navbar/NavbarWrapper.client.tsx (line 22)
```tsx
// BEFORE:
icon: <i className="fi fi-ts-envelope" style={{fontSize: '24px'}}></i>

// AFTER:
icon: <i className="fi fi-ts-envelopes" style={{fontSize: '24px'}}></i>
```

### 3. components/layout/navbar/NavbarWrapper.client.tsx (line 25)
```tsx
// BEFORE:
icon: <i className="fi fi-ts-settings" style={{fontSize: '24px'}}></i>

// AFTER:
icon: <i className="fi fi-ts-gears" style={{fontSize: '24px'}}></i>
```

### 4. components/contact/ContactModal.client.tsx (line 31)
```tsx
// BEFORE:
<i className="fi fi-ts-envelope text-6xl ..."></i>

// AFTER:
<i className="fi fi-ts-envelopes text-6xl ..."></i>
```

### 5. components/contact/ContactModal.client.tsx (line 54)
```tsx
// BEFORE:
<i className="fi fi-ts-paper-plane mr-2"></i>

// NOTE: Check if this icon exists (likely it does)
```

## How to Find Available Icons:

Search the CSS file:
```bash
grep "\.fi-ts-" node_modules/@flaticon/flaticon-uicons/css/all/all.css | grep -o "\.fi-ts-[a-z-]*" | sort -u
```

Or visit: https://www.flaticon.com/uicons
