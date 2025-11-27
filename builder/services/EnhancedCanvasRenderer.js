/**
 * Enhanced Canvas Renderer with improved drag/resize and multi-select
 */
class EnhancedCanvasRenderer {
    constructor(canvasSelector) {
        this.canvas = document.querySelector(canvasSelector);
        this.project = null;
        this.selectedElements = new Set();
        this.elementDomMap = new Map();
        this.isDragging = false;
        this.isResizing = false;
        this.dragStart = { x: 0, y: 0 };
        this.currentDragElement = null;
        this.currentResizeHandle = null;
    }

    init(project) {
        this.project = project;
        this.render();
        this.setupCanvasListeners();
    }

    setupCanvasListeners() {
        // Marquee selection
        let isMarqueeSelecting = false;
        let marqueeStart = { x: 0, y: 0 };
        const marqueeBox = document.createElement('div');
        marqueeBox.id = 'marquee-box';

        this.canvas.addEventListener('mousedown', (e) => {
            if (e.target === this.canvas) {
                isMarqueeSelecting = true;
                marqueeStart = { x: e.clientX, y: e.clientY };
                marqueeBox.style.display = 'block';
                marqueeBox.style.position = 'absolute';
                marqueeBox.style.border = '2px dashed #007bff';
                marqueeBox.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
                marqueeBox.style.pointerEvents = 'none';
                this.canvas.appendChild(marqueeBox);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isMarqueeSelecting) {
                const currentX = e.clientX;
                const currentY = e.clientY;
                const left = Math.min(marqueeStart.x, currentX);
                const top = Math.min(marqueeStart.y, currentY);
                const width = Math.abs(currentX - marqueeStart.x);
                const height = Math.abs(currentY - marqueeStart.y);

                marqueeBox.style.left = left + 'px';
                marqueeBox.style.top = top + 'px';
                marqueeBox.style.width = width + 'px';
                marqueeBox.style.height = height + 'px';
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (isMarqueeSelecting) {
                isMarqueeSelecting = false;
                marqueeBox.style.display = 'none';
                marqueeBox.remove();

                // Select elements within marquee
                const marqueeRect = marqueeBox.getBoundingClientRect();
                this.canvas.querySelectorAll('.builder-element').forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (this.rectsIntersect(marqueeRect, rect)) {
                        const elementId = el.dataset.elementId;
                        this.selectedElements.add(elementId);
                    }
                });

                this.updateSelection();
            }
        });

        // Clear selection on canvas click
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas) {
                this.clearSelection();
            }
        });
    }

    rectsIntersect(rect1, rect2) {
        return !(rect2.right < rect1.left ||
                 rect2.left > rect1.right ||
                 rect2.bottom < rect1.top ||
                 rect2.top > rect1.bottom);
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

        this.elementDomMap.set(element.id, domNode);

        // Apply styles
        Object.entries(element.styles).forEach(([key, value]) => {
            domNode.style[key] = value;
        });

        if (!element.isVisible) {
            domNode.style.opacity = '0.5';
            domNode.style.pointerEvents = 'none';
        }

        if (element.isSelected) {
            domNode.classList.add('selected');
            this.addSelectionHandles(domNode);
        }

        // Content
        if (element.type === 'text' && element.text) {
            domNode.textContent = element.text;
        } else if (element.type === 'image' && element.properties.src) {
            const img = document.createElement('img');
            img.src = element.properties.src;
            img.alt = element.properties.alt || '';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            domNode.appendChild(img);
        } else if (element.type === 'button') {
            domNode.textContent = element.text || 'Button';
        } else if (element.type === 'icon' && element.properties.iconName) {
            domNode.innerHTML = `<i class="icon-${element.properties.iconName}"></i>`;
        } else if (element.html) {
            domNode.innerHTML = element.html;
        }

        // Children
        element.children.forEach(child => {
            const childDom = this.renderElement(child);
            domNode.appendChild(childDom);
        });

        // Event handlers
        domNode.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(element.id, e.ctrlKey || e.metaKey);
        });

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
        let startX, startY, startLeft, startTop, startWidth, startHeight, resizeHandle;

        domNode.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle')) {
                isResizing = true;
                resizeHandle = e.target.className.match(/resize-handle-\w+/)[0].replace('resize-handle-', '');
                startX = e.clientX;
                startY = e.clientY;
                startWidth = domNode.offsetWidth;
                startHeight = domNode.offsetHeight;
                startLeft = domNode.offsetLeft;
                startTop = domNode.offsetTop;
                e.preventDefault();
            } else {
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

                // Update all selected elements
                this.selectedElements.forEach(id => {
                    const sel = this.project.findElementById(id);
                    if (sel) {
                        const selDom = this.elementDomMap.get(id);
                        if (selDom) {
                            selDom.style.left = (parseInt(selDom.style.left || '0') + deltaX) + 'px';
                            selDom.style.top = (parseInt(selDom.style.top || '0') + deltaY) + 'px';
                            sel.styles.left = selDom.style.left;
                            sel.styles.top = selDom.style.top;
                        }
                    }
                });

                startX = e.clientX;
                startY = e.clientY;
            } else if (isResizing && this.selectedElements.has(element.id)) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;

                if (resizeHandle.includes('r')) newWidth = Math.max(20, startWidth + deltaX);
                if (resizeHandle.includes('b')) newHeight = Math.max(20, startHeight + deltaY);
                if (resizeHandle.includes('l')) {
                    newWidth = Math.max(20, startWidth - deltaX);
                    newLeft = startLeft + deltaX;
                }
                if (resizeHandle.includes('t')) {
                    newHeight = Math.max(20, startHeight - deltaY);
                    newTop = startTop + deltaY;
                }

                domNode.style.width = newWidth + 'px';
                domNode.style.height = newHeight + 'px';
                domNode.style.left = newLeft + 'px';
                domNode.style.top = newTop + 'px';

                element.styles.width = newWidth + 'px';
                element.styles.height = newHeight + 'px';
                element.styles.left = newLeft + 'px';
                element.styles.top = newTop + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            isResizing = false;
        });
    }

    getSelectedElements() {
        return Array.from(this.selectedElements)
            .map(id => this.project.findElementById(id))
            .filter(e => e);
    }
}
