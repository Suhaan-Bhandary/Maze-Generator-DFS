import React, { Component } from "react";

import "./Node.css";

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      row,
      col,

      isFinish,
      isStart,

      onMouseDown,
      onMouseUp,
    } = this.props;

    let styles = {
      topBorder: null,
    };

    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : "";

    return (
      <td
        style={styles}
        id={`node-${row}-${col}`}
        className={`node dimension ${extraClassName}`}

        onMouseDown={() => onMouseDown(row, col)}
        onMouseUp={() => onMouseUp(row, col)}
      ></td>
    );
  }
}
