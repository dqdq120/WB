/**
 * Asset Library Service - Integrates with external APIs for images, icons, fonts
 */
class AssetLibraryService {
    constructor() {
        this.imageAPI = new UnsplashAPI();
        this.iconAPI = new IconifyAPI();
        this.fontAPI = new GoogleFontsAPI();
    }

    getImageSearch(query, callback) {
        this.imageAPI.search(query, callback);
    }

    getIcons(query, callback) {
        this.iconAPI.search(query, callback);
    }

    getFonts(callback) {
        this.fontAPI.list(callback);
    }
}

/**
 * Unsplash API Wrapper
 */
class UnsplashAPI {
    constructor() {
        // Free access - no auth key needed for basic searches
        this.baseURL = 'https://api.unsplash.com';
        this.accessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // User should provide their own
    }

    search(query, callback) {
        const url = `${this.baseURL}/search/photos?query=${encodeURIComponent(query)}&per_page=20&client_id=${this.accessKey}`;
        
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const results = (data.results || []).map(photo => ({
                    id: photo.id,
                    title: photo.alt_description || 'Image',
                    url: photo.urls.small,
                    thumb: photo.urls.thumb,
                    full: photo.urls.full
                }));
                callback(results);
            })
            .catch(err => {
                console.error('Unsplash search failed:', err);
                callback([]);
            });
    }
}

/**
 * Iconify API Wrapper
 */
class IconifyAPI {
    constructor() {
        this.baseURL = 'https://api.iconify.design';
    }

    search(query, callback) {
        const url = `${this.baseURL}/search?query=${encodeURIComponent(query)}&limit=20`;
        
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const results = (data.icons || []).map(icon => ({
                    id: icon.icon,
                    name: icon.name,
                    icon: icon.icon,
                    collection: icon.collection
                }));
                callback(results);
            })
            .catch(err => {
                console.error('Iconify search failed:', err);
                callback([]);
            });
    }

    getIcon(iconName) {
        return `https://api.iconify.design/${iconName}.svg`;
    }
}

/**
 * Google Fonts API Wrapper
 */
class GoogleFontsAPI {
    constructor() {
        this.apiKey = 'YOUR_GOOGLE_FONTS_API_KEY'; // User should provide
        this.baseURL = 'https://www.googleapis.com/webfonts/v1';
        this.cachedFonts = null;
    }

    list(callback) {
        if (this.cachedFonts) {
            callback(this.cachedFonts);
            return;
        }

        const url = `${this.baseURL}/webfonts?key=${this.apiKey}&sort=popularity`;
        
        fetch(url)
            .then(res => res.json())
            .then(data => {
                this.cachedFonts = (data.items || []).map(font => ({
                    id: font.family,
                    name: font.family,
                    category: font.category,
                    variants: font.variants
                }));
                callback(this.cachedFonts);
            })
            .catch(err => {
                console.error('Google Fonts fetch failed:', err);
                // Return some default fonts if API fails
                callback(this.getDefaultFonts());
            });
    }

    getDefaultFonts() {
        return [
            { name: 'Arial', category: 'sans-serif' },
            { name: 'Times New Roman', category: 'serif' },
            { name: 'Courier New', category: 'monospace' },
            { name: 'Georgia', category: 'serif' },
            { name: 'Verdana', category: 'sans-serif' }
        ];
    }

    loadFont(fontName) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
}

/**
 * Modal for Asset Selection
 */
class AssetModal {
    constructor() {
        this.modal = this.createModal();
        this.assetService = new AssetLibraryService();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'asset-modal';
        modal.innerHTML = `
            <div class="modal-content" style="width: 80%; max-width: 900px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3>Select Asset</h3>
                    <button onclick="document.getElementById('asset-modal').classList.remove('show')" style="cursor: pointer; font-size: 20px;">✕</button>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 16px;">
                    <button class="asset-tab-btn active" onclick="this.switchTab('images')">Images</button>
                    <button class="asset-tab-btn" onclick="this.switchTab('icons')">Icons</button>
                    <button class="asset-tab-btn" onclick="this.switchTab('fonts')">Fonts</button>
                </div>
                <input type="text" id="asset-search" placeholder="Search..." style="width: 100%; padding: 8px; margin-bottom: 16px;">
                <div id="asset-results" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; max-height: 400px; overflow-y: auto;"></div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    show(type, callback) {
        this.callback = callback;
        this.currentType = type;
        this.modal.classList.add('show');
        this.loadAssets(type);
    }

    loadAssets(type) {
        const searchInput = document.getElementById('asset-search');
        const query = searchInput.value || 'popular';

        const resultsDiv = document.getElementById('asset-results');
        resultsDiv.innerHTML = '<p>Loading...</p>';

        if (type === 'images') {
            this.assetService.getImageSearch(query, (results) => this.displayImages(results));
        } else if (type === 'icons') {
            this.assetService.getIcons(query, (results) => this.displayIcons(results));
        } else if (type === 'fonts') {
            this.assetService.getFonts((fonts) => this.displayFonts(fonts));
        }
    }

    displayImages(images) {
        const resultsDiv = document.getElementById('asset-results');
        resultsDiv.innerHTML = '';

        images.forEach(img => {
            const card = document.createElement('div');
            card.style.cursor = 'pointer';
            card.style.border = '1px solid #ddd';
            card.style.borderRadius = '4px';
            card.style.overflow = 'hidden';
            card.innerHTML = `
                <img src="${img.thumb}" style="width: 100%; height: 100px; object-fit: cover;">
                <div style="padding: 4px; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${img.title}
                </div>
            `;
            card.onclick = () => {
                this.callback({ type: 'image', url: img.full });
                this.modal.classList.remove('show');
            };
            resultsDiv.appendChild(card);
        });
    }

    displayIcons(icons) {
        const resultsDiv = document.getElementById('asset-results');
        resultsDiv.innerHTML = '';

        icons.forEach(icon => {
            const card = document.createElement('div');
            card.style.cursor = 'pointer';
            card.style.border = '1px solid #ddd';
            card.style.borderRadius = '4px';
            card.style.padding = '8px';
            card.style.textAlign = 'center';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.alignItems = 'center';
            card.innerHTML = `
                <img src="${new IconifyAPI().getIcon(icon.icon)}" style="width: 40px; height: 40px; margin-bottom: 4px;">
                <div style="font-size: 11px; word-break: break-word;">${icon.name}</div>
            `;
            card.onclick = () => {
                this.callback({ type: 'icon', icon: icon.icon });
                this.modal.classList.remove('show');
            };
            resultsDiv.appendChild(card);
        });
    }

    displayFonts(fonts) {
        const resultsDiv = document.getElementById('asset-results');
        resultsDiv.innerHTML = '';

        fonts.forEach(font => {
            const card = document.createElement('div');
            card.style.cursor = 'pointer';
            card.style.border = '1px solid #ddd';
            card.style.borderRadius = '4px';
            card.style.padding = '12px';
            card.style.fontFamily = font.name || 'Arial';
            card.style.fontSize = '16px';
            card.style.textAlign = 'center';
            card.textContent = font.name;
            card.onclick = () => {
                this.callback({ type: 'font', font: font.name });
                this.modal.classList.remove('show');
            };
            resultsDiv.appendChild(card);
        });
    }

    switchTab(type) {
        document.querySelectorAll('.asset-tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        this.currentType = type;
        this.loadAssets(type);
    }
}
