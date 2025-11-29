/* Panel + PanelManager extracted from inline script */
class Panel {
    constructor(content) {
        // content may be a DOM element or a jQuery object
        this.content = content;
        this.label = '';
        this.isVisible = true;
    }
}

class PanelManager {
    constructor(settings, container) {
        this.settings = settings;
        this.container = container;
        this.panelCount = 0;
        this.config = {
            settings: this.settings,
            content: [{
                labels: {
                    close: 'close',
                    maximise: 'maximise',
                    minimise: 'minimise',
                    popout: 'open in new window'
                },
                type: 'row',
                content: [
                    {
                        type: 'column',
                        content: [],
                        width: 10
                    },
                    {
                        type: 'column',
                        content: [],
                        width: 40
                    },
                    {
                        type: 'column',
                        content: [],
                        width: 10
                    }
                ]
            }]
        };
        this.panels = [];
        this.visibilityMap = new Map();
        this.GL = new GoldenLayout( this.config ,container);
        
        // Track when components are destroyed (panels closed)
        this.GL.on('itemDestroyed', (item) => {
            if (item.type === 'component') {
                this.visibilityMap.set(item.componentName, false);
                this.emitEvent('panelClosed', { panelId: item.componentName });
            }
        });
        
        // Track when items are created (panels opened)
        this.GL.on('itemCreated', (item) => {
            if (item.type === 'component') {
                this.visibilityMap.set(item.componentName, true);
                this.emitEvent('panelOpened', { panelId: item.componentName });
            }
        });
        
        this.GL.init();
        window.addEventListener('resize', () => this.GL.updateSize());
        
        this.listeners = {};
    }

    addPanel(panel, columnIndex = 1) {
        const panelId = panel.label || `panel-${this.panelCount++}`;
        const panelRef = panel; // closure reference used in component factory

        // register component using the unique panelId
        this.GL.registerComponent(panelId, function(container, componentState) {
            const element = container.getElement();
            element.empty();
            // support both jQuery and DOM element
            if (panelRef.content && panelRef.content.jquery) {
                element.append(panelRef.content);
            } else if (panelRef.content instanceof Element) {
                element.append(panelRef.content);
            } else {
                element.html(String(panelRef.content));
            }
        });

        const column = this.GL.root.contentItems[0].contentItems[columnIndex];
        column.addChild({
            type: 'component',
            componentName: panelId,
            componentState: { label: panel.label }
        });

        this.panels.push({ id: panelId, panel, label: panel.label });
        this.visibilityMap.set(panelId, true);
        return panelId;
    }

    // Get all panels with their current visibility status
    getAllPanels() {
        return this.panels.map(p => ({
            id: p.id,
            label: p.label,
            isVisible: this.visibilityMap.get(p.id) || false
        }));
    }

    // Check if a panel is currently visible
    isPanelVisible(panelId) {
        return this.visibilityMap.get(panelId) || false;
    }

    // Reopen a closed panel
    reopenPanel(panelId) {
        const panelEntry = this.panels.find(p => p.id === panelId);
        if (!panelEntry) return false;

        // Add panel back to the second column (columnIndex 1)
        const column = this.GL.root.contentItems[0].contentItems[1];
        column.addChild({
            type: 'component',
            componentName: panelId,
            componentState: { label: panelEntry.label }
        });

        return true;
    }

    // Event system
    on(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
    }

    emitEvent(eventName, data) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(callback => callback(data));
        }
    }

    // optional helper to get panel by id
    getPanelById(id) {
        return this.panels.find(p => p.id === id) || null;
    }
}
