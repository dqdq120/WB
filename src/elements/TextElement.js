import { CanvasElement } from './CanvasElement.js';

export class TextElement extends CanvasElement {
  static displayName = "Text";

  constructor(x, y) {
    super(x, y);
    this.text = "Double-click to edit";
    this.fontSize = "18px";
    this.color = "#1f2937";
  }

  getHTML() {
    return `<div style="font-size:${this.fontSize};color:${this.color};padding:8px;cursor:text;" contenteditable="true">${this.text}</div>`;
  }

  getPropertyPanel() {
    return `
      <label>Text: <input id="text-content" value="${this.text}" style="width:100%"></label><br><br>
      <label>Font Size: <input id="text-size" value="${this.fontSize}"></label><br><br>
      <label>Color: <input type="color" id="text-color" value="${this.color}"></label>
    `;
  }

  bindProperties() {
    document.getElementById('text-content')?.addEventListener('input', e => {
      this.text = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
    document.getElementById('text-size')?.addEventListener('input', e => {
      this.fontSize = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
    document.getElementById('text-color')?.addEventListener('input', e => {
      this.color = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
  }
}