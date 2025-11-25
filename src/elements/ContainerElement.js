import { CanvasElement } from './CanvasElement.js';

export class ContainerElement extends CanvasElement {
  static displayName = "Container";

  constructor(x, y) {
    super(x, y);
    this.bg = "#f8fafc";
    this.padding = "24px";
    this.borderRadius = "16px";
  }

  getHTML() {
    return `<div style="background:${this.bg};padding:${this.padding};border-radius:${this.borderRadius};border:2px dashed #cbd5e1;min-height:120px;">
      <em style="color:#94a3b8;pointer-events:none;">Drop elements inside</em>
    </div>`;
  }

  getPropertyPanel() {
    return `
      <label>Background: <input type="color" id="cont-bg" value="${this.bg}"></label><br><br>
      <label>Padding: <input id="cont-padding" value="${this.padding}"></label><br><br>
      <label>Border Radius: <input id="cont-radius" value="${this.borderRadius}"></label>
    `;
  }

  bindProperties() {
    document.getElementById('cont-bg')?.addEventListener('input', e => {
      this.bg = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
    document.getElementById('cont-padding')?.addEventListener('input', e => {
      this.padding = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
    document.getElementById('cont-radius')?.addEventListener('input', e => {
      this.borderRadius = e.target.value;
      this.el.innerHTML = this.getHTML();
    });
  }
}