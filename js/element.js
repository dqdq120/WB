/**
 * Element Class - Manages draggable DOM elements in the web builder
 * Handles CSS properties, attributes, and element lifecycle
 */
class Element {
    constructor(type = 'div', properties = {}, attributes = {}) {
        this.id = 'elem-' + Math.random().toString(36).substr(2, 9);
        this.type = type;
        this.properties = {
            width: properties.width || '100px',
            height: properties.height || '50px',
            backgroundColor: properties.backgroundColor || '#ffffff',
            color: properties.color || '#000000',
            padding: properties.padding || '10px',
            margin: properties.margin || '5px',
            border: properties.border || '1px solid #cccccc',
            borderRadius: properties.borderRadius || '0px',
            fontSize: properties.fontSize || '14px',
            fontWeight: properties.fontWeight || 'normal',
            textAlign: properties.textAlign || 'left',
            opacity: properties.opacity || '1',
            zIndex: properties.zIndex || '1',
            position: properties.position || 'relative',
            display: properties.display || 'block',
            ...properties
        };

        this.attributes = {
            id: attributes.id || this.id,
            class: attributes.class || '',
            title: attributes.title || '',
            textContent: attributes.textContent || this.getDefaultText(),
            ...attributes
        };

        this.domElement = null;
        this.isSelected = false;
        this.listeners = [];
        this.parent = null;
        this.children = [];
        this._resizeHandles = [];
        this._isResizing = false;
        this._resizeDir = null;
        this._isRightDragging = false;
        this._dragStart = null;
        this.createDOMElement();
    }

    /**
     * Whether this element type can contain children
     */
    canHaveChildren() {
        const disallowed = ['input', 'img', 'br', 'hr', 'meta', 'link'];
        return !disallowed.includes(this.type);
    }

    /**
     * Add a child Element instance
     */
    addChild(child) {
        if (!child) return;
        child.parent = this;
        this.children.push(child);
        if (this.domElement && child.domElement) {
            // Ensure parent is a positioning context for absolutely positioned children
            const cs = window.getComputedStyle(this.domElement);
            if (!cs.position || cs.position === 'static') {
                this.domElement.style.position = 'relative';
            }
            this.domElement.appendChild(child.domElement);
        }
    }

    removeChild(child) {
        const idx = this.children.indexOf(child);
        if (idx > -1) {
            this.children.splice(idx, 1);
            child.parent = null;
        }
    }

    /**
     * Get default text content for different element types
     */
    getDefaultText() {
        const defaults = {
            'div': 'Div',
            'p': 'Paragraph text',
            'h1': 'Heading 1',
            'h2': 'Heading 2',
            'h3': 'Heading 3',
            'button': 'Button',
            'input': '',
            'label': 'Label',
            'span': 'Span',
            'img': '',
            'a': 'Link',
            'ul': 'List',
            'li': 'List item'
        };
        return defaults[this.type] || 'Element';
    }

    /**
     * Create the actual DOM element
     */
    createDOMElement() {
        this.domElement = document.createElement(this.type);
        this.domElement.id = this.attributes.id;
        
        if (this.attributes.class) {
            this.domElement.className = this.attributes.class;
        }

        if (this.attributes.title) {
            this.domElement.title = this.attributes.title;
        }

        // Set text content for elements that support it
        if (this.type !== 'input' && this.type !== 'img' && this.attributes.textContent) {
            this.domElement.textContent = this.attributes.textContent;
        }

        // Apply CSS properties
        this.applyStyles();

        // Add selection event: dispatch a global event so manager can handle single/multi-select
        this.domElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const ev = new CustomEvent('elementClicked', { detail: { element: this, originalEvent: e } });
            window.dispatchEvent(ev);
        });

        // Make element draggable within the canvas
        this.domElement.style.cursor = 'move';

        // Disable default context menu for this element
        this.domElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });

        // Listen for right mouse button down
        this.domElement.addEventListener("mousedown", (e) => {
            if (e.button === 2) {       // 2 = right mouse button
                e.stopPropagation();    // Prevent bubbling to parent
                e.preventDefault();     // Prevent selection and unwanted actions

                this.startRightDrag(e); // Start dragging logic
            }
        });


        // show custom context menu prevention during right-drag
        this._contextMenuHandler = (ev) => {
            if (this._isRightDragging) ev.preventDefault();
        };
        document.addEventListener('contextmenu', this._contextMenuHandler);

        // create resize handles but keep them hidden until selected
        this.createResizeHandles();

        // Store reference to this Element instance on the DOM element
        this.domElement.__elementInstance = this;

        return this.domElement;
    }

    /**
     * Ensure element uses absolute positioning so left/top are effective
     */
    ensureAbsolutePosition() {
        const dom = this.domElement;
        if (!dom) return;
        const curPos = window.getComputedStyle(dom).position;
        if (curPos !== 'absolute') {
            const parent = dom.parentElement || document.body;
            const parentRect = parent.getBoundingClientRect();
            const rect = dom.getBoundingClientRect();
            dom.style.position = 'absolute';
            dom.style.left = (rect.left - parentRect.left + parent.scrollLeft) + 'px';
            dom.style.top = (rect.top - parentRect.top + parent.scrollTop) + 'px';
            dom.style.width = rect.width + 'px';
            dom.style.height = rect.height + 'px';
        }
    }

    startRightDrag(e) {
        if (!this.domElement) return;
        this.ensureAbsolutePosition();
        this._isRightDragging = true;
        const rect = this.domElement.getBoundingClientRect();
        this._dragStart = { mx: e.clientX, my: e.clientY, lx: parseFloat(this.domElement.style.left) || rect.left, ty: parseFloat(this.domElement.style.top) || rect.top };

        this._onRightMove = (ev) => {
            ev.preventDefault();
            const dx = ev.clientX - this._dragStart.mx;
            const dy = ev.clientY - this._dragStart.my;

            const parent = this.domElement.parentElement || document.body;
            const parentRect = parent.getBoundingClientRect();
            const elRect = this.domElement.getBoundingClientRect();

            let newLeft = this._dragStart.lx + dx;
            let newTop = this._dragStart.ty + dy;

            // constrain within parent
            const minLeft = 0;
            const minTop = 0;
            const maxLeft = parentRect.width - elRect.width;
            const maxTop = parentRect.height - elRect.height;
            newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
            newTop = Math.max(minTop, Math.min(newTop, maxTop));

            this.domElement.style.left = newLeft + 'px';
            this.domElement.style.top = newTop + 'px';
            // update properties map
            this.properties.left = this.domElement.style.left;
            this.properties.top = this.domElement.style.top;
            this.emitChange('propertyChanged', { property: 'left', value: this.properties.left });
            this.emitChange('propertyChanged', { property: 'top', value: this.properties.top });
        };

        this._onRightUp = (ev) => {
            this._isRightDragging = false;
            document.removeEventListener('mousemove', this._onRightMove);
            document.removeEventListener('mouseup', this._onRightUp);
        };

        document.addEventListener('mousemove', this._onRightMove);
        document.addEventListener('mouseup', this._onRightUp);
    }

    createResizeHandles() {
        if (!this.domElement) return;
        const positions = ['nw','n','ne','e','se','s','sw','w'];
        positions.forEach(pos => {
            const h = document.createElement('div');
            h.className = 'resize-handle resize-' + pos;
            h.dataset.dir = pos;
            h.style.position = 'absolute';
            h.style.display = 'none';
            this.domElement.appendChild(h);
            this._resizeHandles.push(h);

            h.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.startResize(e, pos);
            });
        });
    }

    showResizeHandles() {
        this._resizeHandles.forEach(h => h.style.display = 'block');
    }

    hideResizeHandles() {
        this._resizeHandles.forEach(h => h.style.display = 'none');
    }

    startResize(e, dir) {
        if (!this.domElement) return;
        this.ensureAbsolutePosition();
        this._isResizing = true;
        this._resizeDir = dir;

        const rect = this.domElement.getBoundingClientRect();
        const parent = this.domElement.parentElement || document.body;
        const parentRect = parent.getBoundingClientRect();

        this._resizeStart = { mx: e.clientX, my: e.clientY, left: rect.left - parentRect.left + parent.scrollLeft, top: rect.top - parentRect.top + parent.scrollTop, width: rect.width, height: rect.height };

        this._onResizeMove = (ev) => {
            ev.preventDefault();
            const dx = ev.clientX - this._resizeStart.mx;
            const dy = ev.clientY - this._resizeStart.my;
            let { left, top, width, height } = this._resizeStart;

            // adjust based on dir
            if (dir.includes('e')) width = Math.max(10, width + dx);
            if (dir.includes('s')) height = Math.max(10, height + dy);
            if (dir.includes('w')) {
                width = Math.max(10, width - dx);
                left = left + dx;
            }
            if (dir.includes('n')) {
                height = Math.max(10, height - dy);
                top = top + dy;
            }

            // constrain within parent bounds
            const maxWidth = parentRect.width - left;
            const maxHeight = parentRect.height - top;
            width = Math.min(width, maxWidth);
            height = Math.min(height, maxHeight);

            this.domElement.style.left = left + 'px';
            this.domElement.style.top = top + 'px';
            this.domElement.style.width = width + 'px';
            this.domElement.style.height = height + 'px';

            // update properties
            this.properties.width = this.domElement.style.width;
            this.properties.height = this.domElement.style.height;
            this.properties.left = this.domElement.style.left;
            this.properties.top = this.domElement.style.top;
            this.emitChange('propertyChanged', { property: 'width', value: this.properties.width });
            this.emitChange('propertyChanged', { property: 'height', value: this.properties.height });
        };

        this._onResizeUp = (ev) => {
            this._isResizing = false;
            document.removeEventListener('mousemove', this._onResizeMove);
            document.removeEventListener('mouseup', this._onResizeUp);
        };

        document.addEventListener('mousemove', this._onResizeMove);
        document.addEventListener('mouseup', this._onResizeUp);
    }

    /**
     * Apply all CSS properties to the DOM element
     */
    applyStyles() {
        if (!this.domElement) return;

        Object.keys(this.properties).forEach(key => {
            const cssKey = this.toCssProperty(key);
            const value = this.properties[key];
            this.domElement.style[cssKey] = value;
        });
    }

    /**
     * Convert camelCase property names to CSS format
     */
    toCssProperty(camelCase) {
        return camelCase.replace(/([A-Z])/g, (match) => '-' + match.toLowerCase()).toLowerCase();
    }

    /**
     * Convert CSS property names to camelCase
     */
    toCamelCase(cssProperty) {
        return cssProperty.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

    /**
     * Set a CSS property
     */
    setProperty(propertyName, value) {
        this.properties[propertyName] = value;
        if (this.domElement) {
            const cssKey = this.toCssProperty(propertyName);
            this.domElement.style[cssKey] = value;
        }
        this.emitChange('propertyChanged', { property: propertyName, value });
    }

    /**
     * Get a CSS property value
     */
    getProperty(propertyName) {
        return this.properties[propertyName];
    }

    /**
     * Set an attribute
     */
    setAttribute(attributeName, value) {

    }

    /**
     * Get an attribute value
     */
    getAttribute(attributeName) {
        return this.attributes[attributeName];
    }

    /**
     * Get all properties
     */
    getAllProperties() {
        return { ...this.properties };
    }

    /**
     * Get all attributes
     */
    getAllAttributes() {
        return { ...this.attributes };
    }

    /**
     * Select this element
     */
    select() {
        this.isSelected = true;
        if (this.domElement) {
            this.domElement.style.outline = '2px solid #0066cc';
            this.domElement.style.outlineOffset = '2px';
            this.showResizeHandles();
        }
        this.emitChange('selected', { element: this });
    }

    /**
     * Deselect this element
     */
    deselect() {
        this.isSelected = false;
        if (this.domElement) {
            this.domElement.style.outline = 'none';
            this.hideResizeHandles();
        }
        this.emitChange('deselected', { element: this });
    }

    /**
     * Emit change events
     */
    emitChange(eventType, data) {
        this.listeners.forEach(listener => {
            if (listener.type === eventType || listener.type === '*') {
                listener.callback(data);
            }
        });
    }

    /**
     * Listen to element changes
     */
    onChange(eventType, callback) {
        this.listeners.push({ type: eventType, callback });
    }

    /**
     * Remove a change listener
     */
    removeListener(eventType, callback) {
        this.listeners = this.listeners.filter(
            l => !(l.type === eventType && l.callback === callback)
        );
    }

    /**
     * Get DOM element
     */
    getDOMElement() {
        return this.domElement;
    }

    /**
     * Destroy the element
     */
    destroy() {
        this.listeners = [];
        // cleanup any global handlers
        if (this._contextMenuHandler) document.removeEventListener('contextmenu', this._contextMenuHandler);
        if (this._onRightMove) document.removeEventListener('mousemove', this._onRightMove);
        if (this._onRightUp) document.removeEventListener('mouseup', this._onRightUp);
        if (this._onResizeMove) document.removeEventListener('mousemove', this._onResizeMove);
        if (this._onResizeUp) document.removeEventListener('mouseup', this._onResizeUp);
        if (this.domElement && this.domElement.parentNode) {
            this.domElement.parentNode.removeChild(this.domElement);
        }
        this.domElement = null;
    }

    /**
     * Get HTML representation of the element
     */
    toHTML() {
        if (this.domElement) {
            return this.domElement.outerHTML;
        }
        return '';
    }

    /**
     * Clone this element
     */
    clone() {
        return new Element(this.type, { ...this.properties }, { ...this.attributes });
    }
}

/**
 * ElementManager - Manages all elements in the canvas
 */
class ElementManager {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.elements = [];
        this.selectedElements = [];
        this.setupCanvas();
    }

    /**
     * Setup the canvas for drag and drop
     */
    setupCanvas() {
        this.canvas.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.canvas.addEventListener('drop', (e) => this.handleDrop(e));
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas) {
                this.deselectAll();
            }
        });
        // Listen for element clicks (supports Ctrl/Cmd multi-select)
        window.addEventListener('elementClicked', (e) => {
            const { element, originalEvent } = e.detail || {};
            if (!element) return;
            const additive = originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey);
            this.selectElement(element, additive);
        });
    }

    /**
     * Create and add a new element to the canvas
     */
    createElement(type, properties = {}, attributes = {}, position = null, parent = null) {
        const element = new Element(type, properties, attributes);
        const domElement = element.getDOMElement();

        // Set position if provided
        if (position) {
            domElement.style.position = 'absolute';
            domElement.style.left = position.x + 'px';
            domElement.style.top = position.y + 'px';
        }

        if (parent && parent.canHaveChildren && parent.canHaveChildren()) {
            parent.addChild(element);
        } else {
            this.canvas.appendChild(domElement);
        }

        this.elements.push(element);

        return element;
    }

    /**
     * Select an element
     */
    selectElement(element, additive = false) {
        if (additive) {
            const idx = this.selectedElements.indexOf(element);
            if (idx > -1) {
                // toggle off
                element.deselect();
                this.selectedElements.splice(idx, 1);
            } else {
                element.select();
                this.selectedElements.push(element);
            }
        } else {
            // single selection
            this.deselectAll();
            element.select();
            this.selectedElements = [element];
        }

        this.notifySelectionChange(this.selectedElements);
    }

    /**
     * Deselect all elements
     */
    deselectAll() {
        this.selectedElements.forEach(elem => elem.deselect());
        this.selectedElements = [];
        this.notifySelectionChange(this.selectedElements);
    }

    /**
     * Get selected element
     */
    getSelectedElement() {
        return this.selectedElements.length ? this.selectedElements[0] : null;
    }

    getSelectedElements() {
        return [...this.selectedElements];
    }

    /**
     * Get all elements
     */
    getAllElements() {
        return [...this.elements];
    }

    /**
     * Remove an element
     */
    removeElement(element) {
        const index = this.elements.indexOf(element);
        if (index > -1) {
            element.destroy();
            this.elements.splice(index, 1);
            const selIdx = this.selectedElements.indexOf(element);
            if (selIdx > -1) this.selectedElements.splice(selIdx, 1);
            // remove from parent if necessary
            if (element.parent && element.parent.removeChild) {
                element.parent.removeChild(element);
            }
        }
    }

    /**
     * Notify when selection changes
     */
    notifySelectionChange(elements) {
        const event = new CustomEvent('selectionChanged', { detail: { elements } });
        window.dispatchEvent(event);
    }

    /**
     * Handle drag over the canvas
     */
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.canvas.style.backgroundColor = 'rgba(0, 102, 204, 0.1)';
    }

    /**
     * Handle drop on the canvas
     */
    handleDrop(e) {
        e.preventDefault();
        this.canvas.style.backgroundColor = '';

        const elementType = e.dataTransfer.getData('text/plain');
        let parentInstance = null;
        
        // Only assign parent if it's selected
        if (this.selectedElements.length === 1) {
            const sel = this.selectedElements[0];
            if (sel.canHaveChildren && sel.canHaveChildren()) {
                parentInstance = sel;
            }
        }

        if (parentInstance) {
            const rectParent = parentInstance.domElement.getBoundingClientRect();
            const x = e.clientX - rectParent.left;
            const y = e.clientY - rectParent.top;
            const newElement = this.createElement(elementType, {}, {}, { x, y }, parentInstance);
            this.selectElement(newElement, false);
        } else {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const newElement = this.createElement(elementType, {}, {}, { x, y });
            this.selectElement(newElement, false);
        }
    }

    /**
     * Delete selected element
     */
    deleteSelected() {
        if (this.selectedElements && this.selectedElements.length) {
            // remove all selected
            const toRemove = [...this.selectedElements];
            toRemove.forEach(el => this.removeElement(el));
            this.deselectAll();
        }
    }

    /**
     * Export all elements as HTML
     */
    exportHTML() {
        return this.elements.map(elem => elem.toHTML()).join('\n');
    }

    /**
     * Return top-level elements (no parent)
     */
    getRootElements() {
        return this.elements.filter(el => !el.parent);
    }

    /**
     * Reparent an element to a new parent (or canvas if parent is null)
     */
    reparentElement(element, newParent) {
        if (!element) return;
        // remove from current parent
        if (element.parent) {
            element.parent.removeChild(element);
        } else {
            // remove from canvas DOM
            if (element.domElement && element.domElement.parentElement === this.canvas) {
                this.canvas.removeChild(element.domElement);
            }
        }

        if (newParent && newParent.canHaveChildren && newParent.canHaveChildren()) {
            newParent.addChild(element);
        } else {
            // move back to canvas
            element.parent = null;
            this.canvas.appendChild(element.domElement);
        }
    }

    // Helpers to compute common properties/attributes across multiple elements
    getCommonProperties(elements) {
        if (!elements || elements.length === 0) return {};
        const first = elements[0].getAllProperties();
        const common = {};
        Object.keys(first).forEach(key => {
            const val = first[key];
            const allSame = elements.every(el => el.getAllProperties()[key] === val);
            if (allSame) common[key] = val;
        });
        return common;
    }

    getCommonAttributes(elements) {
        if (!elements || elements.length === 0) return {};
        const first = elements[0].getAllAttributes();
        const common = {};
        Object.keys(first).forEach(key => {
            const val = first[key];
            const allSame = elements.every(el => el.getAllAttributes()[key] === val);
            if (allSame) common[key] = val;
        });
        return common;
    }
}
