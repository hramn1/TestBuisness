// validate.test.ts
class Validator {
  validateError: HTMLElement | null = null;

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
}

// Тесты
describe('Validator', () => {
  let validator: Validator;
  let mockErrorElement: { textContent: string | null };

  beforeEach(() => {
    validator = new Validator();
    mockErrorElement = { textContent: null };
    validator.validateError = mockErrorElement as unknown as HTMLElement;
  });

  test('валидная строка', () => {
    expect(validator.validate('(()())')).toBe(true);
    expect(mockErrorElement.textContent).toBe(null);
  });

  test('первая скобка не открывающая', () => {
    expect(validator.validate(')()')).toBe(false);
    expect(mockErrorElement.textContent).toBe('Первый символ должен быть открывающей скобкой');
  });

  test('некорректная вложенность', () => {
    expect(validator.validate('(()))')).toBe(false);
    expect(mockErrorElement.textContent).toBe('Не отбалансированы открывающие и закрывающие скобки');
  });

  test('нехватка закрывающих скобок', () => {
    expect(validator.validate('(((')).toBe(false);
    expect(mockErrorElement.textContent).toBe('Количество открывающих и закрывающих скобок не совпадает');
  });

  test('пустая строка', () => {
    expect(validator.validate('')).toBe(false);
    expect(mockErrorElement.textContent).toBe('Первый символ должен быть открывающей скобкой');
  });
});
