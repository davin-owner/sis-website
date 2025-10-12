# UI Components Cheat Sheet
Complete reference for all Simple Ink Studios UI components

---

## 1. Button Component

**Location**: `components/ui/Button.tsx`

### Variants
- `default` - Primary blue button
- `destructive` - Red danger button
- `outline` - Border with transparent background
- `secondary` - Gray secondary button
- `ghost` - No background, hover effect only
- `link` - Text link style

### Sizes
- `default` - Standard size (h-9)
- `sm` - Small (h-8)
- `lg` - Large (h-10)
- `icon` - Square icon button (h-9 w-9)

### Usage Examples

```tsx
import { Button } from "@/components/ui/Button";

// Basic button
<Button>Click me</Button>

// Different variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Settings</Button>
<Button variant="link">Learn more</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><TrashIcon /></Button>

// With onClick
<Button onClick={() => console.log("clicked")}>
  Submit
</Button>

// Disabled
<Button disabled>Loading...</Button>

// asChild - use with Next.js Link
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

---

## 2. Card Component

**Location**: `components/ui/Card.tsx`

### Parts
- `Card` - Container
- `CardHeader` - Top section with padding
- `CardTitle` - Bold title text
- `CardDescription` - Muted subtitle text
- `CardContent` - Main content area
- `CardFooter` - Bottom section (flex layout)

### Usage Examples

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/Card";

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Minimal card
<Card>
  <CardContent className="p-6">
    <p>Simple content</p>
  </CardContent>
</Card>

// Card with custom styling
<Card className="hover:shadow-lg transition-shadow">
  <CardContent>
    <p>Hoverable card</p>
  </CardContent>
</Card>
```

---

## 3. Input Component

**Location**: `components/ui/Input.tsx`

### Usage Examples

```tsx
import { Input } from "@/components/ui/Input";

// Basic input
<Input type="text" placeholder="Enter your name" />

// Email input
<Input type="email" placeholder="email@example.com" />

// Password input
<Input type="password" placeholder="••••••••" />

// Disabled input
<Input disabled placeholder="Disabled" />

// With controlled state
const [value, setValue] = useState("");
<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// With label (use Label component)
<div className="space-y-2">
  <Label htmlFor="username">Username</Label>
  <Input id="username" type="text" />
</div>

// File input
<Input type="file" />
```

---

## 4. Label Component

**Location**: `components/ui/Label.tsx`

### Usage Examples

```tsx
import { Label } from "@/components/ui/Label";

// Basic label
<Label htmlFor="email">Email Address</Label>

// With input
<div className="space-y-2">
  <Label htmlFor="password">Password</Label>
  <Input id="password" type="password" />
</div>

// With checkbox
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

---

## 5. Checkbox Component

**Location**: `components/ui/Checkbox.tsx`

### Usage Examples

```tsx
import { Checkbox } from "@/components/ui/Checkbox";

// Basic checkbox
<Checkbox />

// With label
<div className="flex items-center space-x-2">
  <Checkbox id="remember" />
  <Label htmlFor="remember">Remember me</Label>
</div>

// Controlled checkbox
const [checked, setChecked] = useState(false);
<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
/>

// Disabled checkbox
<Checkbox disabled />

// With form (controlled)
<div className="space-y-2">
  <div className="flex items-center space-x-2">
    <Checkbox
      id="marketing"
      checked={formData.marketing}
      onCheckedChange={(checked) =>
        setFormData({...formData, marketing: checked})
      }
    />
    <Label htmlFor="marketing">Send me marketing emails</Label>
  </div>
</div>
```

---

## 6. Badge Component

**Location**: `components/ui/Badge.tsx`

### Variants
- `default` - Primary badge (blue)
- `secondary` - Gray badge
- `destructive` - Red badge
- `outline` - Border only

### Usage Examples

```tsx
import { Badge } from "@/components/ui/Badge";

// Basic badge
<Badge>New</Badge>

// Different variants
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Coming Soon</Badge>

// In a list
<div className="flex gap-2">
  <Badge>React</Badge>
  <Badge>TypeScript</Badge>
  <Badge>Tailwind</Badge>
</div>

// With custom styling
<Badge className="text-xs">Small badge</Badge>
```

---

## 7. DropdownMenu Component

**Location**: `components/ui/DropdownMenu.tsx`

### Parts
- `DropdownMenu` - Root container (manages state)
- `DropdownMenuTrigger` - Button that opens the menu
- `DropdownMenuContent` - The popup menu panel
- `DropdownMenuItem` - Clickable menu item
- `DropdownMenuCheckboxItem` - Checkbox menu item
- `DropdownMenuRadioGroup` + `DropdownMenuRadioItem` - Radio group
- `DropdownMenuLabel` - Section label
- `DropdownMenuSeparator` - Visual divider
- `DropdownMenuShortcut` - Keyboard shortcut hint
- `DropdownMenuSub` + `DropdownMenuSubTrigger` + `DropdownMenuSubContent` - Nested submenu

### Usage Examples

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/DropdownMenu";

// Basic dropdown
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// With labels and sections
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// With checkbox items (controlled)
const [showStatus, setShowStatus] = useState(true);
const [showActivity, setShowActivity] = useState(false);

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>View Settings</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Display</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuCheckboxItem
      checked={showStatus}
      onCheckedChange={setShowStatus}
    >
      Show Status Bar
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem
      checked={showActivity}
      onCheckedChange={setShowActivity}
    >
      Show Activity Bar
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>

// With radio group (single selection)
const [size, setSize] = useState("medium");

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Size: {size}</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Text Size</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuRadioGroup value={size} onValueChange={setSize}>
      <DropdownMenuRadioItem value="small">Small</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="large">Large</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>

// With submenu
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>File</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>New File</DropdownMenuItem>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>New From Template</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>React Component</DropdownMenuItem>
        <DropdownMenuItem>Vue Component</DropdownMenuItem>
        <DropdownMenuItem>TypeScript File</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Open...</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// With keyboard shortcuts
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Edit</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>
      Undo
      <DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Redo
      <DropdownMenuShortcut>⌘⇧Z</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Cut
      <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Copy
      <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// With onClick actions
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => console.log("Edit clicked")}>
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => console.log("Duplicate clicked")}>
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      onClick={() => console.log("Delete clicked")}
      className="text-red-600"
    >
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 8. ThemeToggle Component

**Location**: `components/ui/ThemeToggle.tsx`

### Usage Examples

```tsx
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Basic usage (self-contained, no props needed)
<ThemeToggle />

// In a navbar
<nav className="flex items-center justify-between p-4">
  <div>Logo</div>
  <ThemeToggle />
</nav>

// Note: This component uses next-themes under the hood
// Make sure you have ThemeProvider in your app layout:
// <ThemeProvider attribute="class" defaultTheme="system">
//   {children}
// </ThemeProvider>
```

---

## Common Patterns

### Form with Multiple Components

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, remember });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={setRemember}
            />
            <Label htmlFor="remember">Remember me</Label>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>
          Sign In
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### User Menu Dropdown

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          John Doe
          <Badge className="ml-2">Pro</Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Quick Reference Table

| Component | Type | Main Use | Client/Server |
|-----------|------|----------|---------------|
| Button | Action | Clickable actions, links | Client |
| Card | Container | Content grouping | Server |
| Input | Form | Text input | Server |
| Label | Form | Input labels | Client |
| Checkbox | Form | Boolean selection | Client |
| Badge | Display | Status indicators | Server |
| DropdownMenu | Navigation | Menus, options | Client |
| ThemeToggle | Feature | Dark/light mode | Client |

## Important Notes

1. **"use client" Directive**: Components marked as Client need the `"use client"` directive at the top of files that use them with state/effects
2. **asChild Prop**: Used with Radix UI components to merge props with child elements
3. **Tailwind Classes**: All components support `className` prop for custom styling
4. **TypeScript**: All components are fully typed with TypeScript
5. **Accessibility**: Built on Radix UI primitives for full keyboard and screen reader support