/**
 * Template presets for quick project start
 */
const TEMPLATES = {
    blank: {
        id: 'blank',
        name: 'Blank Canvas',
        description: 'Start from scratch',
        thumbnail: '📄',
        rootElement: {
            type: 'root',
            tagName: 'div',
            name: 'Canvas',
            width: '100%',
            height: '100%',
            children: []
        }
    },
    
    landingPage: {
        id: 'landing-page',
        name: 'Landing Page',
        description: 'Hero section + features + footer',
        thumbnail: '🌐',
        rootElement: {
            type: 'root',
            tagName: 'div',
            name: 'Canvas',
            width: '100%',
            height: '100%',
            children: [
                {
                    type: 'container',
                    tagName: 'div',
                    name: 'Header',
                    width: '100%',
                    height: '80px',
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '20px',
                    children: []
                },
                {
                    type: 'container',
                    tagName: 'div',
                    name: 'Hero Section',
                    width: '100%',
                    height: '400px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    padding: '40px',
                    children: []
                },
                {
                    type: 'container',
                    tagName: 'div',
                    name: 'Features',
                    width: '100%',
                    height: 'auto',
                    backgroundColor: '#f8f9fa',
                    padding: '40px',
                    children: []
                },
                {
                    type: 'container',
                    tagName: 'footer',
                    name: 'Footer',
                    width: '100%',
                    height: '100px',
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '20px',
                    children: []
                }
            ]
        }
    },

    portfolio: {
        id: 'portfolio',
        name: 'Portfolio',
        description: 'Portfolio showcase template',
        thumbnail: '🎨',
        rootElement: {
            type: 'root',
            tagName: 'div',
            name: 'Canvas',
            width: '100%',
            height: '100%',
            children: [
                {
                    type: 'container',
                    tagName: 'nav',
                    name: 'Navigation',
                    width: '100%',
                    height: '60px',
                    backgroundColor: '#fff',
                    padding: '0 20px',
                    display: 'flex',
                    children: []
                },
                {
                    type: 'container',
                    tagName: 'section',
                    name: 'Projects Grid',
                    width: '100%',
                    height: 'auto',
                    backgroundColor: '#fff',
                    padding: '40px',
                    children: []
                }
            ]
        }
    },

    ecommerce: {
        id: 'ecommerce',
        name: 'E-Commerce',
        description: 'Product listing and details page',
        thumbnail: '🛍️',
        rootElement: {
            type: 'root',
            tagName: 'div',
            name: 'Canvas',
            width: '100%',
            height: '100%',
            children: [
                {
                    type: 'container',
                    tagName: 'header',
                    name: 'Top Bar',
                    width: '100%',
                    height: '80px',
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '20px',
                    children: []
                },
                {
                    type: 'container',
                    tagName: 'section',
                    name: 'Products',
                    width: '100%',
                    height: 'auto',
                    backgroundColor: '#f5f5f5',
                    padding: '40px',
                    display: 'grid',
                    children: []
                }
            ]
        }
    }
};

function getTemplate(templateId) {
    return TEMPLATES[templateId] || TEMPLATES.blank;
}

function getAllTemplates() {
    return Object.values(TEMPLATES);
}
