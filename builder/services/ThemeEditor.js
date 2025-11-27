/**
 * Theme Editor Service - Edit project-level themes
 */
class ThemeEditor {
    constructor() {
        this.modal = null;
        this.currentTheme = null;
        this.onSave = null;
    }

    open(theme, onSave) {
        this.currentTheme = JSON.parse(JSON.stringify(theme)); // Deep copy
        this.onSave = onSave;
        this.createAndShowModal();
    }

    createAndShowModal() {
        if (!this.modal) {
            this.modal = document.createElement('div');
            this.modal.className = 'modal';
            this.modal.id = 'theme-editor-modal';
            document.body.appendChild(this.modal);
        }

        this.modal.innerHTML = `
            <div class="modal-content" style="width: 600px; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3>Edit Theme: ${this.currentTheme.name}</h3>
                    <button onclick="document.getElementById('theme-editor-modal').classList.remove('show')" style="cursor: pointer; font-size: 20px;">✕</button>
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">Theme Name</label>
                    <input type="text" id="theme-name" value="${this.currentTheme.name}" 
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>

                <div style="margin-bottom: 16px;">
                    <h4 style="margin-bottom: 8px; font-weight: bold;">Colors</h4>
                    ${this.createColorInputs()}
                </div>

                <div style="margin-bottom: 16px;">
                    <h4 style="margin-bottom: 8px; font-weight: bold;">Fonts</h4>
                    ${this.createFontInputs()}
                </div>

                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button onclick="document.getElementById('theme-editor-modal').classList.remove('show')" 
                            style="padding: 8px 16px; cursor: pointer;">Cancel</button>
                    <button onclick="window.themeEditorInstance.save()" 
                            style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Theme</button>
                </div>
            </div>
        `;

        window.themeEditorInstance = this;
        this.modal.classList.add('show');
    }

    createColorInputs() {
        let html = '';
        for (const [key, color] of Object.entries(this.currentTheme.colors || {})) {
            html += `
                <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                    <label style="flex: 0 0 120px; font-size: 13px;">${key}</label>
                    <input type="color" value="${color}" id="color-${key}" 
                           style="width: 50px; height: 32px; border: 1px solid #ddd; cursor: pointer;">
                    <input type="text" value="${color}" id="color-text-${key}" 
                           style="flex: 1; padding: 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px;">
                </div>
            `;
        }
        return html;
    }

    createFontInputs() {
        let html = '';
        for (const [key, font] of Object.entries(this.currentTheme.fonts || {})) {
            html += `
                <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                    <label style="flex: 0 0 120px; font-size: 13px;">${key}</label>
                    <input type="text" value="${font}" id="font-${key}" 
                           style="flex: 1; padding: 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px;">
                </div>
            `;
        }
        return html;
    }

    save() {
        // Update name
        this.currentTheme.name = document.getElementById('theme-name').value;

        // Update colors
        for (const key of Object.keys(this.currentTheme.colors || {})) {
            const colorInput = document.getElementById('color-text-' + key);
            if (colorInput) {
                this.currentTheme.colors[key] = colorInput.value;
            }
        }

        // Update fonts
        for (const key of Object.keys(this.currentTheme.fonts || {})) {
            const fontInput = document.getElementById('font-' + key);
            if (fontInput) {
                this.currentTheme.fonts[key] = fontInput.value;
            }
        }

        if (this.onSave) {
            this.onSave(this.currentTheme);
        }

        this.modal.classList.remove('show');
    }
}

/**
 * Advanced CSS Properties Editor
 */
class AdvancedCSSEditor {
    static showEditor(element, onSave) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="width: 700px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3>Advanced CSS Properties</h3>
                    <button onclick="this.parentElement.parentElement.remove()" style="cursor: pointer; font-size: 20px;">✕</button>
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">Custom CSS</label>
                    <textarea id="custom-css" style="width: 100%; height: 300px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px;">
${Object.entries(element.styles)
    .map(([k, v]) => `${AdvancedCSSEditor.camelToKebab(k)}: ${v};`)
    .join('\n')}
                    </textarea>
                </div>

                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button onclick="this.closest('.modal').remove()" style="padding: 8px 16px; cursor: pointer;">Cancel</button>
                    <button onclick="window.advancedCSSCallback(document.getElementById('custom-css').value); this.closest('.modal').remove();" 
                            style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Apply</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        window.advancedCSSCallback = (cssText) => {
            const styles = {};
            cssText.split(';').forEach(rule => {
                if (rule.trim()) {
                    const [prop, value] = rule.split(':').map(s => s.trim());
                    const camelProp = AdvancedCSSEditor.kebabToCamel(prop);
                    styles[camelProp] = value;
                }
            });
            onSave(styles);
        };
    }

    static camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    static kebabToCamel(str) {
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }
}
