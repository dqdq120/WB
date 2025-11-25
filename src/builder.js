
import { ButtonElement } from './elements/ButtonElement.js';
import { TextElement } from './elements/TextElement.js';
import { InputElement } from './elements/InputElement.js';
import { ImageElement } from './elements/ImageElement.js';
import { ContainerElement } from './elements/ContainerElement.js';

const componentRegistry = {
  button: ButtonElement,
  text: TextElement,
  input: InputElement,
  image: ImageElement,
  container: ContainerElement,
};

export class WebBuilder {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.propertiesPanel = document.getElementById('properties');
    this.selected = null;
    window.builder = this; // Make it globally accessible
    this.init();
  }


  init() {
    this.renderPalette();
    this.setupCanvas();
    this.setupExport();
  }

  renderPalette() {
    const palette = document.getElementById('component-palette');
    Object.keys(componentRegistry).forEach(type => {
      const div = document.createElement('div');
      div.className = 'component-item';
      div.textContent = componentRegistry[type].displayName;
      div.draggable = true;
      div.dataset.type = type;

      div.addEventListener('dragstart', e => {
        e.dataTransfer.setData('type', type);
      });

      palette.appendChild(div);
    });
  }

  setupCanvas() {
    this.canvas.addEventListener('dragover', e => e.preventDefault());
    this.canvas.addEventListener('drop', e => {
      e.preventDefault();
      const type = e.dataTransfer.getData('type');
      if (!type) return;

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ElementClass = componentRegistry[type];
      const element = new ElementClass(x, y);
      this.canvas.appendChild(element.render());

      this.select(element);
    });

    // Deselect on canvas click
    this.canvas.addEventListener('click', e => {
      if (e.target === this.canvas) this.deselect();
    });
  }

  select(element) {
    this.deselect();
    this.selected = element;
    element.select();
    this.propertiesPanel.innerHTML = element.getPropertyPanel();
    element.bindProperties();
  }

  deselect() {
    if (this.selected) this.selected.deselect();
    this.selected = null;
    this.propertiesPanel.innerHTML = '<p class="text-gray-500">Select an element to edit</p>';
  }

  setupExport() {
    document.getElementById('export').addEventListener('click', () => {
      const html = this.canvas.innerHTML;
      const blob = new Blob([`<html><body style="margin:0">${html}</body></html>`], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'page.html';
      a.click();
    });
  }
}