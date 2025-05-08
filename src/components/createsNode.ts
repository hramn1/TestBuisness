export function createNodes(str: string) {
  const nodes = [];

  let currentLevel = -1;
  let currentValueNumber = "";
  let currentIndex = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "(" || str[i] === ")" || str[i] === " ") {
      if (currentValueNumber) {
        const node = {
          value: currentValueNumber,
          level: currentLevel,
          index: currentIndex,
        };

        nodes.push(node);

        currentValueNumber = "";
        currentIndex++;
      }

      if (str[i] === "(") currentLevel++;
      if (str[i] === ")") currentLevel--;
    }
    else {
      currentValueNumber += str[i];
    }
  }
  return nodes;
}
