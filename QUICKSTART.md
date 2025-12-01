## 🚀 Quick Start Guide - Web Builder

### What's New?
Your web builder now has a complete element system with:
- ✅ **Element Class** - Drag-and-drop elements with full property control
- ✅ **Add Panel** - 13 different HTML element types to drag from
- ✅ **Canvas Area** - Central editing area where you drop and arrange elements
- ✅ **Properties Panel** - Edit 15+ CSS properties in real-time
- ✅ **Attributes Panel** - Edit element attributes (id, class, title, text)
- ✅ **Elements Tree** - Visual tree of all elements on the canvas

### Panel Layout Overview

**Left Column (10% width):**
- Top: Add Elements panel with draggable element types
- Bottom: Elements tree showing all canvas elements

**Center Column (40% width):**
- Canvas area with grid background for precise placement
- Drag elements here from the Add panel

**Right Column (10% width):**
- Top: Attributes panel for editing element properties
- Bottom: Properties panel for CSS styling

### Step-by-Step Usage

#### 1. Add an Element
1. Look at the **Add Elements** panel on the left
2. Click and hold on any element (e.g., "📦 Div")
3. Drag it to the center **Canvas** area
4. Release to drop it

#### 2. Select an Element
- **Method 1:** Click directly on the element in the canvas
- **Method 2:** Click the element name in the **Elements** tree on the left
- **Visual Feedback:** Selected elements show a blue outline

#### 3. Edit Element Properties (CSS)
1. Make sure your element is selected
2. Go to the **Properties** panel (bottom right)
3. Change any property:
   - **Size:** width, height
   - **Spacing:** padding, margin
   - **Colors:** background, text color
   - **Appearance:** border, radius, opacity
   - **Layout:** display, position, z-index
   - **Text:** font size, weight, alignment

#### 4. Edit Element Attributes
1. With element selected, view the **Attributes** panel (top right)
2. Edit:
   - **ID:** Unique identifier for the element
   - **Class:** CSS class names (space-separated)
   - **Title:** Text that appears on hover
   - **Text Content:** The actual text displayed in the element

#### 5. Delete an Element
1. Select the element
2. Click the **🗑️ Delete Element** button at the bottom of the Attributes panel

### Available Element Types

| Icon | Type | Use Case |
|------|------|----------|
| 📦 | Div | Container/wrapper |
| 📝 | Paragraph | Text content |
| 📄 | Heading 1 | Main title |
| 📃 | Heading 2 | Subtitle |
| 📋 | Heading 3 | Minor heading |
| 🔘 | Button | Clickable button |
| ⌨️ | Input | Text field |
| 🏷️ | Label | Form label |
| ✂️ | Span | Inline element |
| 🔗 | Link | Hyperlink |
| 🖼️ | Image | Images |
| 📋 | List | Unordered list |
| • | List Item | List items |

### CSS Properties Reference

**Dimensions:**
- `width` - Element width (e.g., "100px", "50%")
- `height` - Element height (e.g., "50px", "auto")

**Spacing:**
- `padding` - Internal spacing (e.g., "10px", "10px 20px")
- `margin` - External spacing (e.g., "5px", "10px auto")

**Colors:**
- `backgroundColor` - Background color (use color picker or hex)
- `color` - Text color
- `border` - Border style (e.g., "1px solid #ccc")
- `borderRadius` - Corner rounding (e.g., "5px", "50%")

**Typography:**
- `fontSize` - Text size (e.g., "14px", "1.5em")
- `fontWeight` - Text weight (normal, bold, or 100-900)
- `textAlign` - Text alignment (left, center, right, justify)

**Visual:**
- `opacity` - Transparency (0.0 to 1.0)
- `display` - Display type (block, inline, inline-block, flex, grid, none)
- `position` - Positioning (relative, absolute, fixed, static, sticky)
- `zIndex` - Layer order (number like 1, 2, 3, etc.)

### Tips & Tricks

✨ **Pro Tips:**
- Use negative margin values to overlap elements
- Set `position: absolute` to place elements precisely
- Use `display: flex` for advanced layouts
- Check **Elements** tree when managing many elements
- Use meaningful IDs and classes for organization
- Combine multiple elements to create complex layouts

🎨 **Styling Tips:**
- Colors can be entered as hex (#FF0000), rgb(255,0,0), or color names (red)
- Use `border-radius: 50%` to create circles
- Try `opacity: 0.5` for transparency effects
- `text-align: center` + padding creates nice buttons

⚙️ **Performance Tips:**
- Keep the canvas organized with the Elements tree
- Delete unused elements to keep the UI responsive
- Complex layouts may benefit from grouping in containers

### Files Structure

```
WB/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styling
├── js/
│   ├── element.js         # Element & ElementManager classes (NEW)
│   ├── panels.js          # PropertyPanel & AttributePanel (NEW)
│   ├── init.js            # Setup & integration (UPDATED)
│   ├── panelManager.js    # Panel layout system
│   └── themes.js          # Theme switching
└── README.md              # Full documentation
```

### Common Issues & Solutions

**Q: Elements won't appear when I drop them**
- Make sure you're dragging INTO the white canvas area
- Check that your browser allows drag-and-drop

**Q: Properties aren't updating in the canvas**
- Make sure the element is selected (blue outline)
- Check that you're pressing Enter or clicking outside the input field

**Q: Can't see all properties**
- Scroll down in the Properties panel if needed
- Some properties appear only on certain element types

**Q: Want to see the HTML output?**
- Open browser console with F12
- Run: `elementManager.exportHTML()`

### Keyboard Shortcuts (Available Soon)
- `Delete` - Delete selected element
- `Ctrl+D` - Duplicate element (coming soon)
- `Ctrl+Z` - Undo (coming soon)

### Next Steps

**Try creating:**
1. A simple button with custom colors
2. A form with input fields and labels
3. A heading with different sized text
4. A layout with divs using flexbox

### Need Help?
- Check the **README.md** for complete documentation
- Look at the **Elements** tree to verify structure
- Use the **Properties** panel to explore CSS options
- Open DevTools (F12) to inspect elements

Happy building! 🎉
