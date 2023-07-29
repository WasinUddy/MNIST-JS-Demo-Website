import React, { useEffect, useState } from 'react';
import './canvasGrid.css';

export default function CanvasGrid(props) {
  // Constants for the number of rows and columns
  const n_rows = 28;
  const n_cols = 28;

  // State to keep track of whether drawing is in progress and current position
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ row: -1, col: -1 });

  // Function to handle the button press (when the mouse is clicked)
  function handleButtonPress(i, j) {
    setIsDrawing(true); // Start drawing
    setCurrentPosition({ row: i, col: j }); // Update the current position
  }

  // Function to handle button mouse enter (when the mouse is moved over the button)
  function handleButtonMouseEnter(i, j) {
    if (isDrawing) {
      setCurrentPosition({ row: i, col: j }); // Update the current position
    }
  }

  // Function to handle mouse up (when the mouse button is released)
  function handleMouseUp() {
    setIsDrawing(false); // Stop drawing
  }

  // useEffect hook to respond to changes in the currentPosition state
  useEffect(() => {
    // Check if the currentPosition is not the default value
    if (currentPosition.row !== -1 && currentPosition.col !== -1) {
      // Change color by updating the value in the canvas
      const prev_canvas = props.canvas.map((row) => [...row]); // Create a shallow copy of the canvas
      prev_canvas[currentPosition.row][currentPosition.col] = 1;
      prev_canvas[currentPosition.row + 1][currentPosition.col] = 1;
      prev_canvas[currentPosition.row][currentPosition.col + 1] = 1;
      props.setCanvas(prev_canvas); // Update the canvas state using the setCanvas function from props
    }
  }, [currentPosition]);

  // grid 2D Array to hold buttons for each pixel
  const grid = [];
  for (let i = 0; i < n_rows; i++) {
    const rows = [];
    for (let j = 0; j < n_cols; j++) {
      // Create a button element for each pixel and add event handlers
      rows.push(
        <button
          className={`pixel ${props.canvas[i][j] === 1 ? 'active_pixel' : ''}`}
          id={`${i}-${j}`}
          onMouseDown={() => handleButtonPress(i, j)}
          onMouseEnter={() => handleButtonMouseEnter(i, j)}
          onMouseUp={handleMouseUp}
        ></button>
      );
    }
    // Push each row into the grid. Rows are made up of buttons.
    grid.push(<div className='canvas-row'>{rows}</div>);
  }

  return (
    <div className='canvas-grid'>
      {grid}
    </div>
  );
}
