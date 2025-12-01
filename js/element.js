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
        this.createDOMElement();
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

        // Add selection event
        this.domElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.select();
        });

        // Make element draggable within the canvas
        this.domElement.style.cursor = 'move';

        // Store reference to this Element instance on the DOM element
        this.domElement.__elementInstance = this;

        return this.domElement;
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
        this.attributes[attributeName] = value;
        if (this.domElement) {
            if (attributeName === 'textContent') {
                this.domElement.textContent = value;
            } else if (attributeName === 'class') {
                this.domElement.className = value;
            } else if (attributeName === 'id') {
                this.domElement.id = value;
            } else {
                this.domElement.setAttribute(attributeName, value);
            }
        }
        this.emitChange('attributeChanged', { attribute: attributeName, value });
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
        this.selectedElement = null;
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
    }

    /**
     * Create and add a new element to the canvas
     */
    createElement(type, properties = {}, attributes = {}, position = null) {
        const element = new Element(type, properties, attributes);
        const domElement = element.getDOMElement();

        // Set position if provided
        if (position) {
            domElement.style.position = 'absolute';
            domElement.style.left = position.x + 'px';
            domElement.style.top = position.y + 'px';
        }

        this.canvas.appendChild(domElement);
        this.elements.push(element);

        // Listen to element changes
        element.onChange('selected', () => this.selectElement(element));

        return element;
    }

    /**
     * Select an element
     */
    selectElement(element) {
        this.deselectAll();
        element.select();
        this.selectedElement = element;
        this.notifySelectionChange(element);
    }

    /**
     * Deselect all elements
     */
    deselectAll() {
        this.elements.forEach(elem => elem.deselect());
        this.selectedElement = null;
        this.notifySelectionChange(null);
    }

    /**
     * Get selected element
     */
    getSelectedElement() {
        return this.selectedElement;
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
            if (this.selectedElement === element) {
                this.selectedElement = null;
            }
        }
    }

    /**
     * Notify when selection changes
     */
    notifySelectionChange(element) {
        const event = new CustomEvent('elementSelected', { detail: { element } });
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
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newElement = this.createElement(elementType, {}, {}, { x, y });
        this.selectElement(newElement);
    }

    /**
     * Delete selected element
     */
    deleteSelected() {
        if (this.selectedElement) {
            this.removeElement(this.selectedElement);
        }
    }

    /**
     * Export all elements as HTML
     */
    exportHTML() {
        return this.elements.map(elem => elem.toHTML()).join('\n');
    }
}
