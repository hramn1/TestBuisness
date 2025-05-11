interface NodeTree {
  value: string;
  level: number;
  index: number;
}

export class Tree {
  createTree(nodes: NodeTree[]): string {
    let tree = '';
    const maxValuesLengthOnLevel = this.calculateMaxValuesLengthOnLevel(nodes);
    const verticalLinePositions: number[] = [];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const offset = this.calculateOffset(node.level, maxValuesLengthOnLevel);
      const connector = this.getConnector(node, nodes, i, maxValuesLengthOnLevel);

      let treeLine = ' '.repeat(node.level * 3 + offset) + node.value + connector;

      // Добавляем вертикальные линии в нужные позиции
      verticalLinePositions.forEach(pos => {
        if (pos < treeLine.length) {
          treeLine = `${treeLine.slice(0, pos)}|${treeLine.slice(pos + 1)}`;
        }
      });

      // Проверяем, нужно ли добавить вертикальную линию для ветвлений
      this.addVerticalLineIfBranching(node, nodes, i, verticalLinePositions, offset);

      // Убираем вертикальные линии, если уровень стал меньше
      if (nodes[i + 1] && node.level > nodes[i + 1].level) {
        verticalLinePositions.pop();
      }
      tree += `<pre class="${connector ? 'green-item' : 'blue-item'} ">${treeLine}</pre>`;
    }

    return tree;
  }

  private calculateMaxValuesLengthOnLevel(nodes: NodeTree[]): number[] {
    const levels = Array.from(new Set(nodes.map(n => n.level)));
    return levels.map(level =>
      Math.max(...nodes.filter(n => n.level === level).map(n => n.value.length))
    );
  }

  private calculateOffset(level: number, maxValuesLengthOnLevel: number[]): number {
    return maxValuesLengthOnLevel.slice(0, level).reduce((sum, len) => sum + len, 0);
  }

  private getConnector(node: NodeTree, nodes: NodeTree[], index: number, maxValuesLengthOnLevel: number[]): string {
    const isParent = nodes[index + 1] && node.level < nodes[index + 1].level;
    if (!isParent) return '';

    const padding = maxValuesLengthOnLevel[node.level] - node.value.length;
    return '-'.repeat(padding) + '---+';
  }

  private addVerticalLineIfBranching(
    node: NodeTree,
    nodes: NodeTree[],
    index: number,
    verticalLinePositions: number[],
    offset: number
  ): void {
    const nodesOnLevel = nodes.filter(n => n.level === node.level);
    const isBranching = nodesOnLevel.length > 1 && nodes[index + 1]?.level > node.level && node.index !== nodesOnLevel.at(-1)?.index;

    if (isBranching) {
      const nextSibling = nodesOnLevel.find(n => n.index > node.index);
      if (nextSibling) {
        const inBetweenNodes = nodes.slice(node.index, nextSibling.index);
        const allDeeper = inBetweenNodes.every(n => n.level >= node.level);

        if (allDeeper) {
          verticalLinePositions.push(node.level * 3 + offset);
        }
      }
    }
  }

  createNodes(str: string): NodeTree[] {
    const nodes: NodeTree[] = [];
    let level = -1;
    let buffer = '';
    let index = 0;

    for (const char of str) {
      if (char === '(') {
        level++;
      } else if (char === ')' || char === ' ') {
        if (buffer) {
          nodes.push({ value: buffer, level, index: index++ });
          buffer = '';
        }
        if (char === ')') {
          level--;
        }
      } else {
        buffer += char;
      }
    }

    return nodes;
  }
}
