import { CanvasElement } from './CanvasElement.js';

export class ImageElement extends CanvasElement {
  static displayName = "Image";

  constructor(x, y) {
    super(x, y);
    this.src = "https://via.placeholder.com/300x200/6366f1/ffffff?text=Click+to+Change";
    this.width = "300px";
    this.borderRadius = "12px";
  }

  getHTML() {
    return `<img src="${this.src}" style="width:${this.width};border-radius:${this.borderRadius};box-shadow:0 4px 12px rgba(0,0,0,0.1);" alt="Image">`;
  }

  getPropertyPanel() {
    return `
      <label>Image URL: <input id="img-src" value="${this.src}" style="width:100%"></label><br><br>
      <label>Width: <input id="img-width" value="${this.width}"></label><br><br>
      <label>Border Radius: <input id="img-radius" value="${this.borderRadius}"></label>
    `;
  }

  bindProperties() {
    document.getElementById('img-src')?.addEventListener('input', e => {
      this.src = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
    document.getElementById('img-width')?.addEventListener('input', e => {
      this.width = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
    document.getElementById('img-radius')?.addEventListener('input', e => {
      this.borderRadius = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
  }
}