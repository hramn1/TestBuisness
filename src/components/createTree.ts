export function createTree(nodes) {
  let tree = ``; // Дерево
  const maxValuesLengthOnLevel = []; // Массив из максимальных количеств символов числа на каждом уровне
  const verticalLinePositions = []; // Текущии позиции вертикальных линий в строке
  const levels = Array.from(new Set(nodes.map((item) => item.level))); // Все уровни из исходных данных

  // Получаем максимальные количеств символов числа на каждом уровне
  for (let i = 0; i < levels.length; i++) {
    const value = nodes
      .filter((item) => item.level === levels[i])
      .map((item) => item.value)
      .sort((a, b) => b.length - a.length)[0].length;

    maxValuesLengthOnLevel.push(value);
  }

  // Формируем данные по каждому узлу
  for (let i = 0; i < nodes.length; i++) {
    let template = ""; // Шаблон для узла, имеющего дочерние элементы
    const node = nodes[i]; // Текущий узел
    const nodesOnThisLevel = nodes.filter((item) => item.level === node.level); // Все узлы на данном уровне вложенности
    const valueLengthsSum = maxValuesLengthOnLevel
      .slice(0, node.level)
      .reduce((a, b) => a + b, 0); // Сумма максимальных длин символов ДО текущего уровня вложенности (используется для создания отступов)

    // Если у узла есть дочерние элементы, добавляем в шаблон строку (n*"-")---+
    if (nodes[i + 1] && node.level < nodes[i + 1].level) {
      const lastLength = maxValuesLengthOnLevel[node.level];
      template = "-".repeat(lastLength - node.value.length) + "---+";
    }

    // Создаем значение строки по текущему узлу (отступы + значение + шаблон)
    let treeValue =
      " ".repeat(node.level * 3 + valueLengthsSum) + node.value + template;

    // Добавляем в строку вертикальные линии
    for (const position of verticalLinePositions) {
      treeValue =
        treeValue.slice(0, position) + "|" + treeValue.slice(position + 1);
    }

    // Если на данном уровне есть еще элементы и уровень вложенности следующего элемента больше
    if (
      nodesOnThisLevel.length !== 1 &&
      nodes[i + 1] &&
      node.index !== nodesOnThisLevel.at(-1).index &&
      node.level < nodes[i + 1].level
    ) {
      // Находим индекс следующего узла на данном уровне
      const nextNodeIndex =
        nodesOnThisLevel.findIndex((item) => item.index === node.index) + 1;
      // Берем массив узлов от текущего индекса до индекса следующего узла на данном уровне
      const nodesBetweenIndex = nodes.slice(
        node.index,
        nodesOnThisLevel[nextNodeIndex].index
      );

      let validLevels = true; // Валидность уровней узлов

      // Если хотя бы один узел имеет уровень вложенности меньше текущего, то валидность уровне устанавливается в false
      for (const nodeBI of nodesBetweenIndex) {
        if (nodeBI.level < node.level) validLevels = false;
      }

      // Если валидность уровней узлов true, то добавляем новую позицию для | в массив verticalLinePositions
      if (validLevels) {
        verticalLinePositions.push(node.level * 3 + valueLengthsSum);
      }
    }

    // Если уровень вложенности будет уменьшаться, убираем последнюю позицию для вертикальной линии
    if (nodes[i + 1] && node.level > nodes[i + 1].level) {
      verticalLinePositions.pop();
    }

    // Добавляем конечную строку к дереву
    tree += `<pre>${treeValue}</pre>`;
  }

  return tree;
}
