/**
 * Properties Panel Service - Manages element properties UI
 */
class PropertiesPanel {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.project = null;
        this.selectedElements = [];
    }

    init(project) {
        this.project = project;
    }

    updateSelection(selectedIds) {
        this.selectedElements = selectedIds.map(id => this.project.findElementById(id)).filter(e => e);
        this.render();
    }

    render() {
        if (!this.container) return;
        
        this.container.innerHTML = '';

        if (this.selectedElements.length === 0) {
            this.container.innerHTML = '<p class="panel-empty">No element selected</p>';
            return;
        }

        if (this.selectedElements.length === 1) {
            this.renderSingleElement(this.selectedElements[0]);
        } else {
            this.renderMultipleElements(this.selectedElements);
        }
    }

    renderSingleElement(element) {
        const panel = document.createElement('div');
        panel.className = 'properties-panel';

        // Element info
        const info = document.createElement('div');
        info.className = 'property-group';
        info.innerHTML = `
            <h3>Element: ${element.name}</h3>
            <p>Type: <strong>${element.type}</strong></p>
            <p>ID: <code>${element.id}</code></p>
        `;
        panel.appendChild(info);

        // Dimensions
        panel.appendChild(this.createPropertyGroup('Dimensions', [
            { label: 'Width', key: 'width', type: 'text', value: element.styles.width },
            { label: 'Height', key: 'height', type: 'text', value: element.styles.height }
        ], element));

        // Position
        panel.appendChild(this.createPropertyGroup('Position', [
            { label: 'Top', key: 'top', type: 'text', value: element.styles.top },
            { label: 'Left', key: 'left', type: 'text', value: element.styles.left }
        ], element));

        // Spacing
        panel.appendChild(this.createPropertyGroup('Spacing', [
            { label: 'Padding', key: 'padding', type: 'text', value: element.styles.padding },
            { label: 'Margin', key: 'margin', type: 'text', value: element.styles.margin }
        ], element));

        // Colors
        panel.appendChild(this.createPropertyGroup('Colors', [
            { label: 'Background', key: 'backgroundColor', type: 'color', value: element.styles.backgroundColor },
            { label: 'Text Color', key: 'color', type: 'color', value: element.styles.color }
        ], element));

        // Typography
        panel.appendChild(this.createPropertyGroup('Typography', [
            { label: 'Font Size', key: 'fontSize', type: 'text', value: element.styles.fontSize },
            { label: 'Font Weight', key: 'fontWeight', type: 'select', value: element.styles.fontWeight, 
              options: ['normal', 'bold', '100', '300', '400', '600', '700', '900'] }
        ], element));

        // Border
        panel.appendChild(this.createPropertyGroup('Border', [
            { label: 'Border', key: 'border', type: 'text', value: element.styles.border },
            { label: 'Border Radius', key: 'borderRadius', type: 'text', value: element.styles.borderRadius }
        ], element));

        // Element-specific properties
        if (element.type === 'image') {
            panel.appendChild(this.createPropertyGroup('Image', [
                { label: 'Source', key: 'src', type: 'text', value: element.properties.src, target: 'properties' },
                { label: 'Alt Text', key: 'alt', type: 'text', value: element.properties.alt, target: 'properties' }
            ], element));
        }

        if (element.type === 'text') {
            panel.appendChild(this.createPropertyGroup('Text', [
                { label: 'Content', key: 'text', type: 'textarea', value: element.text }
            ], element));
        }

        if (element.type === 'button') {
            panel.appendChild(this.createPropertyGroup('Button', [
                { label: 'Label', key: 'text', type: 'text', value: element.text }
            ], element));
        }

        this.container.appendChild(panel);
    }

    renderMultipleElements(elements) {
        const panel = document.createElement('div');
        panel.className = 'properties-panel';
        
        panel.innerHTML = `
            <h3>Multiple Elements Selected (${elements.length})</h3>
            <p>Select a single element to edit its properties</p>
        `;
        
        this.container.appendChild(panel);
    }

    createPropertyGroup(title, properties, element) {
        const group = document.createElement('div');
        group.className = 'property-group';
        
        const heading = document.createElement('h4');
        heading.textContent = title;
        group.appendChild(heading);

        properties.forEach(prop => {
            const row = document.createElement('div');
            row.className = 'property-row';

            const label = document.createElement('label');
            label.textContent = prop.label;
            row.appendChild(label);

            let input;
            const target = prop.target || 'styles';
            const currentValue = target === 'properties' ? element.properties[prop.key] : element.styles[prop.key];

            if (prop.type === 'textarea') {
                input = document.createElement('textarea');
                input.value = currentValue || '';
            } else if (prop.type === 'select') {
                input = document.createElement('select');
                prop.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    option.selected = opt === currentValue;
                    input.appendChild(option);
                });
            } else {
                input = document.createElement('input');
                input.type = prop.type;
                input.value = currentValue || '';
            }

            input.addEventListener('change', () => {
                if (target === 'properties') {
                    element.properties[prop.key] = input.value;
                } else {
                    element.styles[prop.key] = input.value;
                }
                document.dispatchEvent(new CustomEvent('elementPropertiesChanged', {
                    detail: { elementId: element.id }
                }));
            });

            input.addEventListener('input', () => {
                if (target === 'properties') {
                    element.properties[prop.key] = input.value;
                } else {
                    element.styles[prop.key] = input.value;
                }
                document.dispatchEvent(new CustomEvent('elementPropertiesChanged', {
                    detail: { elementId: element.id }
                }));
            });

            row.appendChild(input);
            group.appendChild(row);
        });

        return group;
    }
}
