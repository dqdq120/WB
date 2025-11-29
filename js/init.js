document.addEventListener("DOMContentLoaded", function() {
    const layoutContainer = document.getElementById('layout-root');
    const panelManager = new PanelManager({
        hasHeaders: true,
        constrainDragToContainer: true,
        reorderEnabled: true,
        selectionEnabled: false,
        popoutWholeStack: false,
        blockedPopoutsThrowError: true,
        closePopoutsOnUnload: true,
        showPopoutIcon: false,
        showMaximiseIcon: false,
        showCloseIcon: true
    }, layoutContainer);

    // Create actual DOM elements and pass them to Panel instances
    const elemB1 = document.createElement('div');
    elemB1.innerHTML = '<h2>Panel</h2>';
    const panelB1 = new Panel($(elemB1)); 
    panelB1.label = 'add';
    panelManager.addPanel(panelB1, 0);

    const elemC1 = document.createElement('div');
    elemC1.innerHTML = '<h2>Panel</h2>';
    const panelC1 = new Panel($(elemC1));
    panelC1.label = 'treeNode';
    panelManager.addPanel(panelC1, 0);

    const elemA = document.createElement('div');
    elemA.innerHTML = '<h2>Panel A</h2>';
    const panelA = new Panel($(elemA));
    panelA.label = 'pageName';
    panelManager.addPanel(panelA, 1);

    const elemD = document.createElement('div');
    elemD.innerHTML = '<h2>Panel D</h2>';
    const panelB2 = new Panel($(elemD));
    panelB2.label = 'attributes';
    panelManager.addPanel(panelB2, 2);

    const elemE = document.createElement('div');
    elemE.innerHTML = '<h2>Panel E</h2>';
    const panelC2 = new Panel($(elemE));
    panelC2.label = 'properties';
    panelManager.addPanel(panelC2, 2);

    // Initialize menus
    initializeMenus(panelManager);
});

function initializeMenus(panelManager) {
    const themBtn = document.getElementById('theme-btn');
    const themeDropdown = document.getElementById('theme-dropdown');
    const panelsBtn = document.getElementById('panels-btn');
    const panelsDropdown = document.getElementById('panels-dropdown');
    const panelsMenu = document.getElementById('panels-menu');
    const themeOptions = document.querySelectorAll('.theme-option');
    const presetOptions = document.querySelectorAll('.preset-option');

    // Theme Menu Toggle
    themBtn.addEventListener('click', () => {
        themeDropdown.classList.toggle('active');
        panelsDropdown.classList.remove('active');
        themBtn.classList.toggle('active');
        panelsBtn.classList.remove('active');
    });

    // Panels Menu Toggle
    panelsBtn.addEventListener('click', () => {
        panelsDropdown.classList.toggle('active');
        themeDropdown.classList.remove('active');
        panelsBtn.classList.toggle('active');
        themBtn.classList.remove('active');
        updatePanelsMenu(panelManager, panelsMenu);
    });

    // Theme switching
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            switchTheme(theme);
            themeDropdown.classList.remove('active');
            themBtn.classList.remove('active');
        });
    });

    // Preset theme switching
    presetOptions.forEach(option => {
        option.addEventListener('click', () => {
            const preset = option.getAttribute('data-preset');
            applyPresetTheme(preset);
            themeDropdown.classList.remove('active');
            themBtn.classList.remove('active');
        });
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        const menuContainers = document.querySelectorAll('#menu-container');
        let clickedInMenu = false;
        
        menuContainers.forEach(container => {
            if (container.contains(e.target)) {
                clickedInMenu = true;
            }
        });
        
        if (!clickedInMenu) {
            themeDropdown.classList.remove('active');
            panelsDropdown.classList.remove('active');
            themBtn.classList.remove('active');
            panelsBtn.classList.remove('active');
        }
    });

    // Listen for panel visibility changes
    panelManager.on('panelClosed', () => {
        updatePanelsMenu(panelManager, panelsMenu);
    });

    panelManager.on('panelOpened', () => {
        updatePanelsMenu(panelManager, panelsMenu);
    });
}

function updatePanelsMenu(panelManager, panelsMenu) {
    const allPanels = panelManager.getAllPanels();
    panelsMenu.innerHTML = '';

    allPanels.forEach(panelInfo => {
        const btn = document.createElement('button');
        btn.className = 'panel-option';
        btn.textContent = panelInfo.label;
        btn.setAttribute('data-panel-id', panelInfo.id);

        // Set opacity based on visibility
        if (panelInfo.isVisible) {
            btn.classList.add('visible-panel');
            btn.style.opacity = '0.5';
        } else {
            btn.classList.add('hidden-panel');
            btn.style.opacity = '1';
        }

        btn.addEventListener('click', () => {
            if (!panelInfo.isVisible) {
                panelManager.reopenPanel(panelInfo.id);
                panelsMenu.parentElement.parentElement.classList.remove('active');
            }
        });

        panelsMenu.appendChild(btn);
    });
}

function switchTheme(theme) {
    const body = document.body;
    body.classList.remove('dark-theme', 'light-theme');
    body.classList.add(theme + '-theme');
    localStorage.setItem('theme', theme);
    localStorage.setItem('customTheme', '');
}

// Load saved theme on page load
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    switchTheme(savedTheme);
    loadCustomTheme();
});
