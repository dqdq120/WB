/* Panel + PanelManager extracted from inline script */
class Panel {
    constructor(content) {
        // content may be a DOM element or a jQuery object
        this.content = content;
        this.label = '';
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
                        width: 30
                    },
                    {
                        type: 'column',
                        content: [],
                        width: 40
                    },
                    {
                        type: 'column',
                        content: [],
                        width: 30
                    }
                ]
            }]
        };
        this.panels = [];
        this.GL = new GoldenLayout( this.config ,container);
        this.GL.init();
        window.addEventListener('resize', () => this.GL.updateLayout());
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

        this.panels.push({ id: panelId, panel });
        return panelId;
    }

    // optional helper to get panel by id
    getPanelById(id) {
        return this.panels.find(p => p.id === id) || null;
    }
}
