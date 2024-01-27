document.addEventListener('DOMContentLoaded', () => {
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const textOutput = document.getElementById('textOutput');

  imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Display image preview
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
    };
    imagePreview.innerHTML = '';
    imagePreview.appendChild(img);

    // Perform text extraction
    extractText(file);
  });

  async function extractText(file) {
    // Load Tesseract.js
    await Tesseract.load();

    // Perform OCR on the image file
    const { data: { text } } = await Tesseract.recognize(
      file,
      'eng', // Specify language ('eng' for English)
      { logger: m => console.log(m) } // Optional logger for progress and debugging
    );

    // Display extracted text
    textOutput.textContent = text;
  }
});
