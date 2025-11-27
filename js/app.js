class GoldenLayoutApp {
    constructor() {
        this.layout = null;
        this.themeManager = null;
        this.panelManager = null;
        this.menuManager = null;
    }

    init() {
        this.initializeLayout();
        this.initializeManagers();
        this.setupEventListeners();
    }

    initializeLayout() {
        const config = {
            settings: {
                showPopoutIcon: false,
                showMaximiseIcon: false,
                showCloseIcon: true
            },
            content: [{
                type: 'row',
                content: [
                    {
                        type: 'column',
                        width: 20,
                        content: [
                            { 
                                type: 'component', 
                                componentName: 'panel', 
                                componentState: { title: 'Left Top' },
                                id: 'left-top'
                            },
                            { 
                                type: 'component', 
                                componentName: 'panel', 
                                componentState: { title: 'Left Bottom' },
                                id: 'left-bottom'
                            }
                        ]
                    },
                    {
                        type: 'component',
                        width: 60,
                        componentName: 'panel',
                        componentState: { title: 'Center Big Panel' },
                        id: 'center'
                    },
                    {
                        type: 'column',
                        width: 20,
                        content: [
                            { 
                                type: 'component', 
                                componentName: 'panel', 
                                componentState: { title: 'Right Top' },
                                id: 'right-top'
                            },
                            { 
                                type: 'component', 
                                componentName: 'panel', 
                                componentState: { title: 'Right Bottom' },
                                id: 'right-bottom'
                            }
                        ]
                    }
                ]
            }]
        };

        // Create layout
        this.layout = new GoldenLayout(config, '#layout-root');
        
        // Register component using the global function
        this.layout.registerComponent('panel', window.PANEL_COMPONENT);
        
        // Initialize the layout
        this.layout.init();
    }

    initializeManagers() {
        // Initialize Panel Manager with layout
        this.panelManager = new PanelManager(this.layout);
        this.panelManager.init();

        // Initialize Theme Manager
        this.themeManager = new ThemeManager();
        this.themeManager.init();

        // Initialize Menu Manager
        this.menuManager = new MenuManager();
        this.menuManager.init();
    }

    setupEventListeners() {
        // Listen for panel reopen events
        document.addEventListener('reopenPanel', (event) => {
            const panelId = event.detail.panelId;
            this.panelManager.reopenPanel(panelId);
        });

        // Update window menu when panels change
        this.panelManager.setPanelUpdateCallback((closedPanels) => {
            this.menuManager.updateWindowMenu(closedPanels);
        });

        // Listen for theme changes
        document.addEventListener('themeChanged', (event) => {
            console.log(`Theme changed to: ${event.detail.theme}`);
        });

        // Handle window resize to update layout dimensions
        window.addEventListener('resize', () => {
            if (this.layout) {
                this.layout.updateSize();
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new GoldenLayoutApp();
    app.init();
});