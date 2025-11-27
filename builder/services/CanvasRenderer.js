/**
 * Canvas Renderer - Renders elements to the visual canvas
 */
class CanvasRenderer {
    constructor(canvasSelector) {
        this.canvas = document.querySelector(canvasSelector);
        this.project = null;
        this.selectedElements = new Set();
        this.elementDomMap = new Map(); // Map of Element ID to DOM node
    }

    init(project) {
        this.project = project;
        this.render();
    }

    render() {
        if (!this.canvas || !this.project) return;

        this.canvas.innerHTML = '';
        this.elementDomMap.clear();
        
        const canvasElement = this.renderElement(this.project.rootElement);
        this.canvas.appendChild(canvasElement);
    }

    renderElement(element) {
        const domNode = document.createElement(element.tagName);
        domNode.className = `builder-element builder-${element.type}`;
        domNode.dataset.elementId = element.id;
        domNode.dataset.elementType = element.type;
        
        // Store mapping
        this.elementDomMap.set(element.id, domNode);

        // Apply styles
        Object.entries(element.styles).forEach(([key, value]) => {
            const cssKey = this.camelToKebab(key);
            domNode.style[key] = value;
        });

        // Set visibility
        if (!element.isVisible) {
            domNode.style.opacity = '0.5';
            domNode.style.pointerEvents = 'none';
        }

        // Add selection handles if selected
        if (element.isSelected) {
            domNode.classList.add('selected');
            this.addSelectionHandles(domNode);
        }

        // Add content
        if (element.type === 'text' && element.text) {
            domNode.textContent = element.text;
        } else if (element.type === 'image' && element.properties.src) {
            const img = document.createElement('img');
            img.src = element.properties.src;
            img.alt = element.properties.alt || '';
            img.style.width = '100%';
            img.style.height = '100%';
            domNode.appendChild(img);
        } else if (element.type === 'button') {
            domNode.textContent = element.text || 'Button';
            domNode.style.cursor = 'pointer';
        } else if (element.type === 'icon' && element.properties.iconName) {
            domNode.innerHTML = `<i class="icon-${element.properties.iconName}"></i>`;
        } else if (element.html) {
            domNode.innerHTML = element.html;
        }

        // Render children
        element.children.forEach(child => {
            const childDom = this.renderElement(child);
            domNode.appendChild(childDom);
        });

        // Add click handler
        domNode.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(element.id, e.ctrlKey || e.metaKey);
        });

        // Add drag/resize handlers
        if (element.type !== 'root') {
            this.enableDragResize(domNode, element);
        }

        return domNode;
    }

    selectElement(elementId, multiSelect = false) {
        if (!multiSelect) {
            this.clearSelection();
        }
        this.selectedElements.add(elementId);
        this.updateSelection();

        document.dispatchEvent(new CustomEvent('elementSelected', {
            detail: { selectedIds: Array.from(this.selectedElements) }
        }));
    }

    clearSelection() {
        this.selectedElements.forEach(id => {
            const element = this.project.findElementById(id);
            if (element) element.isSelected = false;
            const dom = this.elementDomMap.get(id);
            if (dom) {
                dom.classList.remove('selected');
                this.removeSelectionHandles(dom);
            }
        });
        this.selectedElements.clear();
    }

    updateSelection() {
        this.selectedElements.forEach(id => {
            const element = this.project.findElementById(id);
            if (element) element.isSelected = true;
            const dom = this.elementDomMap.get(id);
            if (dom) {
                dom.classList.add('selected');
                this.addSelectionHandles(dom);
            }
        });
    }

    addSelectionHandles(domNode) {
        const handles = ['tl', 'tr', 'bl', 'br', 'tm', 'bm', 'lm', 'rm'];
        handles.forEach(handle => {
            if (!domNode.querySelector(`.resize-handle-${handle}`)) {
                const handleEl = document.createElement('div');
                handleEl.className = `resize-handle resize-handle-${handle}`;
                domNode.appendChild(handleEl);
            }
        });
    }

    removeSelectionHandles(domNode) {
        domNode.querySelectorAll('[class*="resize-handle"]').forEach(h => h.remove());
    }

    enableDragResize(domNode, element) {
        let isDragging = false;
        let isResizing = false;
        let startX, startY, startLeft, startTop, startWidth, startHeight;

        domNode.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle')) {
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = domNode.offsetWidth;
                startHeight = domNode.offsetHeight;
            } else if (!domNode.querySelector('.resize-handle-' + e.target.className)) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = domNode.offsetLeft;
                startTop = domNode.offsetTop;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && this.selectedElements.has(element.id)) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                domNode.style.left = (startLeft + deltaX) + 'px';
                domNode.style.top = (startTop + deltaY) + 'px';
                element.styles.left = domNode.style.left;
                element.styles.top = domNode.style.top;
            } else if (isResizing && this.selectedElements.has(element.id)) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                domNode.style.width = Math.max(20, startWidth + deltaX) + 'px';
                domNode.style.height = Math.max(20, startHeight + deltaY) + 'px';
                element.styles.width = domNode.style.width;
                element.styles.height = domNode.style.height;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            isResizing = false;
        });
    }

    camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    getSelectedElements() {
        return Array.from(this.selectedElements)
            .map(id => this.project.findElementById(id))
            .filter(e => e);
    }
}
