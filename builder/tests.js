/**
 * Builder Test Suite - Basic validation of core functionality
 * Run tests in browser console after loading builder.html
 */

class BuilderTestSuite {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.tests = [];
    }

    test(name, fn) {
        try {
            fn();
            this.passed++;
            console.log(`✅ ${name}`);
        } catch (error) {
            this.failed++;
            console.error(`❌ ${name}: ${error.message}`);
        }
    }

    runAll() {
        console.clear();
        console.log('%c🧪 Web Builder Test Suite', 'font-size: 18px; font-weight: bold; color: #007bff;');
        console.log('─'.repeat(50));

        // Element Tests
        console.log('\n📦 Element Model Tests:');
        this.testElementModel();

        // Project Tests
        console.log('\n📋 Project Model Tests:');
        this.testProjectModel();

        // Template Tests
        console.log('\n🎨 Template Tests:');
        this.testTemplates();

        // Service Tests
        console.log('\n⚙️ Service Tests:');
        this.testServices();

        // Summary
        console.log('\n' + '─'.repeat(50));
        console.log(`%cResults: ${this.passed} passed, ${this.failed} failed`, 
                    this.failed === 0 ? 'color: #28a745; font-weight: bold;' : 'color: #dc3545; font-weight: bold;');
    }

    testElementModel() {
        this.test('Element constructor creates valid element', () => {
            const elem = new Element({ type: 'container', name: 'Test' });
            if (!elem.id || !elem.type) throw new Error('Invalid element');
        });

        this.test('Element generates unique IDs', () => {
            const elem1 = new Element({ type: 'text' });
            const elem2 = new Element({ type: 'text' });
            if (elem1.id === elem2.id) throw new Error('IDs not unique');
        });

        this.test('Element.addChild() works', () => {
            const parent = new Element({ type: 'container' });
            const child = new Element({ type: 'text' });
            parent.addChild(child);
            if (parent.children.length !== 1) throw new Error('Child not added');
            if (child.parentId !== parent.id) throw new Error('Parent ID not set');
        });

        this.test('Element.duplicate() creates copy', () => {
            const elem = new Element({ type: 'container', name: 'Original' });
            const dup = elem.duplicate();
            if (elem.id === dup.id) throw new Error('Duplicate has same ID');
            if (dup.name !== 'Original (copy)') throw new Error('Name not updated');
        });

        this.test('Element.toJSON() and fromJSON() work', () => {
            const elem = new Element({ type: 'text', text: 'Hello' });
            const json = elem.toJSON();
            const restored = Element.fromJSON(json);
            if (restored.id !== elem.id) throw new Error('ID mismatch');
            if (restored.text !== 'Hello') throw new Error('Text not preserved');
        });

        this.test('Element.removeChild() works', () => {
            const parent = new Element({ type: 'container' });
            const child = new Element({ type: 'text' });
            parent.addChild(child);
            parent.removeChild(child.id);
            if (parent.children.length !== 0) throw new Error('Child not removed');
        });
    }

    testProjectModel() {
        this.test('Project constructor creates valid project', () => {
            const proj = new Project({ name: 'Test' });
            if (!proj.id || !proj.rootElement) throw new Error('Invalid project');
        });

        this.test('Project.addElement() works', () => {
            const proj = new Project();
            const elem = proj.addElement(proj.rootElement.id, { type: 'text' });
            if (!elem.id) throw new Error('Element not created');
            if (proj.rootElement.children.length !== 1) throw new Error('Element not added to root');
        });

        this.test('Project.deleteElement() works', () => {
            const proj = new Project();
            const elem = proj.addElement(proj.rootElement.id, { type: 'text' });
            const success = proj.deleteElement(elem.id);
            if (!success) throw new Error('Delete failed');
            if (proj.rootElement.children.length !== 0) throw new Error('Element not deleted');
        });

        this.test('Project.duplicateElement() works', () => {
            const proj = new Project();
            const elem = proj.addElement(proj.rootElement.id, { type: 'text' });
            const dup = proj.duplicateElement(elem.id);
            if (!dup) throw new Error('Duplicate failed');
            if (proj.rootElement.children.length !== 2) throw new Error('Duplicate not added');
        });

        this.test('Project.findElementById() works', () => {
            const proj = new Project();
            const elem = proj.addElement(proj.rootElement.id, { type: 'text' });
            const found = proj.findElementById(elem.id);
            if (found.id !== elem.id) throw new Error('Element not found');
        });

        this.test('Project.getAllElements() works', () => {
            const proj = new Project();
            proj.addElement(proj.rootElement.id, { type: 'text' });
            proj.addElement(proj.rootElement.id, { type: 'button' });
            const all = proj.getAllElements();
            if (all.length < 3) throw new Error('Not all elements returned'); // root + 2 children
        });

        this.test('Project.toJSON() and fromJSON() work', () => {
            const proj = new Project({ name: 'Test Project' });
            proj.addElement(proj.rootElement.id, { type: 'text' });
            const json = proj.toJSON();
            const restored = Project.fromJSON(json);
            if (restored.name !== 'Test Project') throw new Error('Name not preserved');
            if (restored.rootElement.children.length !== 1) throw new Error('Structure not preserved');
        });
    }

    testTemplates() {
        this.test('getTemplate() returns valid template', () => {
            const template = getTemplate('landing-page');
            if (!template.rootElement) throw new Error('Invalid template');
        });

        this.test('getAllTemplates() returns array', () => {
            const templates = getAllTemplates();
            if (!Array.isArray(templates)) throw new Error('Not an array');
            if (templates.length < 2) throw new Error('Not enough templates');
        });

        this.test('Template elements have required fields', () => {
            const templates = getAllTemplates();
            templates.forEach(t => {
                if (!t.id || !t.name || !t.rootElement) {
                    throw new Error(`Template ${t.id} missing required fields`);
                }
            });
        });

        this.test('Blank template has no children', () => {
            const template = getTemplate('blank');
            if (template.rootElement.children.length !== 0) {
                throw new Error('Blank template should have no children');
            }
        });
    }

    testServices() {
        this.test('ElementTreeService initializes', () => {
            const proj = new Project();
            const service = new ElementTreeService();
            // Can't fully test without DOM, but check instantiation
            if (!service.project !== undefined) throw new Error('Service not initialized');
        });

        this.test('ElementTreeService selection works', () => {
            const service = new ElementTreeService();
            service.selectNode('test-id');
            if (!service.selectedNodes.includes('test-id')) throw new Error('Node not selected');
        });

        this.test('PropertiesPanel initializes', () => {
            const panel = new PropertiesPanel('#non-existent');
            if (!panel) throw new Error('Panel not created');
        });

        this.test('Toolbar initializes', () => {
            const toolbar = new Toolbar('#non-existent');
            if (!toolbar) throw new Error('Toolbar not created');
        });

        this.test('AssetLibraryService initializes', () => {
            const service = new AssetLibraryService();
            if (!service.imageAPI) throw new Error('Image API not initialized');
            if (!service.iconAPI) throw new Error('Icon API not initialized');
        });

        this.test('ThemeEditor initializes', () => {
            const editor = new ThemeEditor();
            if (!editor) throw new Error('Editor not created');
        });
    }

    runDemoProject() {
        console.log('\n%c🎨 Creating Demo Project...', 'font-size: 14px; font-weight: bold;');

        const project = new Project({ name: 'Demo' });

        // Add header
        const header = project.addElement(project.rootElement.id, {
            type: 'container',
            name: 'Header',
            width: '100%',
            height: '80px',
            backgroundColor: '#333'
        });

        // Add title to header
        project.addElement(header.id, {
            type: 'text',
            name: 'Title',
            text: 'Welcome to Web Builder',
            color: '#fff'
        });

        // Add main section
        const main = project.addElement(project.rootElement.id, {
            type: 'container',
            name: 'Main',
            width: '100%',
            height: '400px',
            backgroundColor: '#f5f5f5'
        });

        // Add content
        project.addElement(main.id, {
            type: 'text',
            name: 'Content',
            text: 'This is a demo project created programmatically!',
            fontSize: '20px'
        });

        // Add button
        project.addElement(main.id, {
            type: 'button',
            name: 'CTA Button',
            text: 'Get Started',
            width: '150px',
            height: '50px',
            backgroundColor: '#007bff'
        });

        // Add footer
        const footer = project.addElement(project.rootElement.id, {
            type: 'container',
            name: 'Footer',
            width: '100%',
            height: '60px',
            backgroundColor: '#333'
        });

        project.addElement(footer.id, {
            type: 'text',
            name: 'Copyright',
            text: '© 2025 My Website',
            color: '#fff'
        });

        console.log('✅ Demo project created with 8 elements');
        console.log('📊 Structure:', {
            root: project.rootElement.id,
            header: header.id,
            main: main.id,
            footer: footer.id,
            totalElements: project.getAllElements().length
        });

        return project;
    }
}

// Run tests when page loads
if (window.location.pathname.includes('builder.html')) {
    window.addEventListener('load', () => {
        // Wait for all scripts to load
        setTimeout(() => {
            window.testSuite = new BuilderTestSuite();
            console.log('%c\n📋 To run tests, type: testSuite.runAll()', 'color: #666; font-size: 12px;');
            console.log('%c💡 To create demo project, type: testSuite.runDemoProject()\n', 'color: #666; font-size: 12px;');
            
            // Auto-run on first load (optional)
            // testSuite.runAll();
        }, 1000);
    });
}
