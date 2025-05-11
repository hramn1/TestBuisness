import {Tree} from "./CreateTree";

interface IApp {
  form: HTMLFormElement;
  sectionRender: HTMLDivElement;
  init: () => void;
}

export class App implements IApp {
  form: HTMLFormElement;
  sectionRender: HTMLDivElement;
  input: HTMLInputElement | null;
  validateError: HTMLParagraphElement | null;
  constructor(form: HTMLFormElement, sectionRender: HTMLDivElement) {
    this.form = form;
    this.sectionRender = sectionRender;
    this.input = form.querySelector('.form-tree__input');
    this.validateError = document.querySelector('.validate-error');
  }
  inputValue(){
    if(this.input) {
      this.input.value = ''
    }
    this.input?.addEventListener('change', (evt) => {
      const target = evt.target as HTMLInputElement;
      if(!this.validate(target.value)){
        this.validateError?.classList.add('validate-error--show');
        this.form.querySelector('.form-tree__btn')?.setAttribute('disabled', 'disabled');
      } else {
        this.validateError?.classList.remove('validate-error--show');
        this.form.querySelector('.form-tree__btn')?.removeAttribute('disabled');
      }
    })
  }
  validate(str: string): boolean {
    if (str[0] !== '(') {
      return this.setError('Первый символ должен быть открывающей скобкой');
    }

    let depth = 0;
    for (const char of str) {
      if (char === '(') {
        depth++;
      } else if (char === ')') {
        depth--;
        if (depth < 0) {
          return this.setError('Не отбалансированы открывающие и закрывающие скобки');
        }
      }
    }

    const isBalanced = depth === 0;
    if (!isBalanced) {
      this.setError('Количество открывающих и закрывающих скобок не совпадает');
    }

    return isBalanced;
  }

  private setError(message: string): false {
    if (this.validateError) {
      this.validateError.textContent = message;
    }
    return false;
  }
  init() {
    let nodes = null
    this.inputValue();
    const tree = new Tree();
    this.form.addEventListener("submit", (evt) => {
     evt.preventDefault();
      const formData = new FormData(this.form)
      if(this.validate(formData.get('tree') as string)){
        nodes = tree.createNodes(formData.get('tree') as string);
        this.sectionRender.innerHTML = tree.createTree(nodes)
      }
    })
  }
}
