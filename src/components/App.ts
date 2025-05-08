import {createNodes} from "./createsNode";
import {createTree} from "./createTree";

interface IApp {
  form: HTMLFormElement;
  sectionRender: HTMLDivElement;
  init: () => void;
}

export class App implements IApp {
  form: HTMLFormElement;
  sectionRender: HTMLDivElement;
  constructor(form: HTMLFormElement, sectionRender: HTMLDivElement) {
    this.form = form;
    this.sectionRender = sectionRender;
  }
  init() {
    let nodes = null
    this.form.addEventListener("submit", (evt) => {
     evt.preventDefault();
      const formData = new FormData(this.form)
      nodes = createNodes(formData.get('tree') as string);
      this.sectionRender.innerHTML = createTree(nodes)
    })
  }
}
