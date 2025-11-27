class BuilderGoldenApp {
    constructor() {
        this.layout = null;
        this.project = null;
        this.themeManager = null;
        this.menuManager = null;
        
        this.selectedElement = null;
        this.elements = [];
        this.elementDomMap = new Map();
    }

    init() {
        this.showTemplateModal();
    }

    showTemplateModal() {
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
            card.onclick = () => this.loadTemplate(template);
            grid.appendChild(card);
        });
        
        document.getElementById('blank-project-btn').onclick = () => {
            this.createBlankProject();
        };
        
        document.getElementById('close-modal-btn').onclick = () => {
            this.createBlankProject();
        };
        
        modal.classList.add('show');
    }

    loadTemplate(template) {
        document.getElementById('template-modal').classList.remove('show');
        this.project = new Project('Untitled Project');
        
        // Load template's root element
        if (template.rootElement) {
            const rootElem = Element.fromJSON(template.rootElement);
            this.project.rootElement = rootElem;
        }
        
        this.initializeLayout();
    }

    createBlankProject() {
        document.getElementById('template-modal').classList.remove('show');
        this.project = new Project('Untitled Project');
        this.initializeLayout();
    }

    initializeLayout() {
        const config = {
            settings: {
                showPopoutIcon: false,
                showMaximiseIcon: false,
                showCloseIcon: true
            },
            content: [{
                type: 'row',
                content: [
                    {
                        type: 'column',
                        width: 20,
                        content: [
                            { 
                                type: 'component', 
                                componentName: 'toolbar', 
                                componentState: { title: 'Toolbar' },
                                id: 'toolbar-panel'
                            },
                            { 
                                type: 'component', 
                                componentName: 'tree', 
                                componentState: { title: 'Elements' },
                                id: 'tree-panel'
                            }
                        ]
                    },
                    {
                        type: 'component',
                        width: 60,
                        componentName: 'canvas',
                        componentState: { title: 'Canvas' },
                        id: 'canvas-panel'
                    },
                    {
                        type: 'component',
                        width: 20,
                        componentName: 'properties',
                        componentState: { title: 'Properties' },
                        id: 'properties-panel'
                    }
                ]
            }]
        };

        // Create layout
        this.layout = new GoldenLayout(config, '#layout-root');
        
        // Register components with proper factory functions
        const self = this;
        
        this.layout.registerComponent('toolbar', function(container, state) {
            self.createToolbarPanel(container, state);
        });
        
        this.layout.registerComponent('tree', function(container, state) {
            self.createTreePanel(container, state);
        });
        
        this.layout.registerComponent('canvas', function(container, state) {
            self.createCanvasPanel(container, state);
        });
        
        this.layout.registerComponent('properties', function(container, state) {
            self.createPropertiesPanel(container, state);
        });
        
        // Initialize the layout AFTER registering components
        this.layout.init();
        
        // Initialize services
        this.initializeServices();
        this.setupEventListeners();
        this.setupMenuHandlers();
    }

    createToolbarPanel(container, state) {
        const element = container.getElement();
        element[0].innerHTML = `
            <div id="builder-toolbar" style="padding: 8px; display: flex; flex-wrap: wrap; gap: 4px;">
                <button class="toolbar-btn" data-action="add-container">📦 Container</button>
                <button class="toolbar-btn" data-action="add-text">📝 Text</button>
                <button class="toolbar-btn" data-action="add-image">🖼️ Image</button>
                <button class="toolbar-btn" data-action="add-button">🔘 Button</button>
                <button class="toolbar-btn" data-action="add-icon">⭐ Icon</button>
                <button class="toolbar-btn" data-action="add-link">🔗 Link</button>
                <div style="width: 100%; height: 1px; background: #ccc; margin: 4px 0;"></div>
                <button class="toolbar-btn" data-action="duplicate">📋 Duplicate</button>
                <button class="toolbar-btn" data-action="delete">🗑️ Delete</button>
                <div style="width: 100%; height: 1px; background: #ccc; margin: 4px 0;"></div>
                <button class="toolbar-btn" data-action="save">💾 Save</button>
                <button class="toolbar-btn" data-action="load">📂 Load</button>
            </div>
        `;
        
        element[0].querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.style.padding = '6px 10px';
            btn.style.border = '1px solid #ccc';
            btn.style.borderRadius = '3px';
            btn.style.background = '#f5f5f5';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '12px';
            
            btn.addEventListener('click', (e) => this.handleToolbarAction(e.target.closest('button').dataset.action));
        });
    }

    createTreePanel(container, state) {
        const element = container.getElement();
        element[0].innerHTML = `
            <div id="tree-panel" style="padding: 8px; overflow-y: auto; height: 100%;">
                <div style="font-size: 12px; color: #999;">Elements</div>
            </div>
        `;
        
        this.renderTree();
    }

    createCanvasPanel(container, state) {
        const element = container.getElement();
        element[0].innerHTML = `
            <div id="builder-canvas" style="width: 100%; height: 100%; background: white; overflow: auto; position: relative; border: 1px solid #ddd;">
                <div style="padding: 20px; min-height: 100%;" id="canvas-workspace"></div>
            </div>
        `;
    }

    createPropertiesPanel(container, state) {
        const element = container.getElement();
        element[0].innerHTML = `
            <div id="properties-panel" style="padding: 8px; overflow-y: auto; height: 100%; font-size: 12px;">
                <div style="color: #999;">Select an element to edit</div>
            </div>
        `;
    }

    handleToolbarAction(action) {
        switch(action) {
            case 'add-container':
                this.addElement('container', 'div');
                break;
            case 'add-text':
                this.addElement('text', 'p', 'New Text');
                break;
            case 'add-image':
                this.addElement('image', 'img', '');
                break;
            case 'add-button':
                this.addElement('button', 'button', 'Button');
                break;
            case 'add-icon':
                this.addElement('icon', 'span', '⭐');
                break;
            case 'add-link':
                this.addElement('link', 'a', 'Link');
                break;
            case 'duplicate':
                if (this.selectedElement) {
                    const clone = { ...this.selectedElement, id: 'elem-' + Date.now() };
                    this.elements.push(clone);
                    this.renderCanvas();
                    this.renderTree();
                }
                break;
            case 'delete':
                if (this.selectedElement) {
                    this.elements = this.elements.filter(e => e.id !== this.selectedElement.id);
                    this.selectedElement = null;
                    this.renderCanvas();
                    this.renderTree();
                    this.renderProperties();
                }
                break;
            case 'save':
                this.saveProject();
                break;
            case 'load':
                this.loadProject();
                break;
        }
    }

    addElement(type, tag, content = '') {
        const elem = {
            id: 'elem-' + Date.now(),
            type: type,
            tag: tag,
            content: content,
            styles: {
                position: 'absolute',
                left: '10px',
                top: '10px',
                width: '100px',
                height: '40px',
                padding: '5px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                cursor: 'pointer'
            }
        };
        this.elements.push(elem);
        this.selectedElement = elem;
        this.renderCanvas();
        this.renderTree();
        this.renderProperties();
    }

    renderCanvas() {
        const canvas = document.getElementById('canvas-workspace');
        if (!canvas) return;
        
        canvas.innerHTML = '';
        canvas.style.position = 'relative';
        canvas.style.minHeight = '500px';
        canvas.style.background = 'white';
        
        this.elements.forEach(elem => {
            const el = document.createElement(elem.tag);
            el.id = elem.id;
            el.textContent = elem.content;
            el.style.cssText = Object.entries(elem.styles)
                .map(([k, v]) => `${k}: ${v}`)
                .join('; ');
            
            el.addEventListener('click', () => {
                this.selectElement(elem);
            });
            
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('elementId', elem.id);
            });
            
            canvas.appendChild(el);
            this.elementDomMap.set(elem.id, el);
        });
    }

    selectElement(elem) {
        this.selectedElement = elem;
        
        // Visual feedback
        this.elementDomMap.forEach(el => {
            el.style.outline = '';
        });
        
        if (this.elementDomMap.has(elem.id)) {
            this.elementDomMap.get(elem.id).style.outline = '2px solid #007bff';
        }
        
        this.renderProperties();
    }

    renderTree() {
        const treePanel = document.getElementById('tree-panel');
        if (!treePanel) return;
        
        treePanel.innerHTML = '<div style="font-weight: bold; margin-bottom: 8px;">Elements (' + this.elements.length + ')</div>';
        
        const list = document.createElement('div');
        this.elements.forEach(elem => {
            const item = document.createElement('div');
            item.style.cssText = 'padding: 4px 8px; margin: 2px 0; background: ' + 
                (this.selectedElement?.id === elem.id ? '#007bff' : '#f5f5f5') +
                '; color: ' + (this.selectedElement?.id === elem.id ? 'white' : 'black') +
                '; cursor: pointer; border-radius: 2px; font-size: 12px;';
            item.textContent = elem.type + ' - ' + (elem.content || elem.id.substring(0, 8));
            item.addEventListener('click', () => this.selectElement(elem));
            list.appendChild(item);
        });
        treePanel.appendChild(list);
    }

    renderProperties() {
        const propsPanel = document.getElementById('properties-panel');
        if (!propsPanel) return;
        
        propsPanel.innerHTML = '';
        
        if (!this.selectedElement) {
            propsPanel.innerHTML = '<div style="color: #999; font-size: 12px;">Select an element to edit</div>';
            return;
        }
        
        const elem = this.selectedElement;
        
        // Element info
        const info = document.createElement('div');
        info.style.cssText = 'margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #ccc;';
        info.innerHTML = `<strong style="font-size: 13px;">${elem.type}</strong><br><small style="color: #666;">${elem.id}</small>`;
        propsPanel.appendChild(info);
        
        // Content
        if (['text', 'button', 'link'].includes(elem.type)) {
            const contentDiv = document.createElement('div');
            contentDiv.style.marginBottom = '8px';
            contentDiv.innerHTML = `
                <label style="display: block; font-size: 11px; font-weight: bold; margin-bottom: 3px;">Content:</label>
                <input type="text" value="${elem.content}" style="width: 100%; padding: 4px; font-size: 11px; box-sizing: border-box;">
            `;
            const input = contentDiv.querySelector('input');
            input.addEventListener('change', () => {
                elem.content = input.value;
                this.renderCanvas();
            });
            propsPanel.appendChild(contentDiv);
        }
        
        // Style properties
        ['left', 'top', 'width', 'height', 'padding', 'backgroundColor', 'color', 'fontSize'].forEach(prop => {
            const div = document.createElement('div');
            div.style.marginBottom = '8px';
            
            let label = prop.replace(/([A-Z])/g, ' $1').trim();
            label = label.charAt(0).toUpperCase() + label.slice(1);
            
            let value = elem.styles[prop] || '';
            
            div.innerHTML = `
                <label style="display: block; font-size: 11px; font-weight: bold; margin-bottom: 3px;">${label}:</label>
                <input type="text" value="${value}" style="width: 100%; padding: 4px; font-size: 11px; box-sizing: border-box;">
            `;
            
            const input = div.querySelector('input');
            input.addEventListener('change', () => {
                elem.styles[prop] = input.value;
                this.renderCanvas();
            });
            
            propsPanel.appendChild(div);
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            if (this.layout) {
                this.layout.updateSize();
            }
        });
    }

    setupMenuHandlers() {
        // File menu - New Project
        const newProjectBtn = document.getElementById('new-project');
        if (newProjectBtn) {
            newProjectBtn.onclick = (e) => {
                e.stopPropagation();
                this.showTemplateModal();
                document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
            };
        }
        
        // File menu - Save
        const saveBtn = document.getElementById('save-option');
        if (saveBtn) {
            saveBtn.onclick = (e) => {
                e.stopPropagation();
                this.saveProject();
                document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
            };
        }
        
        // File menu - Open
        const openBtn = document.getElementById('open-option');
        if (openBtn) {
            openBtn.onclick = (e) => {
                e.stopPropagation();
                this.loadProject();
                document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
            };
        }
        
        // File menu - Export
        const exportBtn = document.getElementById('export-option');
        if (exportBtn) {
            exportBtn.onclick = (e) => {
                e.stopPropagation();
                this.exportProject();
                document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
            };
        }
    }

    saveProject() {
        const data = JSON.stringify({
            elements: this.elements,
            selectedId: this.selectedElement?.id
        });
        localStorage.setItem('builder-project', data);
        alert('Project saved!');
    }

    loadProject() {
        const data = localStorage.getItem('builder-project');
        if (data) {
            const saved = JSON.parse(data);
            this.elements = saved.elements;
            if (saved.selectedId) {
                this.selectedElement = this.elements.find(e => e.id === saved.selectedId) || null;
            }
            this.renderCanvas();
            this.renderTree();
            this.renderProperties();
            alert('Project loaded!');
        } else {
            alert('No saved project found!');
        }
    }

    exportProject() {
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Builder Export</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; }
    </style>
</head>
<body>
`;
        
        this.elements.forEach(elem => {
            const styles = Object.entries(elem.styles)
                .map(([k, v]) => `${k}: ${v}`)
                .join('; ');
            html += `    <${elem.tag} style="${styles}">${elem.content}</${elem.tag}>\n`;
        });
        
        html += `</body>
</html>`;
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exported.html';
        a.click();
        URL.revokeObjectURL(url);
    }
}
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new BuilderGoldenApp();
    app.init();
});
