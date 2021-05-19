/**
 * Opens a file as a base64 string, without the base64-prefix.
 * @param file The file to be read as base64.
 * @returns {string} The base64 string of the image.
 */
function file2base64(file) {return file.buffer.toString('base64');
}

module.exports = {file2base64};