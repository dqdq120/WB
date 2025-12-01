# Web Builder - Complete Feature Documentation

## Overview
This web builder is a visual drag-and-drop interface for creating and styling HTML elements. It features a comprehensive panel system with element management, property editing, and attribute configuration.

## Architecture

### Core Classes

#### Element Class (`element.js`)
Manages individual draggable DOM elements with full property and attribute control.

**Key Methods:**
- `setProperty(propertyName, value)` - Set CSS properties
- `getProperty(propertyName)` - Get CSS property value
- `setAttribute(attributeName, value)` - Set HTML attributes
- `getAttribute(attributeName)` - Get HTML attribute value
- `select()` / `deselect()` - Handle selection state
- `getAllProperties()` - Get all CSS properties
- `getAllAttributes()` - Get all HTML attributes
- `toHTML()` - Export element as HTML string
- `clone()` - Create a copy of the element

**Supported CSS Properties:**
- Layout: width, height, padding, margin, display, position, zIndex
- Colors: backgroundColor, color, border, borderRadius, opacity
- Typography: fontSize, fontWeight, textAlign

#### ElementManager Class (`element.js`)
Manages all elements in the canvas and handles drag-drop operations.

**Key Methods:**
- `createElement(type, properties, attributes, position)` - Create new element
- `selectElement(element)` - Select an element
- `deselectAll()` - Deselect all elements
- `removeElement(element)` - Delete an element
- `getSelectedElement()` - Get currently selected element
- `getAllElements()` - Get all canvas elements
- `exportHTML()` - Export all elements as HTML

#### PropertyPanel Class (`panels.js`)
Editable CSS properties panel with 15+ common properties.

**Managed Properties:**
- width, height, padding, margin
- backgroundColor, color, fontSize, fontWeight
- textAlign, border, borderRadius
- opacity, display, position, zIndex

#### AttributePanel Class (`panels.js`)
Editable HTML attributes panel and element deletion.

**Managed Attributes:**
- id - Element identifier
- class - CSS class names
- title - Hover tooltip
- textContent - Element text content

## Panel Layout

```
┌─────────────────────────────────────────────────────────┐
│                        TOP BAR                           │
│                 (Theme & Panels Menu)                   │
├──────────┬──────────────────────┬──────────┐
│  Add     │                      │Attributes│
│Elements  │      Canvas          │Properties│
│  &Tree   │     (Editable)       │          │
│          │                      │          │
└──────────┴──────────────────────┴──────────┘
```

## Supported Element Types

The Add Elements panel includes 13 draggable element types:

1. **📦 Div** - Generic container
2. **📝 Paragraph** - Text paragraph
3. **📄 Heading 1** - Main heading
4. **📃 Heading 2** - Sub heading
5. **📋 Heading 3** - Minor heading
6. **🔘 Button** - Clickable button
7. **⌨️ Input** - Text input field
8. **🏷️ Label** - Form label
9. **✂️ Span** - Inline container
10. **🔗 Link** - Hyperlink
11. **🖼️ Image** - Image element
12. **📋 List** - Unordered list
13. **•** - List Item

## How to Use

### Adding Elements
1. Locate the **Add Elements** panel on the left
2. Click and drag any element type to the **Canvas** area
3. Drop to place the element at that position

### Editing Element Properties
1. Click on an element in the canvas to select it
2. Modify CSS properties in the **Properties** panel on the right
3. Changes are applied in real-time to the canvas

### Editing Element Attributes
1. With an element selected, view the **Attributes** panel
2. Edit element ID, class, title, or text content
3. All changes update immediately

### Selecting Elements
- **Canvas Selection**: Click any element in the canvas
- **Tree Selection**: Click element name in the Elements panel on the left
- **Visual Feedback**: Selected elements show a blue outline

### Deleting Elements
1. Select an element
2. Click the **🗑️ Delete Element** button in the Attributes panel

## Event System

### Window Events
- `elementSelected` - Fired when element is selected
  - Detail: `{ element }`
- `elementDeleted` - Fired when element deletion is triggered
  - Detail: `{ element }`

### Element Change Events
Elements emit change events that can be listened to:
```javascript
element.onChange('propertyChanged', (data) => {
    console.log(data.property, data.value);
});

element.onChange('attributeChanged', (data) => {
    console.log(data.attribute, data.value);
});

element.onChange('selected', (data) => {
    console.log('Element selected:', data.element);
});
```

## JavaScript Files

### `element.js` (New)
Contains Element and ElementManager classes for managing draggable elements and canvas operations.

### `panels.js` (New)
Contains PropertyPanel and AttributePanel classes for editing element properties and attributes.

### `init.js` (Updated)
Integrates all components, sets up drag-drop handlers, and manages panel communication.

### `panelManager.js` (Existing)
Manages the Golden Layout panel layout system.

### `themes.js` (Existing)
Handles theme switching functionality.

### `styles.css` (Updated)
Enhanced with styling for all new components and panels.

## CSS Classes Added

### Containers
- `.add-panel-container` - Add Elements panel wrapper
- `.canvas-container` - Canvas area wrapper
- `.tree-panel-container` - Elements tree panel
- `.properties-panel-wrapper` - Properties panel
- `.attributes-panel-wrapper` - Attributes panel

### Element Lists
- `.add-elements-list` - List of draggable elements
- `.tree-elements-list` - List of canvas elements
- `.add-element-btn` - Individual draggable element button

### Forms
- `.properties-form` - Properties form container
- `.attributes-form` - Attributes form container
- `.property-group` / `.attribute-group` - Form groups
- `.property-input` / `.attribute-input` - Form inputs
- `.property-label` / `.attribute-label` - Form labels

### Special Elements
- `.tree-item` - Element tree item
- `.tree-item.selected` - Selected tree item
- `.delete-element-btn` - Delete button

## Keyboard Shortcuts (To Be Implemented)
- `Del` or `Backspace` - Delete selected element
- `Ctrl+D` - Duplicate selected element
- `Ctrl+Z` - Undo (if implemented)
- `Ctrl+Y` - Redo (if implemented)

## Data Persistence (To Be Implemented)
- Save/Load project HTML
- Export canvas HTML
- Import HTML files

## Future Enhancements
1. Keyboard shortcuts support
2. History/Undo system
3. Copy/Paste/Duplicate elements
4. Layer management
5. Responsive preview
6. Export to file
7. Grid/Snap to guides
8. Multi-select
9. Grouping elements
10. Animation/Transition support
11. More element types (form elements, tables, etc.)
12. Custom CSS editor
13. Template library

## Browser Compatibility
- Chrome/Chromium: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support
- Edge: ✓ Full support
- IE11: ✗ Not supported

## Dependencies
- jQuery (for Golden Layout)
- Golden Layout (panel management)

## Notes
- Elements are positioned relative to canvas by default
- Selected elements show a blue outline with 2px offset
- Grid background in canvas helps with positioning
- Drag-and-drop uses HTML5 Drag and Drop API
- Real-time property updates with no save required