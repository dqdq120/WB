/**
 * Element Model - Core data structure for builder elements
 * Each element is a node in the tree with properties, styles, and children
 */
class Element {
    constructor(config = {}) {
        this.id = config.id || this.generateId();
        this.type = config.type || 'div'; // 'div', 'container', 'text', 'image', 'button', 'icon'
        this.tagName = config.tagName || 'div';
        this.name = config.name || `${this.type}-${this.id.slice(0, 5)}`;
        
        // Element content
        this.text = config.text || '';
        this.html = config.html || '';
        
        // Element-specific properties
        this.properties = {
            src: config.src || '', // for images
            alt: config.alt || '', // for images
            href: config.href || '', // for links
            target: config.target || '_self', // for links
            iconName: config.iconName || '', // for icons
            fontFamily: config.fontFamily || '', // for text
        };
        
        // CSS Styles
        this.styles = {
            width: config.width || '100px',
            height: config.height || '100px',
            backgroundColor: config.backgroundColor || 'transparent',
            color: config.color || '#000000',
            padding: config.padding || '10px',
            margin: config.margin || '0px',
            border: config.border || 'none',
            borderRadius: config.borderRadius || '0px',
            fontSize: config.fontSize || '16px',
            fontWeight: config.fontWeight || 'normal',
            display: config.display || 'block',
            position: config.position || 'relative',
            top: config.top || '0px',
            left: config.left || '0px',
            zIndex: config.zIndex || '1',
            opacity: config.opacity || '1',
            ...(config.styles || {}) // allow override
        };
        
        // Tree structure
        this.parentId = config.parentId || null;
        this.children = config.children || [];
        this.isSelected = false;
        this.isLocked = false;
        this.isVisible = true;
    }

    generateId() {
        return 'elem_' + Math.random().toString(36).substr(2, 9);
    }

    addChild(child) {
        if (!(child instanceof Element)) {
            throw new Error('Child must be an Element instance');
        }
        child.parentId = this.id;
        this.children.push(child);
        return child;
    }

    removeChild(childId) {
        const index = this.children.findIndex(c => c.id === childId);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    duplicate() {
        const copy = new Element({
            type: this.type,
            tagName: this.tagName,
            name: `${this.name} (copy)`,
            text: this.text,
            html: this.html,
            ...this.properties,
            ...this.styles
        });
        
        // Recursively duplicate children
        this.children.forEach(child => {
            copy.addChild(child.duplicate());
        });
        
        return copy;
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            tagName: this.tagName,
            name: this.name,
            text: this.text,
            html: this.html,
            properties: this.properties,
            styles: this.styles,
            parentId: this.parentId,
            children: this.children.map(c => c.toJSON()),
            isLocked: this.isLocked,
            isVisible: this.isVisible
        };
    }

    static fromJSON(json) {
        const element = new Element(json);
        if (json.children && json.children.length > 0) {
            element.children = json.children.map(childJson => Element.fromJSON(childJson));
        }
        return element;
    }
}
