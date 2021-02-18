export function dfsRecursive(grid, startNode, endNode) {
  let visitedNodesInOrder = [];
  let nodeStack = [];

  move(startNode, grid, nodeStack, startNode, endNode, visitedNodesInOrder);

  return visitedNodesInOrder;
}

const move = (
  current,
  grid,
  nodeStack,
  startNode,
  endNode,
  visitedNodesInOrder
) => {
  visitedNodesInOrder.push(current);
  current.isVisited = true;

  let kids = getKids(current, grid);

  if (kids.length === 0) {
    if (nodeStack.length === 0) return;
    current = nodeStack.pop();
  } else {
    let node = kids[Math.floor(Math.random() * kids.length)];

    node.previousNode = current;

    if (current.col === node.col) {
      if (current.row < node.row) {
        grid[current.row][current.col].bottomWall = false;
        grid[node.row][node.col].topWall = false;
      } else {
        grid[current.row][current.col].topWall = false;
        grid[node.row][node.col].bottomWall = false;
      }
    } else {
      if (current.col < node.col) {
        grid[current.row][current.col].rightWall = false;
        grid[node.row][node.col].leftWall = false;
      } else {
        grid[current.row][current.col].leftWall = false;
        grid[node.row][node.col].rightWall = false;
      }
    }

    current = node;
    nodeStack.push(current);
  }

  move(current, grid, nodeStack, startNode, endNode, visitedNodesInOrder);
};

const getKids = (current, grid) => {
  let kids = [];
  const row = current.row;
  const col = current.col;

  if (row > 0) kids.push(grid[row - 1][col]);
  if (row < grid.length - 1) kids.push(grid[row + 1][col]);
  if (col > 0) kids.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) kids.push(grid[row][col + 1]);

  return kids.filter((kid) => !kid.isVisited);
};

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
