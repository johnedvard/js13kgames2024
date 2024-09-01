const fs = require('fs');
const path = require('path');

// Paths to your HTML and JS files
const distFolder = path.join(__dirname, 'dist');
const htmlFilePath = path.join(distFolder, 'index.html');
const jsFilePath = path.join(distFolder, 'index.js');
const outputFilePath = path.join(distFolder, 'output.html');

// Read HTML and JS files
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
const jsContent = fs.readFileSync(jsFilePath, 'utf8');

// Inline JS into HTML
const inlinedHtml = htmlContent.replace(
  '</body>',
  `<script>${jsContent}</script></body>`
);

// Save the output
fs.writeFileSync(outputFilePath, inlinedHtml, 'utf8');

console.log(`JavaScript inlined successfully into ${outputFilePath}`);
