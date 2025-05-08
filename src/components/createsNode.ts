interface Node {
  value: string;
  level: number;
  index: number;
}
export function createNodes(str: string): Node[] {
  const nodes: Node[] = [];
  let level = -1;
  let buffer = "";
  let index = 0;

  for (const char of str) {
    if (char === "(") {
      level++;
    }

    if (char === ")" || char === " ") {
      if (buffer) {
        nodes.push({ value: buffer, level, index: index++ });
        buffer = "";
      }
      if (char === ")") {
        level--;
      }
    } else if (char !== "(") {
      buffer += char;
    }
  }

  return nodes;
}
