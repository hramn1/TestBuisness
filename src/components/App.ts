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
  input: Element | null;
  constructor(form: HTMLFormElement, sectionRender: HTMLDivElement) {
    this.form = form;
    this.sectionRender = sectionRender;
    this.input = form.querySelector('.form-tree__input');
  }
  inputValue(){
    const validateError = document.querySelector('.validate-error')
    this.input?.addEventListener('change', (evt) => {
      const target = evt.target as HTMLInputElement;
      if(!this.validate(target.value)){
        validateError?.classList.add('validate-error--show');
      } else {
        validateError?.classList.remove('validate-error--show');
      }
    })
  }
  validate(str: string): boolean {
      let depth = 0;

      for (const char of str) {
        if (char === '(') {
          depth++;
        } else if (char === ')') {
          depth--;
          if (depth < 0) {
            // Закрывающая скобка раньше, чем открывающая
            return false;
          }
        }
      }

      return depth === 0; // Все скобки сбалансированы
    }
  init() {
    let nodes = null
    this.inputValue();
    this.form.addEventListener("submit", (evt) => {
     evt.preventDefault();
      const formData = new FormData(this.form)
      if(this.validate(formData.get('tree') as string)){
        nodes = createNodes(formData.get('tree') as string);
        this.sectionRender.innerHTML = createTree(nodes)
      }
    })
  }
}
