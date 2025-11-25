---
description: Find and document all errors, issues, and code smells in the project for debugging practice
---

Search the entire codebase for common errors, issues, and code smells. Return a comprehensive list organized by category.

## Search for:

1. **TypeScript/Type Errors:**
   - Find `any` types
   - Find `@ts-ignore` or `@ts-expect-error` comments
   - Find missing type definitions
   - Find incorrect prop types

2. **React Issues:**
   - Missing keys in `.map()` operations
   - Unused imports
   - Missing dependencies in `useEffect`
   - Direct state mutations
   - Missing error boundaries

3. **Performance Issues:**
   - Missing `React.memo` on expensive components
   - Unnecessary re-renders
   - Large bundle imports (importing entire libraries)
   - Unoptimized images

4. **Security Issues:**
   - Exposed API keys or secrets
   - SQL injection vulnerabilities
   - XSS vulnerabilities
   - Missing input validation

5. **Code Quality:**
   - Console.log statements left in code
   - TODO/FIXME comments
   - Duplicate code
   - Dead code (unused functions/variables)
   - `==` instead of `===`

6. **Styling Issues:**
   - Hydration warnings
   - Inline styles that should be CSS
   - Missing responsive design
   - Hardcoded colors instead of CSS variables

7. **Database/API Issues:**
   - Missing error handling in API calls
   - Unhandled promise rejections
   - Missing loading states
   - Race conditions

8. **Accessibility Issues:**
   - Missing alt text on images
   - Missing ARIA labels
   - Poor keyboard navigation
   - Missing focus states

## Output Format:

For each error found, provide:
```
### [Category] - [Severity: High/Medium/Low]
**File:** `path/to/file.tsx:line_number`
**Issue:** Brief description
**Why it matters:** Explanation
**How to fix:** Step-by-step guidance (don't fix it, just guide)
---
```

## Important:
- DO NOT fix any issues - only document them
- Provide line numbers for easy navigation
- Prioritize by severity (High > Medium > Low)
- Group by category for easy scanning
- Give learning-focused explanations

Start the search now across the entire codebase.