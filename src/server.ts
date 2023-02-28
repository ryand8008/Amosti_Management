const path = require('path')
const express = require('express');
const dotenv = require('dotenv');

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, '../dist')));

// Serve the index.html file for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});


app.listen(port, () => {
  console.log(`server is running at http:localhost:${port}`)
});
