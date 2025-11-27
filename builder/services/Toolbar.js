/**
 * Toolbar Service - Element creation toolbar
 */
class Toolbar {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.project = null;
        this.treeService = null;
        this.canvasRenderer = null;
    }

    init(project, treeService, canvasRenderer) {
        this.project = project;
        this.treeService = treeService;
        this.canvasRenderer = canvasRenderer;
        this.render();
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = '';
        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';

        // Element buttons
        const elementButtons = [
            { label: 'Container', icon: '📦', type: 'container', tagName: 'div' },
            { label: 'Text', icon: '📝', type: 'text', tagName: 'p' },
            { label: 'Image', icon: '🖼️', type: 'image', tagName: 'div' },
            { label: 'Button', icon: '🔘', type: 'button', tagName: 'button' },
            { label: 'Icon', icon: '⭐', type: 'icon', tagName: 'span' },
            { label: 'Link', icon: '🔗', type: 'link', tagName: 'a' }
        ];

        elementButtons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'toolbar-btn';
            button.title = btn.label;
            button.innerHTML = `<span>${btn.icon}</span><span class="label">${btn.label}</span>`;
            button.onclick = () => this.addElement(btn);
            toolbar.appendChild(button);
        });

        // Separator
        const separator = document.createElement('div');
        separator.className = 'toolbar-separator';
        toolbar.appendChild(separator);

        // Edit buttons
        const editButtons = [
            { label: 'Duplicate', icon: '📋', action: 'duplicate' },
            { label: 'Delete', icon: '🗑️', action: 'delete' }
        ];

        editButtons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'toolbar-btn';
            button.title = btn.label;
            button.innerHTML = `<span>${btn.icon}</span><span class="label">${btn.label}</span>`;
            button.onclick = () => this.performAction(btn.action);
            toolbar.appendChild(button);
        });

        // Separator
        const separator2 = document.createElement('div');
        separator2.className = 'toolbar-separator';
        toolbar.appendChild(separator2);

        // Save/Load
        const saveButton = document.createElement('button');
        saveButton.className = 'toolbar-btn';
        saveButton.innerHTML = '<span>💾</span><span class="label">Save</span>';
        saveButton.onclick = () => this.saveProject();
        toolbar.appendChild(saveButton);

        const loadButton = document.createElement('button');
        loadButton.className = 'toolbar-btn';
        loadButton.innerHTML = '<span>📂</span><span class="label">Load</span>';
        loadButton.onclick = () => this.loadProject();
        toolbar.appendChild(loadButton);

        this.container.appendChild(toolbar);
    }

    addElement(config) {
        const selectedIds = this.canvasRenderer.selectedElements;
        let parentId = this.project.rootElement.id;

        // Add to first selected element if it exists and is a container
        if (selectedIds.size > 0) {
            const firstSelectedId = Array.from(selectedIds)[0];
            const firstSelected = this.project.findElementById(firstSelectedId);
            if (firstSelected && (firstSelected.type === 'container' || firstSelected.type === 'root')) {
                parentId = firstSelectedId;
            }
        }

        const newElement = this.project.addElement(parentId, {
            type: config.type,
            tagName: config.tagName,
            width: '120px',
            height: '60px',
            backgroundColor: '#e0e0e0'
        });

        this.treeService.render();
        this.canvasRenderer.render();
        this.canvasRenderer.selectElement(newElement.id);
    }

    performAction(action) {
        if (action === 'delete') {
            this.treeService.deleteSelected();
            this.canvasRenderer.render();
            this.canvasRenderer.clearSelection();
        } else if (action === 'duplicate') {
            this.treeService.duplicateSelected();
            this.canvasRenderer.render();
        }
    }

    saveProject() {
        const projectJson = JSON.stringify(this.project.toJSON(), null, 2);
        const blob = new Blob([projectJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.project.name}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    loadProject() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const projectJson = JSON.parse(event.target.result);
                    const loadedProject = Project.fromJSON(projectJson);
                    
                    document.dispatchEvent(new CustomEvent('projectLoaded', {
                        detail: { project: loadedProject }
                    }));
                } catch (error) {
                    alert('Error loading project: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
}
