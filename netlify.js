// netlify.js
const express = require('express');
const app = express();
const port = process.env.PORT || 9999;

// Serve static files from the dist directory (if needed)
app.use(express.static('dist'));

// Define a fallback route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});