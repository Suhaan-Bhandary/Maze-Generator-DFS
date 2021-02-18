import React, { Component } from "react";

import html2canvas from "html2canvas";
import jspdf from "jspdf";

import Node from "./Node/Node.jsx";

import {
  dfsRecursive,
  getNodesInShortestPathOrder,
} from "../algorithms/dfsRecursive.js";

import "./MazeGeneratorVisualizer.css";

// Defining initial state of start and finish.

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      errorMessage: "",
      dragNode: "normal",
      mazeGenerationSpeed: 10,
      points: {
        start: {
          row: 12,
          col: 0,
        },
        finish: {
          row: 12,
          col: 49,
        },
      },
      length: {
        row: 25,
        col: 50,
      },
    };
  }

  // Creating grid
  componentDidMount = () => {
    const grid = getGrid(
      this.state.length.row,
      this.state.length.col,
      this.state.points.start.row,
      this.state.points.start.col,
      this.state.points.finish.row,
      this.state.points.finish.col
    );
    this.setState({
      grid,
    });
  };

  visualizeMazeGeneration = () => {
    const { grid } = this.state;
    const startNode =
      grid[this.state.points.start.row][this.state.points.start.col];
    const finishNode =
      grid[this.state.points.finish.row][this.state.points.finish.col];

    const visitedNodesInOrder = dfsRecursive(grid, startNode, finishNode);
    // const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    this.animateMazeGeneration(visitedNodesInOrder, grid);
  };

  animateMazeGeneration(visitedNodesInOrder, grid) {
    for (let i = 1; i < visitedNodesInOrder.length; i++) {
      setTimeout(() => {
        if (i === visitedNodesInOrder.length - 1) {
          this.setState({
            grid: grid,
          });
        }

        const node = visitedNodesInOrder[i];
        const nodeElement = document.getElementById(
          `node-${node.row}-${node.col}`
        );

        nodeElement.classList.remove("node");

        if (nodeElement.classList.contains("node-finish")) {
          console.log("Finish");
        } else if (nodeElement.classList.contains("node-start")) {
          console.log("Finish");
        } else if (nodeElement.classList.contains("node-visited")) {
          nodeElement.classList.remove("node-visited");
          nodeElement.classList.add("RevisitedNode");
        } else {
          nodeElement.classList.add("node-visited"); // Initializing if not visited yet.
        }

        if (node.topWall) {
          nodeElement.classList.add("topWall");
        }
        if (node.rightWall) {
          nodeElement.classList.add("rightWall");
        }
        if (node.bottomWall) {
          nodeElement.classList.add("bottomWall");
        }
        if (node.leftWall) {
          nodeElement.classList.add("leftWall");
        }
      }, (300 * i) / this.state.mazeGenerationSpeed);
    }
  }

  // Use to get or visualize the shortest path.
  animateShortestPath = () => {
    const finishNode = this.state.grid[this.state.points.finish.row][
      this.state.points.finish.col
    ];
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document
          .getElementById(`node-${node.row}-${node.col}`)
          .classList.add("node-path");
      }, 50 * i);
    }
  };

  pointChangeHandler = () => {
    if (notCorrectProperty(this.state.length.row, this.state.length.col)) {
      this.setState({
        errorMessage: "Invalid Input",
      });
      return;
    } //To check if the provided value is suitable or not.

    const start_row = parseInt(document.getElementById("start_row").value);
    const start_col = parseInt(document.getElementById("start_col").value);
    const finish_row = parseInt(document.getElementById("end_row").value);
    const finish_col = parseInt(document.getElementById("end_col").value);

    const newGrid = getGrid(
      this.state.length.row,
      this.state.length.col,

      start_row,
      start_col,
      finish_row,
      finish_col
    );
    this.setState({
      grid: newGrid,
      errorMessage: "",
      points: {
        start: {
          row: start_row,
          col: start_col,
        },
        finish: {
          row: finish_row,
          col: finish_col,
        },
      },
    });
  };

  speedChangeHandler = () => {
    const changedSpeed = parseInt(
      document.getElementById("mazeSpeedRange").value
    );
    this.setState({
      mazeGenerationSpeed: changedSpeed,
    });
  };

  lengthChangeHandler = () => {
    const row_length = document.getElementById("row_length").value;
    const col_length = document.getElementById("col_length").value;

    if (row_length > 50 || col_length > 50) {
      this.setState({
        errorMessage: "Invalid Size",
      });
      return;
    }

    // Getting new grid.
    const newGrid = getGrid(
      row_length,
      col_length,
      0,
      0,
      row_length - 1,
      col_length - 1
    );

    // Changing the new value of the input elements :
    document.getElementById("start_row").value = 0;
    document.getElementById("start_col").value = 0;
    document.getElementById("end_row").value = row_length - 1;
    document.getElementById("end_col").value = col_length - 1;

    // Assing new values.
    this.setState({
      grid: newGrid,
      errorMessage: "",
      points: {
        start: {
          row: 0,
          col: 0,
        },
        finish: {
          row: row_length - 1,
          col: col_length - 1,
        },
      },
      length: {
        row: row_length,
        col: col_length,
      },
    });
  };

  // On pressing the mouse down
  handleMouseDown(row, col) {
    if (this.state.grid[row][col].isStart) {
      this.setState({ dragNode: "start" });
    } else if (this.state.grid[row][col].isFinish) {
      this.setState({ dragNode: "finish" });
    } else {
      this.setState({ dragNode: "normal" });
    }
  }

  // When we release the mouse
  handleMouseUp(row, col) {
    let start_row = this.state.points.start.row;
    let start_col = this.state.points.start.col;
    let finish_row = this.state.points.finish.row;
    let finish_col = this.state.points.finish.col;

    if (this.state.dragNode === "start") {
      start_row = row;
      start_col = col;
    } else if (this.state.dragNode === "finish") {
      finish_row = row;
      finish_col = col;
    } else {
      return;
    }

    const newGrid = getGrid(
      this.state.length.row,
      this.state.length.col,

      start_row,
      start_col,
      finish_row,
      finish_col
    );
    this.setState({
      grid: newGrid,
      errorMessage: "",
      points: {
        start: {
          row: start_row,
          col: start_col,
        },
        finish: {
          row: finish_row,
          col: finish_col,
        },
      },
    });

    document.getElementById("start_row").value = start_row;
    document.getElementById("start_col").value = start_col;
    document.getElementById("end_row").value = finish_row;
    document.getElementById("end_col").value = finish_col;
  }

  render() {
    const { grid } = this.state;

    let textBox = (
      <div className="textBox">
        <div className="startPointContainer">
          <label htmlFor="point"> Start Point: </label>
          <input
            type="number"
            name="point"
            id="start_row"
            min="0"
            max={this.state.length.row - 1}
            onChange={this.pointChangeHandler}
            defaultValue={this.state.points.start.row}
          ></input>
          <input
            type="number"
            name="point"
            id="start_col"
            min="0"
            max={this.state.length.col - 1}
            onChange={this.pointChangeHandler}
            defaultValue={this.state.points.start.col}
          ></input>
        </div>
        <div className="endPointContainer">
          <label htmlFor="point"> End Point: </label>
          <input
            type="number"
            name="point"
            id="end_row"
            min="0"
            max="50"
            onChange={this.pointChangeHandler}
            defaultValue={this.state.points.finish.row}
          ></input>
          <input
            type="number"
            name="point"
            id="end_col"
            min="0"
            max="50"
            onChange={this.pointChangeHandler}
            defaultValue={this.state.points.finish.col}
          ></input>
        </div>
        <p
          style={{
            color: "red",
          }}
        >
          {this.state.errorMessage}
        </p>
      </div>
    );

    return (
      <div className="MazeGeneratorVisualizer">
        <button onClick={this.visualizeMazeGeneration}> Maze </button>
        <button onClick={this.animateShortestPath}> Shortest Path </button>
        <button onClick={exportPdf}> Export </button>
        <label htmlFor="heightSlider"> Height : </label>
        <input
          type="range"
          id="row_length"
          min="0"
          max = "50"
          name = "heightSlider"
          onChange={this.lengthChangeHandler}
          defaultValue={this.state.length.row}
        ></input>
        <label htmlFor="widthSlider"> Width : </label>
        <input
          type="range"
          id="col_length"
          min="0"
          max = "50"
          name = "widthSlider"
          onChange={this.lengthChangeHandler}
          defaultValue={this.state.length.col}
        ></input>
        <div className="slidecontainer">
          <label htmlFor="speedSlider"> Maze Generation Speed: </label>
          <input
            type="range"
            min="1"
            max="20"
            defaultValue="10"
            name="speedSlider"
            id="mazeSpeedRange"
            onChange={this.speedChangeHandler}
          />
        </div>
        {textBox}
        <div
          className="visualGridContainer"
          style={{
            padding: "50px",
          }}
          id="pdfBox"
        >
          <div className="gridBox">
            <table
              className="grid"
              style={{
                borderSpacing: "0",
              }}
            >
              <tbody>
                {grid.map((row, rowIndex) => {
                  return (
                    <tr key={rowIndex}>
                      {row.map((node, nodeIndex) => {
                        const { isStart, isFinish } = node; //Extracting from the node
                        return (
                          <Node
                            row={rowIndex}
                            col={nodeIndex}
                            key={rowIndex + "-" + nodeIndex}
                            isStart={isStart}
                            isFinish={isFinish}
                            onMouseDown={(row, col) =>
                              this.handleMouseDown(row, col)
                            }
                            onMouseUp={(row, col) =>
                              this.handleMouseUp(row, col)
                            }
                          ></Node>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

// Function to get grid initially and when changing.
const getGrid = (
  row_length,
  col_length,
  start_row,
  start_col,
  finish_row,
  finish_col
) => {
  const grid = [];
  for (let row = 0; row < row_length; row++) {
    const currentRow = [];
    for (let col = 0; col < col_length; col++) {
      currentRow.push(
        createNode(col, row, start_row, start_col, finish_row, finish_col)
      );
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, start_row, start_col, finish_row, finish_col) => {
  return {
    col,
    row,
    isStart: row === start_row && col === start_col,
    isFinish: row === finish_row && col === finish_col,
    distance: Infinity,
    isVisited: false,
    previousNode: null,

    topWall: true,
    rightWall: true,
    bottomWall: true,
    leftWall: true,
  };
};

const notCorrectProperty = (row_max_length, col_max_length) => {
  if (
    isNaN(parseInt(document.getElementById("start_row").value)) ||
    isNaN(parseInt(document.getElementById("start_col").value)) ||
    isNaN(parseInt(document.getElementById("end_row").value)) ||
    isNaN(parseInt(document.getElementById("end_col").value))
  )
    return true;

  if (
    parseInt(document.getElementById("start_row").value) > row_max_length ||
    parseInt(document.getElementById("start_col").value) > col_max_length
  )
    return true;
  if (
    parseInt(document.getElementById("start_row").value) < 0 ||
    parseInt(document.getElementById("start_col").value) < 0
  )
    return true;

  if (
    parseInt(document.getElementById("end_row").value) > row_max_length ||
    parseInt(document.getElementById("end_col").value) > col_max_length
  )
    return true;
  if (
    parseInt(document.getElementById("end_row").value) < 0 ||
    parseInt(document.getElementById("end_col").value) < 0
  )
    return true;

  return false;
};

// We export pdf from here.
const exportPdf = () => {
  // We are storing the element from its id.
  const element = document.getElementById("pdfBox");

  // html2canvas catures a screenshot or a picture and by using then we execute the function.
  html2canvas(element).then((canvas) => {
    console.log(canvas);

    // document.getElementById("canvas").appendChild(canvas); to test the canvas element.

    const imgData = canvas.toDataURL("image/png"); // Creating image or png.

    const doc = new jspdf();

    // doc.addImage(imgData,imgPositionX,imgPositionY,width,height);
    const imgHeight = (canvas.height * 205) / canvas.width;
    doc.text("Maze", 98, 10);

    doc.addImage(imgData, 0, 12, 205, imgHeight);
    doc.save("maze.pdf");
  });
};
