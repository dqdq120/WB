class ThemeManager {
    constructor() {
        this.availableThemes = ['light', 'dark', 'blue', 'green', 'purple', 'high-contrast'];
        this.currentTheme = 'light';
    }

    init() {
        this.loadSavedTheme();
        this.setupThemeEventListeners();
    }

    switchTheme(themeName) {
        if (!this.availableThemes.includes(themeName)) {
            console.warn(`Theme '${themeName}' is not available`);
            return;
        }

        // Remove all theme classes
        document.body.classList.remove(...this.availableThemes.map(theme => `theme-${theme}`));
        
        // Add the selected theme class
        document.body.classList.add(`theme-${themeName}`);
        
        // Update current theme
        this.currentTheme = themeName;
        
        // Save theme preference to localStorage
        this.saveTheme(themeName);
        
        // Dispatch custom event for theme change
        this.dispatchThemeChangeEvent(themeName);
    }

    saveTheme(themeName) {
        localStorage.setItem('selectedTheme', themeName);
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme && this.availableThemes.includes(savedTheme)) {
            this.switchTheme(savedTheme);
        }
        this.updateThemeMenuIndicators();
    }

    setupThemeEventListeners() {
        document.querySelectorAll('#theme-dropdown .dropdown-item').forEach(item => {
            item.addEventListener('click', (event) => {
                const theme = event.currentTarget.dataset.theme;
                this.switchTheme(theme);
                this.updateThemeMenuIndicators();
            });
        });
    }

    updateThemeMenuIndicators() {
        document.querySelectorAll('#theme-dropdown .dropdown-item').forEach(item => {
            const theme = item.dataset.theme;
            if (theme === this.currentTheme) {
                item.classList.add('active-theme');
            } else {
                item.classList.remove('active-theme');
            }
        });
    }

    dispatchThemeChangeEvent(themeName) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: themeName }
        });
        document.dispatchEvent(event);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getAvailableThemes() {
        return [...this.availableThemes];
    }
}