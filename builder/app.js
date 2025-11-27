/**
 * Main Builder Application - Orchestrates all builder services
 */
class BuilderApp {
    constructor() {
        this.project = null;
        this.treeService = null;
        this.canvasRenderer = null;
        this.propertiesPanel = null;
        this.toolbar = null;
        this.themeManager = null;
    }

    init() {
        this.showTemplateSelection();
    }

    showTemplateSelection() {
        const modal = document.getElementById('template-modal');
        const grid = document.getElementById('templates-grid');
        
        grid.innerHTML = '';
        const templates = getAllTemplates();
        
        templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <div class="icon">${template.thumbnail}</div>
                <div class="name">${template.name}</div>
                <div class="description">${template.description}</div>
            `;
            card.onclick = () => this.startWithTemplate(template);
            grid.appendChild(card);
        });
        
        modal.classList.add('show');
    }

    startWithTemplate(template) {
        // Hide modal
        document.getElementById('template-modal').classList.remove('show');

        // Create project from template
        const rootElement = Element.fromJSON(template.rootElement);
        this.project = new Project({
            name: template.name + ' - ' + new Date().toLocaleTimeString(),
            rootElement: rootElement
        });

        // Initialize all services
        this.initializeServices();
        this.setupEventListeners();
        this.render();
    }

    initializeServices() {
        // Initialize theme manager
        this.themeManager = new ThemeManager();
        this.themeManager.init();

        // Initialize canvas renderer
        this.canvasRenderer = new EnhancedCanvasRenderer('#builder-canvas');
        this.canvasRenderer.init(this.project);

        // Initialize tree service
        this.treeService = new ElementTreeService();
        this.treeService.init(this.project, '#tree-panel');

        // Initialize properties panel
        this.propertiesPanel = new PropertiesPanel('#properties-panel');
        this.propertiesPanel.init(this.project);

        // Initialize toolbar
        this.toolbar = new Toolbar('#toolbar-container');
        this.toolbar.init(this.project, this.treeService, this.canvasRenderer);

        // Initialize asset library
        this.assetModal = new AssetModal();
    }

    setupEventListeners() {
        // Element selection from canvas
        document.addEventListener('elementSelected', (event) => {
            const selectedIds = event.detail.selectedIds;
            this.treeService.selectedNodes = selectedIds;
            this.treeService.updateTreeSelection();
            this.propertiesPanel.updateSelection(selectedIds);
        });

        // Element properties changed
        document.addEventListener('elementPropertiesChanged', (event) => {
            this.canvasRenderer.render();
        });

        // Project loaded from file
        document.addEventListener('projectLoaded', (event) => {
            this.project = event.detail.project;
            this.canvasRenderer.init(this.project);
            this.treeService.init(this.project, '#tree-panel');
            this.propertiesPanel.init(this.project);
            this.render();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Delete') {
                this.treeService.deleteSelected();
                this.canvasRenderer.render();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.treeService.duplicateSelected();
                this.canvasRenderer.render();
            }
        });

        // Theme switcher
        const themeSwitcher = document.getElementById('theme-switcher');
        if (themeSwitcher) {
            themeSwitcher.onclick = () => {
                const themes = this.themeManager.getAvailableThemes();
                const currentIndex = themes.indexOf(this.themeManager.currentTheme);
                const nextTheme = themes[(currentIndex + 1) % themes.length];
                this.themeManager.switchTheme(nextTheme);
            };
        }

        // Preview button
        const previewBtn = document.getElementById('preview-btn');
        if (previewBtn) {
            previewBtn.onclick = () => this.openPreview();
        }

        // Update project title
        const titleElement = document.getElementById('project-title');
        if (titleElement) {
            titleElement.textContent = this.project.name;
        }
    }

    render() {
        this.canvasRenderer.render();
        this.treeService.render();
    }

    openPreview() {
        const previewHTML = this.generatePreviewHTML();
        const blob = new Blob([previewHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    generatePreviewHTML() {
        const elements = this.project.getAllElements();
        const elementDOMs = elements.map(el => this.elementToHTML(el)).join('\n');

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.project.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; }
        ${this.generatePreviewCSS()}
    </style>
</head>
<body>
    <div id="root" style="${this.stylesToCSS(this.project.rootElement.styles)}">
        ${this.renderElementsHTML(this.project.rootElement)}
    </div>
</body>
</html>
        `;
    }

    renderElementsHTML(element) {
        if (element.type === 'root') {
            return element.children.map(child => this.elementToHTMLString(child)).join('\n');
        }
        return this.elementToHTMLString(element);
    }

    elementToHTMLString(element) {
        const style = this.stylesToCSS(element.styles);
        const attrs = Object.entries(element.properties)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k}="${v}"`)
            .join(' ');

        let content = '';
        if (element.type === 'text') {
            content = element.text;
        } else if (element.type === 'image' && element.properties.src) {
            return `<img ${attrs} style="${style}"/>`;
        } else if (element.children && element.children.length > 0) {
            content = element.children.map(c => this.elementToHTMLString(c)).join('\n');
        } else {
            content = element.html;
        }

        return `<${element.tagName} style="${style}" ${attrs}>${content}</${element.tagName}>`;
    }

    stylesToCSS(styles) {
        return Object.entries(styles)
            .filter(([, v]) => v)
            .map(([k, v]) => `${this.camelToKebab(k)}: ${v}`)
            .join('; ');
    }

    generatePreviewCSS() {
        return `.builder-element { box-sizing: border-box; }`;
    }

    camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new BuilderApp();
    app.init();
});
