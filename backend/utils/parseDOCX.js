const fs = require('fs');
const mammoth = require('mammoth');

async function parseDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

module.exports = parseDOCX;
