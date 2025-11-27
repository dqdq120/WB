class PanelManager {
    constructor(layout) {
        this.layout = layout;
        this.allPanels = [
            { 
                id: 'left-top', 
                title: 'Left Top', 
                componentState: { title: 'Left Top' },
                originalPosition: {
                    parentType: 'column',
                    parentIndex: 0,
                    index: 0
                }
            },
            { 
                id: 'left-bottom', 
                title: 'Left Bottom', 
                componentState: { title: 'Left Bottom' },
                originalPosition: {
                    parentType: 'column',
                    parentIndex: 0,
                    index: 1
                }
            },
            { 
                id: 'center', 
                title: 'Center Big Panel', 
                componentState: { title: 'Center Big Panel' },
                originalPosition: {
                    parentType: 'row',
                    index: 1
                }
            },
            { 
                id: 'right-top', 
                title: 'Right Top', 
                componentState: { title: 'Right Top' },
                originalPosition: {
                    parentType: 'column',
                    parentIndex: 2,
                    index: 0
                }
            },
            { 
                id: 'right-bottom', 
                title: 'Right Bottom', 
                componentState: { title: 'Right Bottom' },
                originalPosition: {
                    parentType: 'column',
                    parentIndex: 2,
                    index: 1
                }
            }
        ];
        this.closedPanels = [];
        this.panelUpdateCallback = null;
    }

    init() {
        this.setupCloseListeners();
    }

    setupCloseListeners() {
        this.layout.on('itemDestroyed', (component) => {
            if (component.config && component.config.id) {
                this.handlePanelClose(component.config.id);
            }
        });
    }

    handlePanelClose(panelId) {
        const panel = this.allPanels.find(p => p.id === panelId);
        
        if (panel && !this.closedPanels.find(p => p.id === panelId)) {
            this.closedPanels.push(panel);
            this.notifyPanelUpdate();
        }
    }

    reopenPanel(panelId) {
        const panel = this.closedPanels.find(p => p.id === panelId);
        if (!panel) return false;

        const position = panel.originalPosition;
        const rootContent = this.layout.root.contentItems[0];
        
        try {
            if (position.parentType === 'row') {
                // For center panel (direct child of row)
                rootContent.addChild({
                    type: 'component',
                    width: 60,
                    componentName: 'panel',
                    componentState: panel.componentState,
                    id: panel.id
                }, position.index);
            } else if (position.parentType === 'column') {
                // For left/right panels (children of columns)
                const parentColumn = rootContent.contentItems[position.parentIndex];
                parentColumn.addChild({
                    type: 'component',
                    componentName: 'panel',
                    componentState: panel.componentState,
                    id: panel.id
                }, position.index);
            }
            
            // Remove from closed panels
            this.closedPanels = this.closedPanels.filter(p => p.id !== panelId);
            this.notifyPanelUpdate();
            return true;
        } catch (error) {
            console.error('Error reopening panel:', error);
            return false;
        }
    }

    setPanelUpdateCallback(callback) {
        this.panelUpdateCallback = callback;
    }

    notifyPanelUpdate() {
        if (this.panelUpdateCallback) {
            this.panelUpdateCallback(this.getClosedPanels());
        }
    }

    getClosedPanels() {
        return [...this.closedPanels];
    }

    getAllPanels() {
        return [...this.allPanels];
    }

    isPanelClosed(panelId) {
        return this.closedPanels.some(panel => panel.id === panelId);
    }
}