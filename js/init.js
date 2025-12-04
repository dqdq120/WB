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

    // ===== ADD PANEL =====
    const elemB1 = document.createElement('div');
    elemB1.className = 'add-panel-container';
    elemB1.innerHTML = '<h2>Add Elements</h2><div class="add-elements-list"></div>';
    const panelB1 = new Panel($(elemB1)); 
    panelB1.label = 'add';
    panelManager.addPanel(panelB1, 0);

    // ===== TREE NODE PANEL =====
    const elemC1 = document.createElement('div');
    elemC1.className = 'tree-panel-container';
    elemC1.innerHTML = '<h2>Elements</h2><div class="tree-elements-list"></div>';
    const panelC1 = new Panel($(elemC1));
    panelC1.label = 'treeNode';
    panelManager.addPanel(panelC1, 0);

    // ===== CANVAS PANEL =====
    const elemA = document.createElement('div');
    elemA.className = 'canvas-container';
    elemA.innerHTML = '<div class="canvas"></div>';
    const panelA = new Panel($(elemA));
    panelA.label = 'canvas';
    panelManager.addPanel(panelA, 1);

    // ===== ATTRIBUTES PANEL =====
    const elemD = document.createElement('div');
    elemD.className = 'attributes-panel-wrapper';
    const panelB2 = new Panel($(elemD));
    panelB2.label = 'attributes';
    panelManager.addPanel(panelB2, 2);

    // ===== PROPERTIES PANEL =====
    const elemE = document.createElement('div');
    elemE.className = 'properties-panel-wrapper';
    const panelC2 = new Panel($(elemE));
    panelC2.label = 'properties';
    panelManager.addPanel(panelC2, 2);

    // ===== INITIALIZE EDITOR SYSTEMS =====
    const canvas = document.querySelector('.canvas');
    const elementManager = new ElementManager(canvas);
    const propertyPanel = new PropertyPanel(elemE);
    const elementPropertiesPanel = new ElementPropertiesPanel(elemD);

    // Keep reference to this

    // Listen for Delete key globally
    document.addEventListener("keydown", (e) => {
        if (e.key === "Delete") {
            elementManager.deleteSelected();
            e.preventDefault();
        }
    });

    // ===== POPULATE ADD PANEL WITH DRAGGABLE ELEMENTS =====
    const elementTypes = [
        { type: 'div', icon: '📦', label: 'Div' },
        { type: 'p', icon: '📝', label: 'Paragraph' },
        { type: 'h1', icon: '📄', label: 'Heading 1' },
        { type: 'h2', icon: '📃', label: 'Heading 2' },
        { type: 'h3', icon: '📋', label: 'Heading 3' },
        { type: 'button', icon: '🔘', label: 'Button' },
        { type: 'input', icon: '⌨️', label: 'Input' },
        { type: 'label', icon: '🏷️', label: 'Label' },
        { type: 'span', icon: '✂️', label: 'Span' },
        { type: 'a', icon: '🔗', label: 'Link' },
        { type: 'img', icon: '🖼️', label: 'Image' },
        { type: 'ul', icon: '📋', label: 'List' },
        { type: 'li', icon: '•', label: 'List Item' }
    ];

    const addElementsList = document.querySelector('.add-elements-list');
    elementTypes.forEach(elem => {
        const btn = document.createElement('div');
        btn.className = 'add-element-btn';
        btn.draggable = true;
        btn.innerHTML = `<span class="elem-icon">${elem.icon}</span><span class="elem-label">${elem.label}</span>`;
        btn.setAttribute('data-element-type', elem.type);

        btn.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('text/plain', elem.type);
        });

        addElementsList.appendChild(btn);
    });

    // ===== HANDLE ELEMENT SELECTION (single and multi) =====
    window.addEventListener('selectionChanged', (e) => {
        const elements = e.detail.elements || [];
        if (elements && elements.length) {
            propertyPanel.setElements(elements);
            elementPropertiesPanel.setElements(elements);
        } else {
            propertyPanel.clear();
            elementPropertiesPanel.clear();
        }
        updateTreePanel(elementManager, document.querySelector('.tree-elements-list'));
    });

    // ===== HANDLE ELEMENT(S) DELETION =====
    window.addEventListener('elementDeleted', (e) => {
        if (e.detail.element) {
            elementManager.removeElement(e.detail.element);
            propertyPanel.clear();
            elementPropertiesPanel.clear();
            updateTreePanel(elementManager, document.querySelector('.tree-elements-list'));
        }
    });

    window.addEventListener('elementsDeleted', (e) => {
        const elements = e.detail.elements || [];
        if (elements.length) {
            elements.forEach(el => elementManager.removeElement(el));
            propertyPanel.clear();
            elementPropertiesPanel.clear();
            updateTreePanel(elementManager, document.querySelector('.tree-elements-list'));
        }
    });

    // ===== UPDATE TREE PANEL (nested) =====
    function updateTreePanel(manager, treeContainer) {
        treeContainer.innerHTML = '';

        const roots = manager.getRootElements();

        function renderNode(elem, parentEl, level = 0) {
            const treeItem = document.createElement('div');
            treeItem.className = 'tree-item';
            treeItem.style.paddingLeft = (8 + level * 12) + 'px';
            if (elem.isSelected) treeItem.classList.add('selected');
            treeItem.draggable = true;
            treeItem.dataset.elementId = elem.id;

            const label = document.createElement('span');
            label.className = 'tree-item-label';
            label.textContent = `${elem.type} (${elem.id})`;

            label.addEventListener('click', (ev) => {
                const additive = ev.ctrlKey || ev.metaKey;
                manager.selectElement(elem, additive);
            });

            treeItem.appendChild(label);

            // Tree drag to reparent
            treeItem.addEventListener('dragstart', (ev) => {
                ev.dataTransfer.effectAllowed = 'move';
                ev.dataTransfer.setData('text/elem-id', elem.id);
                treeItem.style.opacity = '0.5';
            });

            treeItem.addEventListener('dragend', (ev) => {
                treeItem.style.opacity = '1';
            });

            treeItem.addEventListener('dragover', (ev) => {
                ev.preventDefault();
                ev.dataTransfer.dropEffect = 'move';
                treeItem.style.backgroundColor = 'rgba(0, 102, 204, 0.2)';
            });

            treeItem.addEventListener('dragleave', (ev) => {
                treeItem.style.backgroundColor = '';
            });

            treeItem.addEventListener('drop', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                treeItem.style.backgroundColor = '';
                const draggedId = ev.dataTransfer.getData('text/elem-id');
                const draggedEl = manager.elements.find(e => e.id === draggedId);
                if (draggedEl && draggedEl !== elem) {
                    manager.reparentElement(draggedEl, elem);
                    updateTreePanel(manager, document.querySelector('.tree-elements-list'));
                }
            });

            parentEl.appendChild(treeItem);

            if (elem.children && elem.children.length) {
                elem.children.forEach(child => renderNode(child, parentEl, level + 1));
            }
        }

        roots.forEach(r => renderNode(r, treeContainer, 0));
    }

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
