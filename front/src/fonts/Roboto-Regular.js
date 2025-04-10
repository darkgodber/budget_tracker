
// src/fonts/Roboto-Regular.js

export default function loadRobotoFont(jsPDF) {
  const font = `AAEAAAASAQAABAAgR0RFRrRCsIIAAIhQAABGcAAAAHEdQT1OkI/7aAAACAQAACQUAAAJIbWF4cAEbAQAAAywAAAAoY3Z0IAAAAAAAAAD+AAABZAAAAGRnYXNwAAAAEAAAAXwAAAAIZ2x5ZlPaWYwAAAGgAAABJGhlYWQCABYAAAAuwAAAADZoaGVhBv//AAAABAAAAAIZaG10eAAABQAA... (и так далее)`;
  jsPDF.API.addFileToVFS('Roboto-Regular.ttf', font.trim());
  jsPDF.API.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
}
