import { CanvasElement } from './CanvasElement.js';

export class InputElement extends CanvasElement {
  static displayName = "Input Field";

  constructor(x, y) {
    super(x, y);
    this.placeholder = "Enter text...";
    this.width = "250px";
  }

  getHTML() {
    return `<input type="text" placeholder="${this.placeholder}" style="width:${this.width};padding:10px;font-size:16px;border:2px solid #ccc;border-radius:6px;">`;
  }

  getPropertyPanel() {
    return `
      <label>Placeholder: <input id="input-placeholder" value="${this.placeholder}" style="width:100%"></label><br><br>
      <label>Width: <input id="input-width" value="${this.width}"></label>
    `;
  }

  bindProperties() {
    document.getElementById('input-placeholder')?.addEventListener('input', e => {
      this.placeholder = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
    document.getElementById('input-width')?.addEventListener('input', e => {
      this.width = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
  }
}