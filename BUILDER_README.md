# Web Builder - Visual Website Design Tool

A powerful, feature-rich web builder for creating responsive websites without coding.

## ✨ Features

### Core Editing
- **Element Creation**: Add containers, text, images, buttons, icons, links
- **Element Operations**: Delete, duplicate, nest elements in containers
- **Tree View**: Hierarchical view with expand/collapse and visibility toggle
- **Multi-Select**: Single-click, Ctrl+click, and marquee drag selection
- **Drag & Move**: Reposition elements on canvas
- **Resizable**: 8-point resize handles for precise control
- **Keyboard Shortcuts**: Delete (Del), Duplicate (Ctrl+D)

### Properties & Styling
- **Live Properties Editor**: Real-time CSS editing
- **Common Properties**: Dimensions, Position, Spacing, Colors, Typography, Border
- **Element-Specific Props**: Images (src, alt), Text content, Button labels, Icons
- **Advanced CSS Editor**: Write raw CSS for expert control

### Project Management
- **Templates**: Blank, Landing Page, Portfolio, E-Commerce
- **Save/Load**: Export/import projects as JSON
- **Preview Mode**: Real-time website preview
- **Auto-save**: Optional project persistence

### Themes
- **Project Themes**: Create custom color and font themes
- **Theme Editor**: Visual theme customization UI
- **UI Themes**: Light, Dark, Blue, Green, Purple, High Contrast

### API Integrations
- **Images**: Unsplash API integration
- **Icons**: Iconify API for vector icons
- **Fonts**: Google Fonts library
- **Asset Modal**: Browse and insert directly

## 🚀 Quick Start

```bash
# 1. Open in browser
file:///path/to/builder.html

# 2. Select a template
Choose from Blank, Landing Page, Portfolio, or E-Commerce

# 3. Add elements
Click toolbar buttons or use Ctrl+Shift+E (soon)

# 4. Edit & style
Properties panel on the right, live preview

# 5. Save or preview
Download JSON or open HTML preview
```

## 🎯 Usage Examples

### Create a Landing Page
```
1. Start with "Landing Page" template
2. Edit existing sections
3. Add images with "Image" button
4. Set links with "Link" element
5. Customize colors in Properties
6. Preview and save
```

### Build a Portfolio
```
1. Select "Portfolio" template
2. Add project containers
3. Upload images to project sections
4. Add text descriptions
5. Link to external projects
6. Export HTML
```

### Design E-Commerce Page
```
1. Choose "E-Commerce" template
2. Duplicate product containers
3. Add images and prices
4. Create "Add to Cart" buttons
5. Style with theme colors
6. Export for backend integration
```

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Delete Element | `Delete` / `Backspace` |
| Duplicate Element | `Ctrl+D` / `Cmd+D` |
| Multi-Select | `Ctrl+Click` / `Cmd+Click` |
| Select Range | `Shift+Click` |
| Marquee Select | Click & drag on canvas |

## 📁 Project Structure

```
builder/
├── models/
│   ├── Element.js              # Element data model
│   ├── Project.js              # Project model
│   └── Templates.js            # Template presets
├── services/
│   ├── ElementTreeService.js   # Tree view
│   ├── CanvasRenderer.js       # Basic rendering
│   ├── EnhancedCanvasRenderer.js # Advanced rendering
│   ├── PropertiesPanel.js      # Properties UI
│   ├── Toolbar.js              # Toolbar
│   ├── AssetLibrary.js         # API integrations
│   └── ThemeEditor.js          # Theme editor
└── app.js                      # Main app

builder.html                    # Entry point
css/builder.css                 # Styles
README_BUILDER.md              # This file
```

## 🔑 API Keys (Optional)

For third-party integrations, add your API keys to `builder/services/AssetLibrary.js`:

```javascript
// Unsplash Images
this.accessKey = 'YOUR_UNSPLASH_KEY';

// Google Fonts
this.apiKey = 'YOUR_GOOGLE_FONTS_KEY';
```

Get keys at:
- Unsplash: https://unsplash.com/developers
- Google Fonts: https://developers.google.com/fonts/docs/developer_api

Without keys, the asset library will still work with cached/demo data.

## 📊 Data Models

### Element
```javascript
{
  id: "elem_abc123",
  type: "container",      // container, text, image, button, icon, link
  tagName: "div",
  name: "My Container",
  styles: {
    width: "100px",
    height: "100px",
    backgroundColor: "#fff",
    padding: "10px",
    margin: "0px",
    border: "none",
    // ... more CSS properties
  },
  properties: {
    src: "",               // for images
    alt: "",               // for images
    href: "",              // for links
    text: "",              // for text
    iconName: ""           // for icons
  },
  children: [],            // nested elements
  parentId: null,
  isSelected: false,
  isLocked: false,
  isVisible: true
}
```

### Project
```javascript
{
  id: "proj_xyz",
  name: "My Website",
  rootElement: {...},     // Element
  theme: {
    name: "Default",
    colors: { primary: "#007bff", ... },
    fonts: { primary: "Arial", ... }
  },
  settings: {
    snapToGrid: true,
    gridSize: 10
  }
}
```

## 🎨 Extending the Builder

### Add New Element Type
1. Update `Element.js` with new type
2. Add renderer in `EnhancedCanvasRenderer.js`
3. Add properties in `PropertiesPanel.js`
4. Add button in `Toolbar.js`

### Create Custom Template
1. Design in builder
2. Export project JSON
3. Add to `Templates.js`

### Custom Asset Source
1. Extend `AssetLibrary.js`
2. Implement API wrapper class
3. Add modal integration

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome/Chromium | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| IE 11 | ❌ Not supported |

## ⚡ Performance

- Recommended max: 500 elements per project
- Large trees may show lag - consider splitting
- Canvas renders efficiently with virtual updates
- Asset library caches API responses

## 🐛 Known Issues

- Undo/redo not yet implemented
- Mobile preview limited
- Animation editor not available
- Form validation not built-in

## 📝 Roadmap

- [ ] Undo/Redo stack
- [ ] Animation editor
- [ ] Mobile responsive preview
- [ ] Component library
- [ ] CMS integration
- [ ] Backend connector
- [ ] Collaborative editing
- [ ] Version history

## 💡 Tips & Tricks

1. **Lock elements** to prevent accidental moves
2. **Use containers** to group related elements
3. **Duplicate** for quick layout repetition
4. **Preview often** to check styling
5. **Save frequently** to preserve work
6. **Use templates** to start faster
7. **Organize tree** with descriptive names

## 🤝 Contributing

Want to improve the builder? 

1. Fork and clone
2. Make changes to relevant files
3. Test thoroughly
4. Submit pull request with description

## 📄 License

MIT License - Free to use and modify

## 🆘 Support & Feedback

- Create an issue for bugs
- Suggest features via discussions
- Check documentation first
- Search existing issues

---

**Built with ❤️ for web designers and developers**

**Happy building! 🎨**
