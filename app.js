document.addEventListener('DOMContentLoaded', () => {
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const textOutput = document.getElementById('textOutput');
  const languageSelect = document.getElementById('languageSelect');
  const downloadButton = document.getElementById('downloadButton');

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
      languageSelect.value, // Specify language
      { logger: m => console.log(m) } // Optional logger for progress and debugging
    );

    // Display extracted text
    textOutput.textContent = formatText(text);
  }

  function formatText(text) {
    // Remove line breaks and extra spaces
    let formattedText = text.replace(/\n+/g, ' ').trim();

    // Convert to uppercase
    formattedText = formattedText.toUpperCase();

    return formattedText;
  }

  languageSelect.addEventListener('change', () => {
    // Re-extract text when language selection changes
    const file = imageInput.files[0];
    if (file) {
      extractText(file);
    }
  });

  downloadButton.addEventListener('click', () => {
    // Save text as a file
    const blob = new Blob([textOutput.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});
