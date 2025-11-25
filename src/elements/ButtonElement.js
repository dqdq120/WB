import { CanvasElement } from './CanvasElement.js';

export class ButtonElement extends CanvasElement {
  static displayName = "Button";

  constructor(x, y) {
    super(x, y);
    this.text = "Click Me";
    this.bg = "#4f46e5";
  }

  getHTML() {
    return `<button style="background:${this.bg};color:white;padding:12px 24px;border:none;border-radius:8px;font-size:16px;cursor:pointer;">${this.text}</button>`;
  }

  getPropertyPanel() {
    return `
      <label>Text: <input id="btn-text" value="${this.text}"></label><br><br>
      <label>Color: <input type="color" id="btn-bg" value="${this.bg}"></label>
    `;
  }

  bindProperties() {
    document.getElementById('btn-text')?.addEventListener('input', e => {
      this.text = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
    document.getElementById('btn-bg')?.addEventListener('input', e => {
      this.bg = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
  }
}