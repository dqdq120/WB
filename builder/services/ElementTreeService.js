/**
 * ElementTree Service - Manages the DOM tree view and node operations
 */
class ElementTreeService {
    constructor() {
        this.project = null;
        this.selectedNodes = [];
        this.treeContainer = null;
    }

    init(project, containerSelector) {
        this.project = project;
        this.treeContainer = document.querySelector(containerSelector);
        this.render();
    }

    render() {
        if (!this.treeContainer || !this.project) return;
        
        this.treeContainer.innerHTML = '';
        const treeElement = this.createTreeNode(this.project.rootElement);
        this.treeContainer.appendChild(treeElement);
    }

    createTreeNode(element, level = 0) {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'tree-node';
        nodeDiv.dataset.elementId = element.id;
        nodeDiv.style.paddingLeft = (level * 20) + 'px';

        const header = document.createElement('div');
        header.className = `tree-node-header ${element.isSelected ? 'selected' : ''}`;
        
        // Toggle expand/collapse
        if (element.children.length > 0) {
            const toggle = document.createElement('span');
            toggle.className = 'tree-toggle';
            toggle.textContent = '▼';
            toggle.onclick = (e) => {
                e.stopPropagation();
                this.toggleExpanded(nodeDiv);
            };
            header.appendChild(toggle);
        } else {
            const spacer = document.createElement('span');
            spacer.className = 'tree-toggle-spacer';
            header.appendChild(spacer);
        }

        // Element icon and name
        const label = document.createElement('span');
        label.className = 'tree-label';
        label.textContent = `${element.name} (${element.type})`;
        header.appendChild(label);

        // Visibility toggle
        const visibilityBtn = document.createElement('button');
        visibilityBtn.className = 'tree-btn tree-visibility-btn';
        visibilityBtn.textContent = element.isVisible ? '👁️' : '❌';
        visibilityBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleVisibility(element.id);
        };
        header.appendChild(visibilityBtn);

        // Lock toggle
        const lockBtn = document.createElement('button');
        lockBtn.className = 'tree-btn tree-lock-btn';
        lockBtn.textContent = element.isLocked ? '🔒' : '🔓';
        lockBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleLock(element.id);
        };
        header.appendChild(lockBtn);

        // Select on click
        header.onclick = (e) => {
            e.stopPropagation();
            this.selectNode(element.id, e.ctrlKey || e.metaKey, e.shiftKey);
        };

        nodeDiv.appendChild(header);

        // Children
        if (element.children.length > 0) {
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'tree-children';
            element.children.forEach(child => {
                childrenDiv.appendChild(this.createTreeNode(child, level + 1));
            });
            nodeDiv.appendChild(childrenDiv);
        }

        return nodeDiv;
    }

    selectNode(elementId, multiSelect = false, range = false) {
        if (!multiSelect) {
            this.selectedNodes = [elementId];
        } else if (!this.selectedNodes.includes(elementId)) {
            this.selectedNodes.push(elementId);
        }

        this.updateTreeSelection();
        document.dispatchEvent(new CustomEvent('elementSelected', { 
            detail: { selectedIds: this.selectedNodes } 
        }));
    }

    updateTreeSelection() {
        this.treeContainer.querySelectorAll('.tree-node-header').forEach(header => {
            const elementId = header.parentElement.dataset.elementId;
            if (this.selectedNodes.includes(elementId)) {
                header.classList.add('selected');
            } else {
                header.classList.remove('selected');
            }
        });
    }

    toggleExpanded(nodeDiv) {
        const childrenDiv = nodeDiv.querySelector('.tree-children');
        if (childrenDiv) {
            childrenDiv.style.display = childrenDiv.style.display === 'none' ? 'block' : 'none';
        }
    }

    toggleVisibility(elementId) {
        const element = this.project.findElementById(elementId);
        if (element) {
            element.isVisible = !element.isVisible;
            this.render();
        }
    }

    toggleLock(elementId) {
        const element = this.project.findElementById(elementId);
        if (element) {
            element.isLocked = !element.isLocked;
            this.render();
        }
    }

    getSelectedElements() {
        return this.selectedNodes.map(id => this.project.findElementById(id)).filter(e => e);
    }

    deleteSelected() {
        this.selectedNodes.forEach(id => {
            this.project.deleteElement(id);
        });
        this.selectedNodes = [];
        this.render();
    }

    duplicateSelected() {
        const newIds = [];
        this.selectedNodes.forEach(id => {
            const duplicate = this.project.duplicateElement(id);
            if (duplicate) newIds.push(duplicate.id);
        });
        this.selectedNodes = newIds;
        this.render();
    }
}
