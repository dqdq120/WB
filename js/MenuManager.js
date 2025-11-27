class MenuManager {
    constructor() {
        this.dropdowns = new Map();
    }

    init() {
        this.setupMenuEventListeners();
        this.setupFileMenu();
    }

    setupMenuEventListeners() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (event) => {
                event.stopPropagation();
                const dropdown = event.currentTarget.querySelector('.dropdown');
                this.toggleDropdown(dropdown);
            });
        });

        // Close dropdowns when clicking elsewhere
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });
    }

    toggleDropdown(dropdown) {
        // Close all other dropdowns
        this.closeAllDropdowns();
        
        // Toggle current dropdown
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'block';
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }

    setupFileMenu() {
        document.getElementById('save-option').addEventListener('click', () => {
            this.handleSave();
        });
        
        document.getElementById('open-option').addEventListener('click', () => {
            this.handleOpen();
        });
        
        document.getElementById('export-option').addEventListener('click', () => {
            this.handleExport();
        });
    }

    updateWindowMenu(closedPanels) {
        const windowDropdown = document.getElementById('window-dropdown');
        windowDropdown.innerHTML = '';
        
        if (closedPanels.length === 0) {
            const noItems = document.createElement('div');
            noItems.className = 'dropdown-item';
            noItems.textContent = 'No closed panels';
            noItems.style.color = '#999';
            noItems.style.cursor = 'default';
            windowDropdown.appendChild(noItems);
        } else {
            closedPanels.forEach(panel => {
                const menuItem = document.createElement('div');
                menuItem.className = 'dropdown-item';
                menuItem.textContent = panel.title;
                menuItem.dataset.panelId = panel.id;
                menuItem.addEventListener('click', () => {
                    this.dispatchPanelReopenEvent(panel.id);
                });
                windowDropdown.appendChild(menuItem);
            });
        }
    }

    dispatchPanelReopenEvent(panelId) {
        const event = new CustomEvent('reopenPanel', {
            detail: { panelId: panelId }
        });
        document.dispatchEvent(event);
    }

    handleSave() {
        alert('Save functionality would be implemented here');
        // Implementation for save functionality
    }

    handleOpen() {
        alert('Open functionality would be implemented here');
        // Implementation for open functionality
    }

    handleExport() {
        alert('Export functionality would be implemented here');
        // Implementation for export functionality
    }
}