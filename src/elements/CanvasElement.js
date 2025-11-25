export class CanvasElement {
  static displayName = "Element";

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.el = null;
  }

  render() {
    this.el = document.createElement('div');
    this.el.className = 'element';
    this.el.style.left = this.x + 'px';
    this.el.style.top = this.y + 'px';
    this.el.innerHTML = this.getHTML();

    this.makeDraggable();
    this.el.addEventListener('click', e => {
      e.stopPropagation();
      window.builder.select(this);
    });

    return this.el;
  }

  makeDraggable() {
    this.el.addEventListener('mousedown', e => {
      if (e.target !== this.el) return;
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = this.x;
      const startTop = this.y;

      const move = (e) => {
        this.x = startLeft + (e.clientX - startX);
        this.y = startTop + (e.clientY - startY);
        this.el.style.left = this.x + 'px';
        this.el.style.top = this.y + 'px';
      };

      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  }

  select() {
    this.el.classList.add('selected');
  }

  deselect() {
    this.el.classList.remove('selected');
  }

  getHTML() { return '<div>Base Element</div>'; }
  getPropertyPanel() { return '<p>No properties</p>'; }
  bindProperties() {}
}