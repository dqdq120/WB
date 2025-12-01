/**
 * PropertyPanel - Manages the CSS properties editor
 */
class PropertyPanel {
    constructor(containerElement) {
        this.container = containerElement;
        this.currentElement = null;
        this.propertyInputs = {};
        this.render();
    }

    /**
     * Define common CSS properties
     */
    getPropertyDefinitions() {
        return [
            { name: 'width', label: 'Width', type: 'text', placeholder: '100px' },
            { name: 'height', label: 'Height', type: 'text', placeholder: '50px' },
            { name: 'padding', label: 'Padding', type: 'text', placeholder: '10px' },
            { name: 'margin', label: 'Margin', type: 'text', placeholder: '5px' },
            { name: 'backgroundColor', label: 'Background Color', type: 'color' },
            { name: 'color', label: 'Text Color', type: 'color' },
            { name: 'fontSize', label: 'Font Size', type: 'text', placeholder: '14px' },
            { name: 'fontWeight', label: 'Font Weight', type: 'select', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
            { name: 'textAlign', label: 'Text Align', type: 'select', options: ['left', 'center', 'right', 'justify'] },
            { name: 'border', label: 'Border', type: 'text', placeholder: '1px solid #ccc' },
            { name: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '0px' },
            { name: 'opacity', label: 'Opacity', type: 'range', min: 0, max: 1, step: 0.1 },
            { name: 'display', label: 'Display', type: 'select', options: ['block', 'inline', 'inline-block', 'flex', 'grid', 'none'] },
            { name: 'position', label: 'Position', type: 'select', options: ['relative', 'absolute', 'fixed', 'static', 'sticky'] },
            { name: 'zIndex', label: 'Z-Index', type: 'text', placeholder: '1' }
        ];
    }

    /**
     * Render the property panel
     */
    render() {
        this.container.innerHTML = '<div class="property-panel-content"></div>';
        const content = this.container.querySelector('.property-panel-content');

        const properties = this.getPropertyDefinitions();
        const form = document.createElement('form');
        form.className = 'properties-form';

        properties.forEach(prop => {
            const group = document.createElement('div');
            group.className = 'property-group';

            const label = document.createElement('label');
            label.textContent = prop.label;
            label.className = 'property-label';

            let input;

            if (prop.type === 'select') {
                input = document.createElement('select');
                input.className = 'property-input property-select';
                prop.options.forEach(option => {
                    const optElement = document.createElement('option');
                    optElement.value = option;
                    optElement.textContent = option;
                    input.appendChild(optElement);
                });
            } else if (prop.type === 'range') {
                input = document.createElement('input');
                input.type = 'range';
                input.min = prop.min;
                input.max = prop.max;
                input.step = prop.step;
                input.className = 'property-input property-range';
            } else if (prop.type === 'color') {
                input = document.createElement('input');
                input.type = 'color';
                input.className = 'property-input property-color';
            } else {
                input = document.createElement('input');
                input.type = prop.type || 'text';
                input.placeholder = prop.placeholder || '';
                input.className = 'property-input';
            }

            input.setAttribute('data-property', prop.name);
            input.addEventListener('change', (e) => this.onPropertyChange(prop.name, e.target.value));
            input.addEventListener('input', (e) => {
                if (prop.type === 'range') {
                    this.onPropertyChange(prop.name, e.target.value);
                }
            });

            this.propertyInputs[prop.name] = input;

            group.appendChild(label);
            group.appendChild(input);
            form.appendChild(group);
        });

        content.appendChild(form);
    }

    /**
     * Set the current element to edit
     */
    setElement(element) {
        this.currentElement = element;
        this.updateInputValues();
    }

    /**
     * Update input values from element properties
     */
    updateInputValues() {
        if (!this.currentElement) return;

        Object.keys(this.propertyInputs).forEach(propName => {
            const value = this.currentElement.getProperty(propName);
            if (value !== undefined) {
                this.propertyInputs[propName].value = value;
            }
        });
    }

    /**
     * Handle property change
     */
    onPropertyChange(propertyName, value) {
        if (this.currentElement) {
            // Handle special cases
            if (propertyName === 'opacity') {
                // Ensure opacity is a valid number between 0 and 1
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    this.currentElement.setProperty(propertyName, numValue.toString());
                }
            } else {
                this.currentElement.setProperty(propertyName, value);
            }
        }
    }

    /**
     * Clear the panel
     */
    clear() {
        this.currentElement = null;
        this.render();
    }
}

/**
 * ElementPropertiesPanel - Manages element-specific properties
 */
class ElementPropertiesPanel {
    constructor(containerElement) {
        this.container = containerElement;
        this.currentElement = null;
        this.elementPropertyInputs = {};
        this.render();
    }

    /**
     * Define element-specific properties based on element type
     */
    getElementProperties(elementType) {
        const commonProps = [
            { name: 'textContent', label: 'Text Content', type: 'textarea', placeholder: 'Element text' }
        ];

        const typeSpecificProps = {
            'button': [
                { name: 'textContent', label: 'Button Text', type: 'text', placeholder: 'Button text' },
            ],
            'input': [
                { name: 'placeholder', label: 'Placeholder', type: 'text', placeholder: 'Placeholder text' },
                { name: 'inputType', label: 'Input Type', type: 'select', options: ['text', 'number', 'email', 'password', 'date', 'checkbox', 'radio'] },
            ],
            'label': [
                { name: 'textContent', label: 'Label Text', type: 'text', placeholder: 'Label text' },
            ],
            'a': [
                { name: 'textContent', label: 'Link Text', type: 'text', placeholder: 'Link text' },
                { name: 'href', label: 'URL', type: 'text', placeholder: 'https://example.com' },
            ],
            'img': [
                { name: 'src', label: 'Image URL', type: 'text', placeholder: 'https://example.com/image.jpg' },
                { name: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Image description' },
            ],
            'ul': [],
            'li': [
                { name: 'textContent', label: 'List Item Text', type: 'text', placeholder: 'Item text' },
            ],
        };

        return typeSpecificProps[elementType] || commonProps;
    }

    /**
     * Render the element properties panel
     */
    render() {
        this.container.innerHTML = '<div class="element-properties-content"></div>';
        const content = this.container.querySelector('.element-properties-content');

        const form = document.createElement('form');
        form.className = 'element-properties-form';

        const noElementMsg = document.createElement('p');
        noElementMsg.textContent = 'Select an element to edit';
        noElementMsg.className = 'no-element-message';
        form.appendChild(noElementMsg);

        content.appendChild(form);
    }

    /**
     * Regenerate properties based on current element type
     */
    renderForElement() {
        if (!this.currentElement) {
            this.render();
            return;
        }

        this.container.innerHTML = '<div class="element-properties-content"></div>';
        const content = this.container.querySelector('.element-properties-content');

        const properties = this.getElementProperties(this.currentElement.type);
        const form = document.createElement('form');
        form.className = 'element-properties-form';

        if (properties.length === 0) {
            const noProps = document.createElement('p');
            noProps.textContent = 'No specific properties for this element';
            noProps.className = 'no-element-message';
            form.appendChild(noProps);
        } else {
            properties.forEach(prop => {
                const group = document.createElement('div');
                group.className = 'element-property-group';

                const label = document.createElement('label');
                label.textContent = prop.label;
                label.className = 'element-property-label';

                let input;

                if (prop.type === 'select') {
                    input = document.createElement('select');
                    input.className = 'element-property-input element-property-select';
                    prop.options.forEach(option => {
                        const optElement = document.createElement('option');
                        optElement.value = option;
                        optElement.textContent = option;
                        input.appendChild(optElement);
                    });
                } else if (prop.type === 'textarea') {
                    input = document.createElement('textarea');
                    input.placeholder = prop.placeholder || '';
                    input.className = 'element-property-input element-property-textarea';
                    input.rows = 3;
                } else {
                    input = document.createElement('input');
                    input.type = prop.type || 'text';
                    input.placeholder = prop.placeholder || '';
                    input.className = 'element-property-input';
                }

                input.setAttribute('data-property', prop.name);
                input.addEventListener('change', (e) => this.onPropertyChange(prop.name, e.target.value));

                this.elementPropertyInputs[prop.name] = input;

                group.appendChild(label);
                group.appendChild(input);
                form.appendChild(group);
            });
        }

        // Add delete button
        const deleteGroup = document.createElement('div');
        deleteGroup.className = 'element-property-group';
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = '🗑️ Delete Element';
        deleteBtn.className = 'delete-element-btn';
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.onDeleteElement();
        });
        deleteGroup.appendChild(deleteBtn);
        form.appendChild(deleteGroup);

        content.appendChild(form);
        this.updateInputValues();
    }

    /**
     * Set the current element to edit
     */
    setElement(element) {
        this.currentElement = element;
        this.elementPropertyInputs = {};
        this.renderForElement();
    }

    /**
     * Update input values from element properties
     */
    updateInputValues() {
        if (!this.currentElement) return;

        Object.keys(this.elementPropertyInputs).forEach(propName => {
            const input = this.elementPropertyInputs[propName];
            let value;

            // Handle special properties
            if (propName === 'inputType') {
                value = this.currentElement.domElement.type || 'text';
            } else if (propName === 'textContent') {
                value = this.currentElement.domElement.textContent;
            } else if (propName === 'placeholder') {
                value = this.currentElement.domElement.placeholder || '';
            } else if (propName === 'href') {
                value = this.currentElement.domElement.href || '';
            } else if (propName === 'src') {
                value = this.currentElement.domElement.src || '';
            } else if (propName === 'alt') {
                value = this.currentElement.domElement.alt || '';
            } else {
                value = this.currentElement.getAttribute(propName);
            }

            if (value !== undefined) {
                input.value = value;
            }
        });
    }

    /**
     * Handle property change
     */
    onPropertyChange(propertyName, value) {
        if (!this.currentElement) return;

        const element = this.currentElement.domElement;

        // Handle special properties
        if (propertyName === 'textContent') {
            element.textContent = value;
            this.currentElement.setAttribute('textContent', value);
        } else if (propertyName === 'inputType') {
            element.type = value;
        } else if (propertyName === 'placeholder') {
            element.placeholder = value;
        } else if (propertyName === 'href') {
            element.href = value;
        } else if (propertyName === 'src') {
            element.src = value;
        } else if (propertyName === 'alt') {
            element.alt = value;
        } else {
            this.currentElement.setAttribute(propertyName, value);
        }
    }

    /**
     * Handle element deletion
     */
    onDeleteElement() {
        if (this.currentElement) {
            const event = new CustomEvent('elementDeleted', {
                detail: { element: this.currentElement }
            });
            window.dispatchEvent(event);
        }
    }

    /**
     * Clear the panel
     */
    clear() {
        this.currentElement = null;
        this.elementPropertyInputs = {};
        this.render();
    }
}
