# 🚀 Web Builder - Quick Start Guide

Get up and running with the Web Builder in 5 minutes!

## 📥 Installation

1. **No installation needed!** Just open `builder.html` in your web browser
2. The builder runs entirely in the browser using vanilla JavaScript
3. All data is saved to your computer as JSON files

## 🎯 Step-by-Step Tutorial

### Step 1: Open the Builder
```
file:///path/to/builder.html
```

### Step 2: Choose Your Template

When you open the builder, you'll see 4 template options:

| Template | Best For |
|----------|----------|
| 📄 **Blank Canvas** | Starting completely from scratch |
| 🌐 **Landing Page** | Hero sections, call-to-actions |
| 🎨 **Portfolio** | Showcasing projects/portfolio items |
| 🛍️ **E-Commerce** | Product listings and details |

**👉 Select "Landing Page" for your first project**

### Step 3: Tour the Interface

```
┌─────────────────────────────────────────────────────────┐
│ 🎨 Web Builder    Project Name    [Preview] [🌙 Theme] │  ← Header
├──────────────────────────────────────────────────────────┤
│         │ Toolbar with element buttons                │
│ Tree    ├──────────────────────────────────────────────│
│ View    │                                              │  ← Canvas
│         │          WYSIWYG Editor Area                 │
│         │                                              │
│         ├──────────────────────────────────────────────│
│         │ Properties Panel ►                           │
└──────────────────────────────────────────────────────────┘
```

**Left Panel (Tree)**: Shows all elements in hierarchy
**Top Center (Toolbar)**: Add/edit/delete elements
**Center (Canvas)**: Visual editor - drag, resize, arrange
**Right Panel (Properties)**: Edit colors, sizing, text, etc.

### Step 4: Add Your First Element

1. Click the **📝 Text** button in toolbar
2. A text element appears on canvas
3. It's automatically selected (blue outline)
4. Edit the text in the **Properties Panel** on the right
5. Change font size, color, etc. in Properties

### Step 5: Create a Layout

1. Click **📦 Container** button
2. A box appears - this is your layout container
3. Click inside it to select it
4. Click **📝 Text** again - text is now *inside* the container
5. Build your structure:
   ```
   Container (parent)
   ├─ Text (child)
   ├─ Image (child)
   └─ Button (child)
   ```

### Step 6: Position & Resize

**Move an element:**
- Click and drag it on canvas

**Resize an element:**
- Click the blue **corner handles** or **edge handles**
- Drag to resize

**Lock an element:**
- Click 🔒 in the Tree panel (left side)
- Prevents accidental moving

**Hide an element:**
- Click 👁️ in the Tree panel
- Useful for temporary hiding while you work

### Step 7: Edit Properties

Select any element and edit in the **Properties Panel**:

- **Dimensions**: Width, Height
- **Position**: Top, Left (spacing from parent)
- **Spacing**: Padding (inside), Margin (outside)
- **Colors**: Background, Text color
- **Typography**: Font size, Font weight
- **Borders**: Style, Radius (rounded corners)

**Live Preview**: Changes update instantly on canvas!

### Step 8: Add Content

Depending on element type:

**Text Element:**
- Edit "Content" field with your text
- Change font size, weight, color

**Image Element:**
- Paste image URL in "Source" field
- Set alt text for accessibility
- Or use 🖼️ asset browser (requires API key)

**Button Element:**
- Edit label text
- Set background color
- Set href/link if needed

**Icon Element:**
- Click to browse icon library
- Select from thousands of icons

### Step 9: Multi-Select & Bulk Edit

Select multiple elements at once:

1. **Single select**: Click an element
2. **Multi-select**: Ctrl+Click (Cmd+Click on Mac) multiple times
3. **Marquee select**: Click and drag to draw selection box
4. **Range select**: Shift+Click

Edit all selected elements' properties at once!

**Bulk Actions:**
- Delete all: Press `Delete` key
- Duplicate all: Press `Ctrl+D`

### Step 10: Preview Your Website

1. Click **[Preview]** button in header
2. New window opens with live preview
3. See how your website looks
4. Close to return to editor

### Step 11: Save Your Project

1. Click **💾 Save** in toolbar
2. A JSON file downloads to your computer
3. Save as: `my-project.json`
4. Later, click **📂 Load** to reload

### Step 12: Theme Customization

Click **Theme** menu in header to switch UI themes for the builder (not your website).

To customize project theme (colors/fonts):
1. Look for theme options in Properties Panel
2. Edit project-level colors and fonts
3. Your website inherits these colors

---

## ⌨️ Keyboard Shortcuts You Need to Know

```
Delete Key       → Delete selected element(s)
Ctrl+D (Cmd+D)   → Duplicate selected element(s)
Ctrl+Click       → Multi-select elements
Shift+Click      → Range select
```

---

## 🎨 Design Tips

### 1. Start with a Layout
```
Root Container (100% width)
├─ Header (full width, small height)
├─ Main Content (full width, flexible)
└─ Footer (full width, small height)
```

### 2. Use Containers for Groups
```
Container for "Card" or "Section"
├─ Image
├─ Title Text
├─ Description Text
└─ Button
```

### 3. Set Up Your Color Scheme First
Use the Theme editor to define:
- Primary color (buttons, links)
- Secondary color (accents)
- Background colors
- Text color

Then apply these consistently.

### 4. Mobile-First Thinking
- Make containers flexible width: `100%`
- Use padding instead of large margins
- Keep text readable (min 14px)
- Test in Preview frequently

### 5. Use the Tree to Stay Organized
- Rename elements descriptively: "Header", "Hero Button", not "Div 1"
- Group related elements in containers
- Use lock (🔒) to prevent accidental changes
- Hide complex nested structures while working

---

## 🚨 Common Issues & Solutions

### "My element is locked"
- 🔒 icon shows locked elements
- Click 🔒 to unlock

### "I can't select an element"
- It might be inside another locked container
- Unlock the parent container first

### "Element disappeared"
- Click 👁️ in Tree to toggle visibility
- Check if it's layered behind another element (z-index)

### "Preview doesn't show my changes"
- Click Preview again to refresh
- Changes auto-save as you make them

### "Drag/resize isn't working smoothly"
- Make sure the element is selected (blue outline)
- Try clicking on a different area of the element
- Click Canvas background once, then click element again

### "How do I delete all elements and start over?"
- Select all: Click root in tree, then Ctrl+A
- Delete: Press Delete key
- Or just reload the page and start new template

---

## 📂 What Gets Saved?

When you click **Save**, you get a JSON file containing:

```json
{
  "id": "proj_xyz",
  "name": "My Landing Page",
  "rootElement": {
    "type": "root",
    "children": [ ... all your elements ... ]
  },
  "theme": {
    "colors": { ... your colors ... },
    "fonts": { ... your fonts ... }
  }
}
```

You can:
1. **Reload later** with **Load** button
2. **Share** with team members
3. **Edit manually** in text editor
4. **Backup** to cloud storage

---

## 🌐 Export Your Website

To get a real HTML file:
1. Click **Preview** button
2. Right-click → **Save Page As**
3. Save as HTML
4. Use in production or upload to host

The exported HTML includes all your:
- Elements and layout
- Styles and colors
- Content and images
- Theme colors

---

## 🔧 Advanced Features

### Element Lock & Visibility
- **Lock** (🔒): Prevents accidental editing
- **Visibility** (👁️): Hide while editing

### Keyboard Shortcuts
- `Delete` - Delete element
- `Ctrl+D` / `Cmd+D` - Duplicate
- `Ctrl+Click` / `Cmd+Click` - Multi-select
- `Shift+Click` - Range select

### Multi-Element Editing
- Select multiple elements
- Edit properties together
- Move/resize all at once
- Delete as a group

### Advanced CSS
- Edit raw CSS in Advanced Editor
- Full CSS property access
- Custom values

---

## 🎓 Practice Exercise

**Create a Simple Product Card in 10 minutes:**

1. Start with Blank Canvas template
2. Add Container (base card)
3. Add Image inside (640x360px)
4. Add Text below (product title)
5. Add Text below (price)
6. Add Button (yellow, labeled "Buy Now")
7. Set background to light gray
8. Add padding around everything
9. Set border-radius to 8px for rounded corners
10. Preview!

**Bonus:** Duplicate the card 3 times and arrange them in a grid.

---

## 📚 Learn More

- **Full Documentation**: See `BUILDER_README.md`
- **Data Models**: Check `builder/models/` folder
- **Customization**: Extend `builder/services/`
- **API Keys**: Configure in `AssetLibrary.js`

---

## 💡 Next Steps After This Tutorial

1. ✅ Create your first page (this tutorial)
2. 📱 Learn responsive design principles
3. 🎨 Customize colors and typography
4. 🖼️ Add images from Unsplash
5. 💾 Save and share projects
6. 🚀 Export and deploy websites

---

## ❓ FAQ

**Q: Do I need to install anything?**
A: No! It runs in your browser.

**Q: Where is my data saved?**
A: Download as JSON files to your computer. You can also use browser storage.

**Q: Can I use my own fonts?**
A: Yes! Google Fonts are integrated. Set in theme or element properties.

**Q: Can I add custom HTML/CSS?**
A: Yes! Use Advanced CSS Editor for raw CSS.

**Q: Can I work offline?**
A: Yes! Save projects as JSON locally.

**Q: Can I share projects with team members?**
A: Yes! Share the JSON file. They can load it with [Load] button.

**Q: Is my data private?**
A: Yes! Everything stays on your computer. No server upload.

**Q: Can I add JavaScript interactions?**
A: Not yet in this version. Planned for future release.

**Q: What browser do I need?**
A: Modern browsers: Chrome, Firefox, Safari, Edge. Not IE11.

---

## 🎉 You're Ready!

You now know:
- ✅ How to open the builder
- ✅ How to add and edit elements
- ✅ How to position and resize
- ✅ How to customize properties
- ✅ How to save and preview

**Start building your website now! 🚀**

Have fun, and don't hesitate to experiment - you can always undo or reload!

---

**Questions?** Check the full docs or create an issue.

**Happy building! 🎨**
