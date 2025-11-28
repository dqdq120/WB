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
    elemB1.innerHTML = '<h2>Panel B</h2>';
    const panelB1 = new Panel($(elemB1));
    panelB1.label = 'B';
    panelManager.addPanel(panelB1, 0);

    const elemC1 = document.createElement('div');
    elemC1.innerHTML = '<h2>Panel C</h2>';
    const panelC1 = new Panel($(elemC1));
    panelC1.label = 'C';
    panelManager.addPanel(panelC1, 0);

    const elemA = document.createElement('div');
    elemA.innerHTML = '<h2>Panel A</h2>';
    const panelA = new Panel($(elemA));
    panelA.label = 'A';
    panelManager.addPanel(panelA, 1);

    const elemD = document.createElement('div');
    elemD.innerHTML = '<h2>Panel D</h2>';
    const panelB2 = new Panel($(elemD));
    panelB2.label = 'D';
    panelManager.addPanel(panelB2, 2);

    const elemE = document.createElement('div');
    elemE.innerHTML = '<h2>Panel E</h2>';
    const panelC2 = new Panel($(elemE));
    panelC2.label = 'E';
    panelManager.addPanel(panelC2, 2);
});
