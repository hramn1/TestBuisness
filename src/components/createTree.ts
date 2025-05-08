interface Node {
  value: string;
  level: number;
  index: number;
}

export function createTree(nodes: Node[]): string {
  let tree = '';
  const maxValuesLengthOnLevel: number[] = [];
  const verticalLinePositions: number[] = [];

  // Получаем уникальные уровни
  const levels = Array.from(new Set(nodes.map((n) => n.level)));

  // Находим максимальную длину значения на каждом уровне
  for (const level of levels) {
    const maxLength = nodes
      .filter((n) => n.level === level)
      .map((n) => n.value.length)
      .sort((a, b) => b - a)[0];
    maxValuesLengthOnLevel.push(maxLength);
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const nodesOnLevel = nodes.filter((n) => n.level === node.level);

    const offset = maxValuesLengthOnLevel
      .slice(0, node.level)
      .reduce((sum, len) => sum + len, 0);

    let connector = '';
    const isParent = nodes[i + 1] && node.level < nodes[i + 1].level;
    if (isParent) {
      const padding = maxValuesLengthOnLevel[node.level] - node.value.length;
      connector = '-'.repeat(padding) + '---+';
    }

    let treeLine = ' '.repeat(node.level * 3 + offset) + node.value + connector;

    for (const pos of verticalLinePositions) {
      if (pos < treeLine.length) {
        treeLine = treeLine.substring(0, pos) + '|' + treeLine.substring(pos + 1);
      }
    }

    // Проверка, нужно ли добавить вертикальную линию
    const isBranching =
      nodesOnLevel.length > 1 &&
      isParent &&
      node.index !== nodesOnLevel.at(-1)?.index;

    if (isBranching) {
      const nextSibling = nodesOnLevel.find((n) => n.index > node.index);
      if (nextSibling) {
        const inBetweenNodes = nodes.slice(node.index, nextSibling.index);
        const allDeeper = inBetweenNodes.every((n) => n.level >= node.level);

        if (allDeeper) {
          verticalLinePositions.push(node.level * 3 + offset);
        }
      }
    }

    if (nodes[i + 1] && node.level > nodes[i + 1].level) {
      verticalLinePositions.pop();
    }

    tree += `<pre>${treeLine}</pre>`;
  }

  return tree;
}
