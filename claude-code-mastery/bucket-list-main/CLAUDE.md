# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bucket List** is a personal goal-tracking web application — a vanilla JavaScript SPA with no build system or server dependencies. Users create and manage life goals with completion tracking, filtering, and persistent storage via browser LocalStorage.

**Language**: Korean (UI, comments, documentation)

## Architecture

### Three-Layer Structure

1. **Data Layer** (`js/storage.js`)
   - Pure data management module using object pattern
   - Handles all LocalStorage operations
   - Exports `BucketStorage` object with methods: `load()`, `save()`, `addItem()`, `updateItem()`, `deleteItem()`, `toggleComplete()`, `getStats()`, `getFilteredList()`
   - No UI dependencies — can be used standalone

2. **Application Layer** (`js/app.js`)
   - `BucketListApp` class manages all UI state and events
   - Calls `BucketStorage` methods, never manipulates localStorage directly
   - `render()` is the single re-render function — called after every state change
   - `cacheElements()` stores DOM references for performance
   - `createBucketItemHTML()` generates item markup with inline event handlers

3. **View Layer** (`index.html` + `css/styles.css`)
   - Semantic HTML structure with Tailwind CSS (CDN)
   - Custom CSS in `styles.css` for animations and overrides
   - No JavaScript in HTML (only inline event handler attributes)

### Key Patterns

- **State updates flow**: Event Handler → Storage Method → `render()` updates UI
- **HTML escaping**: Use `escapeHtml()` when inserting user content to prevent XSS
- **Inline event handlers**: Dynamically generated items use `onclick="app.methodName(...)"` pattern
- **Data structure**: Each bucket item has `id`, `title`, `completed`, `createdAt`, `completedAt`

## Running & Testing

**No build system or package.json** — this is a static site.

### View locally:
- **Browser**: Open `index.html` directly in a web browser
- **Python server** (recommended for testing): `python -m http.server 8000` then visit `http://localhost:8000`
- **VS Code**: Use "Live Server" extension, right-click `index.html` → "Open with Live Server"

**Test in browser dev tools**: 
- Open DevTools (F12)
- Console: `BucketStorage.load()` returns all items; `BucketStorage.getStats()` shows stats
- Clear data: `localStorage.removeItem('bucketList')`
- Application tab → LocalStorage shows persisted data

## Common Development Tasks

### Adding a new feature
1. If it needs data storage: add method to `BucketStorage` in `storage.js`
2. If it needs UI interaction: add event handler to `BucketListApp` class
3. Update `render()` or `createBucketItemHTML()` to display the feature
4. Test in browser: verify UI updates and data persists after refresh

### Modifying stored data structure
- Change the item object in `addItem()` (storage.js)
- Update `createBucketItemHTML()` (app.js) to display new fields
- Add migration logic if needed for existing stored data

### Styling
- Use existing Tailwind classes in HTML
- Add custom CSS to `css/styles.css` for effects not in Tailwind (animations, specific hover states)

### Responsive design
- Mobile: 320px+ (single column, touch-friendly buttons)
- Tablet: 768px+ (adjusted spacing)
- Desktop: 1024px+ (multi-column layouts)
- All breakpoints use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)

## Notes for Future Work

- **Planned features** (from README): categories/tags, image attachments, notes, goal dates, priority levels, data export/import, dark mode, drag-and-drop sorting
- **LocalStorage limitations**: ~5-10MB per domain; no sync across tabs/devices; cleared if user clears browser data
- **XSS protection**: Always use `escapeHtml()` before inserting user content; inline handlers use string concatenation carefully (currently escapes title in onclick attributes)
- **Accessibility**: Consider adding ARIA labels and keyboard navigation for future improvements
- **Testing approach**: Relies on manual browser testing; no automated test suite

## Tech Stack Summary

- HTML5, CSS3, Vanilla JavaScript (ES6+)
- Tailwind CSS (via CDN) + custom CSS
- Browser APIs: DOM API, LocalStorage API, Date API
- No external dependencies or build tools
