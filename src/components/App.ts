import { Tree } from "./CreateTree";

interface IApp {
  form: HTMLFormElement;
  sectionRender: HTMLDivElement;
  input: HTMLInputElement | null;
  init: () => void;
  setupInputListener: () => void;
  validate: (value: string) => boolean;
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

  setupInputListener(): void {
    if (!this.input) return;

    this.input.value = '';

    this.input.addEventListener('change', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const isValid = this.validate(target.value);
      const btn = this.form.querySelector('.form-tree__btn') as HTMLButtonElement;

      this.toggleValidationUI(isValid, btn);
    });
  }

  private toggleValidationUI(isValid: boolean, button: HTMLButtonElement | null): void {
    if (!button) return;

    if (!isValid) {
      this.validateError?.classList.add('validate-error--show');
      button.setAttribute('disabled', 'disabled');
    } else {
      this.validateError?.classList.remove('validate-error--show');
      button.removeAttribute('disabled');
    }
  }

  validate(value: string): boolean {
    if (!value || value[0] !== '(') {
      return this.setError('Первый символ должен быть открывающей скобкой');
    }

    let depth = 0;

    for (const char of value) {
      if (char === '(') {
        depth++;
      } else if (char === ')') {
        depth--;
        if (depth < 0) {
          return this.setError('Не отбалансированы открывающие и закрывающие скобки');
        }
      }
    }

    if (depth !== 0) {
      return this.setError('Количество открывающих и закрывающих скобок не совпадает');
    }

    return true;
  }

  private setError(message: string): false {
    if (this.validateError) {
      this.validateError.textContent = message;
    }
    return false;
  }

  init(): void {
    const tree = new Tree();
    this.setupInputListener();

    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();

      const formData = new FormData(this.form);
      const inputStr = formData.get('tree') as string;

      if (this.validate(inputStr)) {
        const nodes = tree.createNodes(inputStr);
        this.sectionRender.innerHTML = tree.createTree(nodes);
      }
    });
  }
}
