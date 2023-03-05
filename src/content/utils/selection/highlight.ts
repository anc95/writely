export class Highlight {
  highlighter: any;
  private className: string = `writely-highlight-${Date.now()}`;

  private surroundContainers: HTMLElement[] = [];

  public highlight(range: Range) {
    let span = document.createElement('span');
    span.setAttribute('className', this.className);
    span.setAttribute('style', 'background-color: #ababb7 !important;');
    this.surroundContainers.push(span);
    range.surroundContents(span);
  }

  public unhighlight() {
    this.surroundContainers.forEach((container) => {
      container.replaceWith(container.innerHTML);
    });
  }
}
