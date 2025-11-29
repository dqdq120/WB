/**
 * Theme Presets and Theme Management
 * Centralized theme definitions for the application
 */

const THEME_PRESETS = {
    ocean: {
        name: '🌊 Ocean',
        '--primary-bg': '#0a1628',
        '--primary-fg': '#e0f2ff',
        '--primary-accent': '#00d9ff',
        '--topbar-bg': '#051224',
        '--menu-btn-bg': '#1e3a5f',
        '--menu-btn-color': '#00d9ff',
        '--menu-btn-border': '#00d9ff',
        '--menu-btn-hover-bg': '#2d5a8f',
        '--dropdown-bg': '#1a2f45',
        '--dropdown-border': '#00d9ff',
        '--dropdown-shadow': 'rgba(0, 217, 255, 0.3)',
        '--menu-option-color': '#e0f2ff',
        '--menu-option-hover-bg': '#2d5a8f',
        '--menu-title-color': '#00d9ff',
        '--layout-bg': '#051224',
        '--tab-bg': '#1e3a5f',
        '--tab-border': '#00d9ff',
        '--tab-active-border-top': '#00d9ff',
        '--tab-active-bg': '#051224',
        '--header-bg': '#051224',
        '--header-border': '#00d9ff',
        '--h2-color': '#e0f2ff',
        '--divider-color': '#00d9ff'
    },
    forest: {
        name: '🌲 Forest',
        '--primary-bg': '#1a2e1a',
        '--primary-fg': '#c8e6c9',
        '--primary-accent': '#4caf50',
        '--topbar-bg': '#0d1f0d',
        '--menu-btn-bg': '#2e5233',
        '--menu-btn-color': '#a5d6a7',
        '--menu-btn-border': '#4caf50',
        '--menu-btn-hover-bg': '#3d6b42',
        '--dropdown-bg': '#1f3a1f',
        '--dropdown-border': '#4caf50',
        '--dropdown-shadow': 'rgba(76, 175, 80, 0.3)',
        '--menu-option-color': '#c8e6c9',
        '--menu-option-hover-bg': '#3d6b42',
        '--menu-title-color': '#4caf50',
        '--layout-bg': '#0d1f0d',
        '--tab-bg': '#2e5233',
        '--tab-border': '#4caf50',
        '--tab-active-border-top': '#4caf50',
        '--tab-active-bg': '#0d1f0d',
        '--header-bg': '#0d1f0d',
        '--header-border': '#4caf50',
        '--h2-color': '#c8e6c9',
        '--divider-color': '#4caf50'
    },
    sunset: {
        name: '🌅 Sunset',
        '--primary-bg': '#2a1a0f',
        '--primary-fg': '#ffd9b3',
        '--primary-accent': '#ff6b35',
        '--topbar-bg': '#1a0f06',
        '--menu-btn-bg': '#5c3d1f',
        '--menu-btn-color': '#ffd9b3',
        '--menu-btn-border': '#ff6b35',
        '--menu-btn-hover-bg': '#7d5434',
        '--dropdown-bg': '#3d2817',
        '--dropdown-border': '#ff6b35',
        '--dropdown-shadow': 'rgba(255, 107, 53, 0.3)',
        '--menu-option-color': '#ffd9b3',
        '--menu-option-hover-bg': '#7d5434',
        '--menu-title-color': '#ff6b35',
        '--layout-bg': '#1a0f06',
        '--tab-bg': '#5c3d1f',
        '--tab-border': '#ff6b35',
        '--tab-active-border-top': '#ff6b35',
        '--tab-active-bg': '#1a0f06',
        '--header-bg': '#1a0f06',
        '--header-border': '#ff6b35',
        '--h2-color': '#ffd9b3',
        '--divider-color': '#ff6b35'
    },
    cyberpunk: {
        name: '⚡ Cyberpunk',
        '--primary-bg': '#0d0221',
        '--primary-fg': '#ff006e',
        '--primary-accent': '#8338ec',
        '--topbar-bg': '#050013',
        '--menu-btn-bg': '#3a0f5c',
        '--menu-btn-color': '#ff006e',
        '--menu-btn-border': '#8338ec',
        '--menu-btn-hover-bg': '#5a2f7c',
        '--dropdown-bg': '#1a0a2e',
        '--dropdown-border': '#8338ec',
        '--dropdown-shadow': 'rgba(131, 56, 236, 0.5)',
        '--menu-option-color': '#ff006e',
        '--menu-option-hover-bg': '#5a2f7c',
        '--menu-title-color': '#8338ec',
        '--layout-bg': '#050013',
        '--tab-bg': '#3a0f5c',
        '--tab-border': '#8338ec',
        '--tab-active-border-top': '#ff006e',
        '--tab-active-bg': '#050013',
        '--header-bg': '#050013',
        '--header-border': '#8338ec',
        '--h2-color': '#ff006e',
        '--divider-color': '#8338ec'
    },
    minimalist: {
        name: '✨ Minimalist',
        '--primary-bg': '#ffffff',
        '--primary-fg': '#333333',
        '--primary-accent': '#0066cc',
        '--topbar-bg': '#f0f0f0',
        '--menu-btn-bg': '#e0e0e0',
        '--menu-btn-color': '#333333',
        '--menu-btn-border': '#cccccc',
        '--menu-btn-hover-bg': '#d0d0d0',
        '--dropdown-bg': '#f5f5f5',
        '--dropdown-border': '#cccccc',
        '--dropdown-shadow': 'rgba(0, 0, 0, 0.1)',
        '--menu-option-color': '#333333',
        '--menu-option-hover-bg': '#e8e8e8',
        '--menu-title-color': '#666666',
        '--layout-bg': '#ffffff',
        '--tab-bg': '#e8e8e8',
        '--tab-border': '#cccccc',
        '--tab-active-border-top': '#0066cc',
        '--tab-active-bg': '#ffffff',
        '--header-bg': '#f0f0f0',
        '--header-border': '#cccccc',
        '--h2-color': '#333333',
        '--divider-color': '#e0e0e0'
    },
    nord: {
        name: '❄️ Nord',
        '--primary-bg': '#2e3440',
        '--primary-fg': '#eceff4',
        '--primary-accent': '#88c0d0',
        '--topbar-bg': '#1a1f2e',
        '--menu-btn-bg': '#3b4252',
        '--menu-btn-color': '#88c0d0',
        '--menu-btn-border': '#88c0d0',
        '--menu-btn-hover-bg': '#434c5e',
        '--dropdown-bg': '#2e3440',
        '--dropdown-border': '#88c0d0',
        '--dropdown-shadow': 'rgba(136, 192, 208, 0.2)',
        '--menu-option-color': '#eceff4',
        '--menu-option-hover-bg': '#434c5e',
        '--menu-title-color': '#88c0d0',
        '--layout-bg': '#1a1f2e',
        '--tab-bg': '#3b4252',
        '--tab-border': '#88c0d0',
        '--tab-active-border-top': '#81a1c1',
        '--tab-active-bg': '#1a1f2e',
        '--header-bg': '#1a1f2e',
        '--header-border': '#88c0d0',
        '--h2-color': '#eceff4',
        '--divider-color': '#3b4252'
    },
    dracula: {
        name: '🧛 Dracula',
        '--primary-bg': '#282a36',
        '--primary-fg': '#f8f8f2',
        '--primary-accent': '#ff79c6',
        '--topbar-bg': '#1e1f29',
        '--menu-btn-bg': '#44475a',
        '--menu-btn-color': '#ff79c6',
        '--menu-btn-border': '#ff79c6',
        '--menu-btn-hover-bg': '#6272a4',
        '--dropdown-bg': '#1e1f29',
        '--dropdown-border': '#ff79c6',
        '--dropdown-shadow': 'rgba(255, 121, 198, 0.3)',
        '--menu-option-color': '#f8f8f2',
        '--menu-option-hover-bg': '#6272a4',
        '--menu-title-color': '#ff79c6',
        '--layout-bg': '#1e1f29',
        '--tab-bg': '#44475a',
        '--tab-border': '#ff79c6',
        '--tab-active-border-top': '#8be9fd',
        '--tab-active-bg': '#1e1f29',
        '--header-bg': '#1e1f29',
        '--header-border': '#ff79c6',
        '--h2-color': '#f8f8f2',
        '--divider-color': '#44475a'
    },
    monokai: {
        name: '🎹 Monokai',
        '--primary-bg': '#272822',
        '--primary-fg': '#f8f8f2',
        '--primary-accent': '#66d9ef',
        '--topbar-bg': '#1e1f1c',
        '--menu-btn-bg': '#49483e',
        '--menu-btn-color': '#66d9ef',
        '--menu-btn-border': '#66d9ef',
        '--menu-btn-hover-bg': '#3e3d32',
        '--dropdown-bg': '#1e1f1c',
        '--dropdown-border': '#66d9ef',
        '--dropdown-shadow': 'rgba(102, 217, 239, 0.2)',
        '--menu-option-color': '#f8f8f2',
        '--menu-option-hover-bg': '#3e3d32',
        '--menu-title-color': '#a1efe4',
        '--layout-bg': '#1e1f1c',
        '--tab-bg': '#49483e',
        '--tab-border': '#66d9ef',
        '--tab-active-border-top': '#f92672',
        '--tab-active-bg': '#1e1f1c',
        '--header-bg': '#1e1f1c',
        '--header-border': '#66d9ef',
        '--h2-color': '#f8f8f2',
        '--divider-color': '#49483e'
    },
    solarized_light: {
        name: '☀️ Solarized Light',
        '--primary-bg': '#fdf6e3',
        '--primary-fg': '#657b83',
        '--primary-accent': '#268bd2',
        '--topbar-bg': '#eee8d5',
        '--menu-btn-bg': '#eee8d5',
        '--menu-btn-color': '#268bd2',
        '--menu-btn-border': '#93a1a1',
        '--menu-btn-hover-bg': '#d6cec2',
        '--dropdown-bg': '#fdf6e3',
        '--dropdown-border': '#93a1a1',
        '--dropdown-shadow': 'rgba(0, 43, 54, 0.1)',
        '--menu-option-color': '#657b83',
        '--menu-option-hover-bg': '#eee8d5',
        '--menu-title-color': '#859900',
        '--layout-bg': '#fdf6e3',
        '--tab-bg': '#eee8d5',
        '--tab-border': '#93a1a1',
        '--tab-active-border-top': '#268bd2',
        '--tab-active-bg': '#fdf6e3',
        '--header-bg': '#eee8d5',
        '--header-border': '#93a1a1',
        '--h2-color': '#657b83',
        '--divider-color': '#d6cec2'
    },
    solarized_dark: {
        name: '🌙 Solarized Dark',
        '--primary-bg': '#002b36',
        '--primary-fg': '#839496',
        '--primary-accent': '#268bd2',
        '--topbar-bg': '#001f27',
        '--menu-btn-bg': '#073642',
        '--menu-btn-color': '#268bd2',
        '--menu-btn-border': '#268bd2',
        '--menu-btn-hover-bg': '#094656',
        '--dropdown-bg': '#001f27',
        '--dropdown-border': '#268bd2',
        '--dropdown-shadow': 'rgba(38, 139, 210, 0.2)',
        '--menu-option-color': '#839496',
        '--menu-option-hover-bg': '#094656',
        '--menu-title-color': '#2aa198',
        '--layout-bg': '#001f27',
        '--tab-bg': '#073642',
        '--tab-border': '#268bd2',
        '--tab-active-border-top': '#2aa198',
        '--tab-active-bg': '#001f27',
        '--header-bg': '#001f27',
        '--header-border': '#268bd2',
        '--h2-color': '#839496',
        '--divider-color': '#073642'
    },
    gruvbox_dark: {
        name: '🍂 Gruvbox Dark',
        '--primary-bg': '#282828',
        '--primary-fg': '#ebdbb2',
        '--primary-accent': '#8ec07c',
        '--topbar-bg': '#1d2021',
        '--menu-btn-bg': '#3c3836',
        '--menu-btn-color': '#8ec07c',
        '--menu-btn-border': '#8ec07c',
        '--menu-btn-hover-bg': '#504945',
        '--dropdown-bg': '#1d2021',
        '--dropdown-border': '#8ec07c',
        '--dropdown-shadow': 'rgba(142, 192, 124, 0.2)',
        '--menu-option-color': '#ebdbb2',
        '--menu-option-hover-bg': '#504945',
        '--menu-title-color': '#d3869b',
        '--layout-bg': '#1d2021',
        '--tab-bg': '#3c3836',
        '--tab-border': '#8ec07c',
        '--tab-active-border-top': '#fe8019',
        '--tab-active-bg': '#1d2021',
        '--header-bg': '#1d2021',
        '--header-border': '#8ec07c',
        '--h2-color': '#ebdbb2',
        '--divider-color': '#3c3836'
    },
    one_dark: {
        name: '◆ One Dark',
        '--primary-bg': '#282c34',
        '--primary-fg': '#abb2bf',
        '--primary-accent': '#61afef',
        '--topbar-bg': '#21252b',
        '--menu-btn-bg': '#3e4451',
        '--menu-btn-color': '#61afef',
        '--menu-btn-border': '#61afef',
        '--menu-btn-hover-bg': '#4a5367',
        '--dropdown-bg': '#21252b',
        '--dropdown-border': '#61afef',
        '--dropdown-shadow': 'rgba(97, 175, 239, 0.2)',
        '--menu-option-color': '#abb2bf',
        '--menu-option-hover-bg': '#4a5367',
        '--menu-title-color': '#56b6c2',
        '--layout-bg': '#21252b',
        '--tab-bg': '#3e4451',
        '--tab-border': '#61afef',
        '--tab-active-border-top': '#e06c75',
        '--tab-active-bg': '#21252b',
        '--header-bg': '#21252b',
        '--header-border': '#61afef',
        '--h2-color': '#abb2bf',
        '--divider-color': '#3e4451'
    },
    tokyo_night: {
        name: '🌃 Tokyo Night',
        '--primary-bg': '#1a1b26',
        '--primary-fg': '#c0caf5',
        '--primary-accent': '#7aa2f7',
        '--topbar-bg': '#16161e',
        '--menu-btn-bg': '#292e42',
        '--menu-btn-color': '#7aa2f7',
        '--menu-btn-border': '#7aa2f7',
        '--menu-btn-hover-bg': '#3b3f52',
        '--dropdown-bg': '#16161e',
        '--dropdown-border': '#7aa2f7',
        '--dropdown-shadow': 'rgba(122, 162, 247, 0.2)',
        '--menu-option-color': '#c0caf5',
        '--menu-option-hover-bg': '#3b3f52',
        '--menu-title-color': '#9ece6a',
        '--layout-bg': '#16161e',
        '--tab-bg': '#292e42',
        '--tab-border': '#7aa2f7',
        '--tab-active-border-top': '#f7768e',
        '--tab-active-bg': '#16161e',
        '--header-bg': '#16161e',
        '--header-border': '#7aa2f7',
        '--h2-color': '#c0caf5',
        '--divider-color': '#292e42'
    },
    material_dark: {
        name: '⬢ Material Dark',
        '--primary-bg': '#263238',
        '--primary-fg': '#eeffff',
        '--primary-accent': '#64b5f6',
        '--topbar-bg': '#1a1f2e',
        '--menu-btn-bg': '#37474f',
        '--menu-btn-color': '#64b5f6',
        '--menu-btn-border': '#64b5f6',
        '--menu-btn-hover-bg': '#455a64',
        '--dropdown-bg': '#1a1f2e',
        '--dropdown-border': '#64b5f6',
        '--dropdown-shadow': 'rgba(100, 181, 246, 0.2)',
        '--menu-option-color': '#eeffff',
        '--menu-option-hover-bg': '#455a64',
        '--menu-title-color': '#81c784',
        '--layout-bg': '#1a1f2e',
        '--tab-bg': '#37474f',
        '--tab-border': '#64b5f6',
        '--tab-active-border-top': '#ff9800',
        '--tab-active-bg': '#1a1f2e',
        '--header-bg': '#1a1f2e',
        '--header-border': '#64b5f6',
        '--h2-color': '#eeffff',
        '--divider-color': '#37474f'
    }
};

/**
 * Set custom theme variables directly via CSS variables
 * @param {Object} colorVars - Object with CSS variable names and their values
 * Example: setCustomTheme({ 'menu-btn-bg': '#ff0000', 'primary-bg': '#000000' })
 */
function setCustomTheme(colorVars) {
    const root = document.documentElement;
    Object.keys(colorVars).forEach(varName => {
        const cssVarName = varName.startsWith('--') ? varName : `--${varName}`;
        root.style.setProperty(cssVarName, colorVars[varName]);
    });
    localStorage.setItem('customTheme', JSON.stringify(colorVars));
    document.body.classList.remove('dark-theme', 'light-theme');
}

/**
 * Get current theme variables
 * @returns {Object} Object with all CSS variables and their values
 */
function getCurrentTheme() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const theme = {};
    
    // Get all CSS variables used in the theme
    const variables = [
        '--primary-bg', '--primary-fg', '--primary-accent',
        '--topbar-bg', '--menu-btn-bg', '--menu-btn-color', '--menu-btn-border',
        '--menu-btn-hover-bg', '--dropdown-bg', '--dropdown-border',
        '--menu-option-color', '--menu-option-hover-bg', '--menu-title-color',
        '--visible-panel-opacity', '--hidden-panel-opacity', '--layout-bg',
        '--tab-height', '--tab-border', '--tab-bg', '--tab-active-border-top',
        '--tab-active-bg', '--header-height', '--header-bg', '--header-border',
        '--header-text-color', '--h2-color', '--divider-color'
    ];
    
    variables.forEach(varName => {
        theme[varName] = computedStyle.getPropertyValue(varName).trim();
    });
    
    return theme;
}

/**
 * Reset theme to default (dark or light)
 * @param {String} theme - 'dark' or 'light'
 */
function resetTheme(theme = 'dark') {
    const root = document.documentElement;
    // Remove all inline styles to revert to stylesheet defaults
    root.style.cssText = '';
    switchTheme(theme);
    localStorage.removeItem('customTheme');
}

/**
 * Create and apply a preset theme
 * @param {String} presetName - Name of preset (e.g., 'ocean', 'forest', 'sunset', 'cyberpunk')
 */
function applyPresetTheme(presetName) {
    if (THEME_PRESETS[presetName]) {
        const preset = { ...THEME_PRESETS[presetName] };
        delete preset.name; // Remove the name property before applying
        setCustomTheme(preset);
        localStorage.setItem('theme', 'custom');
        document.body.classList.remove('dark-theme', 'light-theme');
    } else {
        console.warn(`Theme preset "${presetName}" not found. Available presets: ${Object.keys(THEME_PRESETS).join(', ')}`);
    }
}

/**
 * Load custom theme from localStorage if available
 */
function loadCustomTheme() {
    const customTheme = localStorage.getItem('customTheme');
    if (customTheme) {
        try {
            const theme = JSON.parse(customTheme);
            setCustomTheme(theme);
        } catch (e) {
            console.warn('Failed to load custom theme:', e);
        }
    }
}

/**
 * Get all available theme presets
 * @returns {Array} Array of preset names
 */
function getAvailableThemes() {
    return Object.keys(THEME_PRESETS);
}

/**
 * Get theme preset by name with display name
 * @param {String} presetName - Name of the preset
 * @returns {Object} Preset object with name and colors
 */
function getThemePreset(presetName) {
    return THEME_PRESETS[presetName] || null;
}
