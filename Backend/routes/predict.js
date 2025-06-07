const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

router.post('/', (req, res) => {
  const { features, model } = req.body; // Expecting { features: {...}, model: "random_forest" }

  if (!features || !model) {
    return res.status(400).json({ error: "Missing features or model selection" });
  }

  const inputPayload = JSON.stringify({ features, model });
  console.log('Sending to Python:', inputPayload);

  const pythonProcess = spawn('python3', ['./python/predict.py', inputPayload], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let predictionResult = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    const output = data.toString();
    predictionResult += output;
    console.log('Python stdout:', output);
  });

  pythonProcess.stderr.on('data', (data) => {
    const error = data.toString();
    errorOutput += error;
    console.log('Python stderr:', error);
  });

  pythonProcess.on('close', (code) => {
    console.log('Python process exited with code:', code);
    console.log('Final stdout:', predictionResult);
    console.log('Final stderr:', errorOutput);
    
    if (code !== 0) {
      return res.status(500).json({ 
        error: 'Prediction error',
        details: errorOutput || predictionResult || 'No error details available'
      });
    }
    try {
      const prediction = JSON.parse(predictionResult);
      res.json(prediction);
    } catch (err) {
      console.error('Parsing prediction result failed:', err);
      res.status(500).json({ 
        error: 'Invalid prediction response',
        details: err.message,
        raw_output: predictionResult
      });
    }
  });
});

module.exports = router;
