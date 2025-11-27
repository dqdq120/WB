/**
 * Project Model - Represents the entire web builder project
 */
class Project {
    constructor(config = {}) {
        this.id = config.id || this.generateId();
        this.name = config.name || 'Untitled Project';
        this.description = config.description || '';
        this.rootElement = config.rootElement || new Element({ 
            type: 'root', 
            tagName: 'div',
            name: 'Canvas',
            width: '100%',
            height: '100%'
        });
        
        // Project-level settings
        this.theme = config.theme || this.createDefaultTheme();
        this.templates = config.templates || [];
        this.settings = {
            snapToGrid: config.snapToGrid !== undefined ? config.snapToGrid : true,
            gridSize: config.gridSize || 10,
            showRulers: config.showRulers !== undefined ? config.showRulers : true,
            ...config.settings
        };
        
        this.createdAt = config.createdAt || new Date().toISOString();
        this.updatedAt = config.updatedAt || new Date().toISOString();
    }

    generateId() {
        return 'proj_' + Math.random().toString(36).substr(2, 9);
    }

    createDefaultTheme() {
        return {
            name: 'Default',
            colors: {
                primary: '#007bff',
                secondary: '#6c757d',
                success: '#28a745',
                danger: '#dc3545',
                warning: '#ffc107',
                info: '#17a2b8',
                light: '#f8f9fa',
                dark: '#343a40'
            },
            fonts: {
                primary: 'Arial, sans-serif',
                secondary: 'Georgia, serif',
                mono: 'Courier New, monospace'
            },
            variables: {}
        };
    }

    addElement(parentId, elementConfig) {
        const newElement = new Element(elementConfig);
        const parent = this.findElementById(parentId);
        if (parent) {
            parent.addChild(newElement);
        }
        return newElement;
    }

    deleteElement(elementId) {
        const element = this.findElementById(elementId);
        if (!element) return false;

        const parent = this.findElementById(element.parentId);
        if (parent) {
            parent.removeChild(elementId);
            return true;
        }
        return false;
    }

    duplicateElement(elementId) {
        const element = this.findElementById(elementId);
        if (!element) return null;

        const duplicate = element.duplicate();
        const parent = this.findElementById(element.parentId);
        if (parent) {
            parent.addChild(duplicate);
        }
        return duplicate;
    }

    findElementById(id) {
        if (this.rootElement.id === id) return this.rootElement;
        return this.searchElement(this.rootElement, id);
    }

    searchElement(element, id) {
        for (let child of element.children) {
            if (child.id === id) return child;
            const found = this.searchElement(child, id);
            if (found) return found;
        }
        return null;
    }

    getAllElements() {
        const elements = [];
        this.traverseElements(this.rootElement, elements);
        return elements;
    }

    traverseElements(element, collection) {
        collection.push(element);
        element.children.forEach(child => this.traverseElements(child, collection));
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            rootElement: this.rootElement.toJSON(),
            theme: this.theme,
            templates: this.templates,
            settings: this.settings,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromJSON(json) {
        const project = new Project({
            id: json.id,
            name: json.name,
            description: json.description,
            theme: json.theme,
            templates: json.templates,
            settings: json.settings,
            createdAt: json.createdAt,
            updatedAt: json.updatedAt
        });
        
        if (json.rootElement) {
            project.rootElement = Element.fromJSON(json.rootElement);
        }
        
        return project;
    }
}
