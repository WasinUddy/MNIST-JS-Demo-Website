import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

import CanvasGrid from './canvasGrid';
import * as tf from '@tensorflow/tfjs';



function App() {
  // Create React.js Hooks to keep track of pixel drawed 28x28 grid of pixels 784 pixels
  const [canvas, setCanvas] = useState(Array(28).fill(Array(28).fill(0)))
  const [model, setModel] = useState(null)

  // Load TensorFlow.js model
  useEffect(() => {
    async function loadModel() {
      const loadedModel = await tf.loadLayersModel('assets/model.json')
      setModel(loadedModel)
    }

    loadModel()
  }, [])

  // Function to convert canvas to tensor
  function preprocessImage(inputImage) {
    // Convert canvas to batch dimensions [1, 28, 28, 1]
    const tensor = tf.tensor2d(inputImage, [1, 28, 28, 1])

    return tensor
  }

  // Function to predict digit
  async function predictImage() {
    if (!model) {
      console.error('Model not loaded')
      return
    }

    const inputTensor = preprocessImage(canvas)

    const prediction = model.predict(inputTensor)

    const result = Array.from(prediction.dataSync())

    console.log(result)

    inputTensor.dispose()
  }
  
  return (
    <div className="App">
      <CanvasGrid canvas={canvas} setCanvas={setCanvas}/>

      <div className="button_container">
        <button className="clear_button" onClick={() => setCanvas(Array(28).fill(Array(28).fill(0)))}>Clear</button>
        <button className="predict_button" onClick={() => predictImage()}>Predict</button>
      </div>
    </div>
  );
}

export default App;
