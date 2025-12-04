/**
 * PropertyPanel - Manages the CSS properties editor
 */
class PropertyPanel {
    constructor(containerElement) {
        this.container = containerElement;
        this.currentElement = null;
        this.currentElements = null; // array of elements when multi-select
        this.propertyInputs = {};
        this.render();
    }

    /**
     * Create and manage floating flex popover
     */
    createFlexPopover() {
        if (this._flexPopover) return;
        const pop = document.createElement('div');
        pop.className = 'flex-popover';
        pop.style.position = 'fixed';
        pop.style.zIndex = 9999;
        pop.style.display = 'none';
        pop.innerHTML = `
            <div class="flex-popover-row">
                <label>Direction</label>
                <select data-prop="flexDirection">
                    <option value="row">row</option>
                    <option value="row-reverse">row-reverse</option>
                    <option value="column">column</option>
                    <option value="column-reverse">column-reverse</option>
                </select>
            </div>
            <div class="flex-popover-row">
                <label>Justify</label>
                <select data-prop="justifyContent">
                    <option value="flex-start">flex-start</option>
                    <option value="center">center</option>
                    <option value="flex-end">flex-end</option>
                    <option value="space-between">space-between</option>
                    <option value="space-around">space-around</option>
                    <option value="space-evenly">space-evenly</option>
                </select>
            </div>
            <div class="flex-popover-row">
                <label>Align</label>
                <select data-prop="alignItems">
                    <option value="stretch">stretch</option>
                    <option value="flex-start">flex-start</option>
                    <option value="center">center</option>
                    <option value="flex-end">flex-end</option>
                    <option value="baseline">baseline</option>
                </select>
            </div>
            <div class="flex-popover-row">
                <label>Wrap</label>
                <select data-prop="flexWrap">
                    <option value="nowrap">nowrap</option>
                    <option value="wrap">wrap</option>
                    <option value="wrap-reverse">wrap-reverse</option>
                </select>
            </div>
            <div class="flex-popover-row">
                <label>Gap</label>
                <input type="text" data-prop="gap" placeholder="8px" />
            </div>
            <div style="text-align:right;margin-top:6px;">
                <button type="button" class="flex-close">Close</button>
            </div>
        `;

        // wire events
        pop.querySelectorAll('[data-prop]').forEach(inp => {
            const prop = inp.getAttribute('data-prop');
            const handler = (e) => {
                const val = e.target.value;
                this.onPropertyChange(prop, val);
            };
            // use input for text and change for selects
            if (inp.tagName.toLowerCase() === 'input') inp.addEventListener('input', handler);
            inp.addEventListener('change', handler);
        });

        pop.querySelector('.flex-close').addEventListener('click', () => this.hideFlexPopover());

        document.body.appendChild(pop);
        this._flexPopover = pop;
    }

    showFlexPopover(anchorRect) {
        this.createFlexPopover();
        const pop = this._flexPopover;
        // position below the anchor if space, otherwise above
        const top = anchorRect.bottom + 6;
        let left = anchorRect.left;
        pop.style.top = top + 'px';
        pop.style.left = left + 'px';
        pop.style.display = 'block';
    }

    hideFlexPopover() {
        if (this._flexPopover) this._flexPopover.style.display = 'none';
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
            { name: 'zIndex', label: 'Z-Index', type: 'text', placeholder: '1' },
            { name: 'overflow-x', label: 'overflow-x', type: 'select',options: ['auto', 'scroll', 'hidden','visible'] },
            { name: 'overflow-y', label: 'overflow-y', type: 'select',options: ['auto', 'scroll', 'hidden','visible'] }
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
            if (prop.type === 'select') {
                input.addEventListener('change', (e) => this.onPropertyChange(prop.name, e.target.value));
            } else {
                // Apply changes in real-time while typing or adjusting color/range
                input.addEventListener('input', (e) => this.onPropertyChange(prop.name, e.target.value));
                // Keep change for completeness
                input.addEventListener('change', (e) => this.onPropertyChange(prop.name, e.target.value));
            }

            this.propertyInputs[prop.name] = input;

            group.appendChild(label);
            // For 'display' add a small Flex button to open popover
            if (prop.name === 'display') {
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.gap = '6px';
                wrapper.style.alignItems = 'center';
                wrapper.appendChild(input);

                const flexBtn = document.createElement('button');
                flexBtn.type = 'button';
                flexBtn.className = 'flex-popover-btn';
                flexBtn.title = 'Open flex controls';
                flexBtn.textContent = '⚙︎';
                flexBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // show popover anchored to this input
                    const rect = input.getBoundingClientRect();
                    this.showFlexPopover(rect);
                });

                wrapper.appendChild(flexBtn);
                group.appendChild(wrapper);
            } else {
                group.appendChild(input);
            }
            form.appendChild(group);
        });

        content.appendChild(form);
    }

    /**
     * Set the current element to edit
     */
    setElement(element) {
        this.setElements(element ? [element] : null);
    }

    /**
     * Set one or more elements to edit
     */
    setElements(elements) {
        if (!elements || elements.length === 0) {
            this.currentElements = null;
            this.currentElement = null;
            this.updateInputValues();
            return;
        }

        this.currentElements = elements;
        this.currentElement = elements[0];
        this.updateInputValues();
    }

    /**
     * Update input values from element properties
     */
    updateInputValues() {
        if (!this.currentElements || this.currentElements.length === 0) {
            Object.keys(this.propertyInputs).forEach(propName => {
                this.propertyInputs[propName].value = '';
            });
            return;
        }

        if (this.currentElements.length === 1) {
            const el = this.currentElements[0];
            Object.keys(this.propertyInputs).forEach(propName => {
                const value = el.getProperty(propName);
                this.propertyInputs[propName].value = value !== undefined ? value : '';
            });
            return;
        }

        // Multiple elements: show only common values (same across all selected)
        Object.keys(this.propertyInputs).forEach(propName => {
            const firstVal = this.currentElements[0].getProperty(propName);
            const allSame = this.currentElements.every(el => el.getProperty(propName) === firstVal);
            this.propertyInputs[propName].value = allSame ? (firstVal !== undefined ? firstVal : '') : '';
        });
    }

    /**
     * Handle property change
     */
    onPropertyChange(propertyName, value) {
        if (!this.currentElements || this.currentElements.length === 0) return;

        // Normalize value for certain properties
        let outValue = value;
        if (propertyName === 'opacity') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) outValue = numValue.toString();
        }

        // Apply to all selected elements
        this.currentElements.forEach(el => {
            el.setProperty(propertyName, outValue);
        });
    }

    /**
     * Clear the panel
     */
    clear() {
        this.currentElement = null;
        this.currentElements = null;
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
        this.currentElements = null;
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
        // Backwards-compatible single-element render
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
                if (prop.type === 'select') {
                    input.addEventListener('change', (e) => this.onPropertyChange(prop.name, e.target.value));
                } else {
                    input.addEventListener('input', (e) => this.onPropertyChange(prop.name, e.target.value));
                    input.addEventListener('change', (e) => this.onPropertyChange(prop.name, e.target.value));
                }

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
     * Render controls for multiple elements (show only common fields)
     */
    renderForElements() {
        if (!this.currentElements || this.currentElements.length === 0) {
            this.render();
            return;
        }

        this.container.innerHTML = '<div class="element-properties-content"></div>';
        const content = this.container.querySelector('.element-properties-content');
        const form = document.createElement('form');
        form.className = 'element-properties-form';

        // Compute intersection of property definition names across selected types
        const defsPerElement = this.currentElements.map(el => this.getElementProperties(el.type));
        const nameSets = defsPerElement.map(defs => defs.map(d => d.name));
        const commonNames = nameSets.reduce((acc, names) => acc.filter(n => names.includes(n)), nameSets[0] || []);

        if (commonNames.length === 0) {
            const noProps = document.createElement('p');
            noProps.textContent = 'No common element-specific properties for selected items';
            noProps.className = 'no-element-message';
            form.appendChild(noProps);
        } else {
            // Build property definitions from first element's defs
            const firstDefs = defsPerElement[0] || [];
            commonNames.forEach(name => {
                const prop = firstDefs.find(p => p.name === name);
                if (!prop) return;

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
                if (prop.type === 'select') {
                    input.addEventListener('change', (e) => this.onPropertyChange(prop.name, e.target.value));
                } else {
                    input.addEventListener('input', (e) => this.onPropertyChange(prop.name, e.target.value));
                    input.addEventListener('change', (e) => this.onPropertyChange(prop.name, e.target.value));
                }
                this.elementPropertyInputs[prop.name] = input;

                group.appendChild(label);
                group.appendChild(input);
                form.appendChild(group);
            });
        }

        // Delete button applies to all selected
        const deleteGroup = document.createElement('div');
        deleteGroup.className = 'element-property-group';
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = '🗑️ Delete Selected Elements';
        deleteBtn.className = 'delete-element-btn';
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentElements && this.currentElements.length) {
                const ev = new CustomEvent('elementsDeleted', { detail: { elements: this.currentElements } });
                window.dispatchEvent(ev);
            }
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
        this.setElements(element ? [element] : null);
    }

    setElements(elements) {
        this.currentElements = elements;
        this.elementPropertyInputs = {};
        if (!elements || elements.length === 0) {
            this.currentElement = null;
            this.render();
            return;
        }
        this.currentElement = elements[0];
        if (elements.length === 1) this.renderForElement(); else this.renderForElements();
    }

    /**
     * Update input values from element properties
     */
    updateInputValues() {
        if (!this.currentElements || this.currentElements.length === 0) return;

        const elements = this.currentElements;
        Object.keys(this.elementPropertyInputs).forEach(propName => {
            const input = this.elementPropertyInputs[propName];

            const getValFromEl = (el) => {
                const dom = el.domElement;
                if (propName === 'inputType') return dom.type || 'text';
                if (propName === 'textContent') return dom.textContent || '';
                if (propName === 'placeholder') return dom.placeholder || '';
                if (propName === 'href') return dom.getAttribute('href') || dom.href || '';
                if (propName === 'src') return dom.getAttribute('src') || dom.src || '';
                if (propName === 'alt') return dom.alt || '';
                return el.getAttribute(propName) || '';
            };

            const firstVal = getValFromEl(elements[0]);
            const allSame = elements.every(el => getValFromEl(el) === firstVal);
            input.value = allSame ? firstVal : '';
        });
    }

    /**
     * Handle property change
     */
onPropertyChange(propertyName, value) {
    if (!this.currentElements || this.currentElements.length === 0) return;

    // Apply change to all selected elements
    this.currentElements.forEach(el => {
        const dom = el.domElement;
        if (propertyName === 'textContent') {
            // FIX: Update text without removing child elements
            this.updateElementTextSafely(el, value);
        } else if (propertyName === 'inputType') {
            dom.type = value;
            el.setAttribute('type', value);
        } else if (propertyName === 'placeholder') {
            dom.placeholder = value;
            el.setAttribute('placeholder', value);
        } else if (propertyName === 'href') {
            dom.setAttribute('href', value);
            el.setAttribute('href', value);
        } else if (propertyName === 'src') {
            dom.setAttribute('src', value);
            el.setAttribute('src', value);
        } else if (propertyName === 'alt') {
            dom.alt = value;
            el.setAttribute('alt', value);
        } else {
            el.setAttribute(propertyName, value);
        }
    });
}

// Add this helper method to the ElementPropertiesPanel class:
updateElementTextSafely(element, newText) {
    const dom = element.domElement;
    
    // First, find all element children (not text nodes)
    const childElements = [];
    for (let child of dom.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
            childElements.push(child);
        }
    }
    
    // Clear the element (removes both text and elements)
    dom.textContent = '';
    
    // Add the new text first
    const textNode = document.createTextNode(newText);
    dom.appendChild(textNode);
    
    // Re-add all child elements after the text
    childElements.forEach(child => {
        dom.appendChild(child);
    });
    
    // Update the element's attribute
    element.setAttribute('textContent', newText);
}
    /**
     * Handle element deletion
     */
    onDeleteElement() {
        if (this.currentElements && this.currentElements.length) {
            if (this.currentElements.length === 1) {
                const event = new CustomEvent('elementDeleted', { detail: { element: this.currentElements[0] } });
                window.dispatchEvent(event);
            } else {
                const event = new CustomEvent('elementsDeleted', { detail: { elements: this.currentElements } });
                window.dispatchEvent(event);
            }
        }
    }

    /**
     * Clear the panel
     */
    clear() {
        this.currentElement = null;
        this.currentElements = null;
        this.elementPropertyInputs = {};
        this.render();
    }
}
