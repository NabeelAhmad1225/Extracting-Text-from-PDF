import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ExtractedTextPdf = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleExtract = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const typedArray = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;

      let textContent = "";
      let imageList = [];

      // Loop through all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        // Extract Text Content
        const text = await page.getTextContent();
        text.items.forEach((item) => {
          textContent += item.str + " ";
        });

        // Extract Images from the page
        const operatorList = await page.getOperatorList();
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderTask = page.render({ canvasContext: ctx, viewport });
        await renderTask.promise;

        // Get images rendered on the canvas (in base64 format)
        const imgData = canvas.toDataURL("image/png");
        imageList.push(imgData);
      }

      setExtractedText(textContent);
      setImages(imageList);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>PDF Extractor</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} style={styles.input} />
      <button onClick={handleExtract} style={styles.button}>Extract Content</button>

      {extractedText && (
        <div style={styles.textContainer}>
          <h2>Extracted Text:</h2>
          <p style={styles.text}>{extractedText}</p>
        </div>
      )}

      {images.length > 0 && (
        <div style={styles.imageContainer}>
          <h2>Extracted Images:</h2>
          {images.map((src, index) => (
            <img key={index} src={src} alt={`Extracted ${index}`} style={styles.image} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    margin: "20px auto",
    maxWidth: "600px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  title: { fontSize: "24px", marginBottom: "20px" },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
    width: "80%",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  textContainer: { marginTop: "20px", textAlign: "left" },
  text: { whiteSpace: "pre-wrap" },
  imageContainer: { marginTop: "20px" },
  image: { maxWidth: "100%", margin: "10px auto", display: "block" },
};

export default ExtractedTextPdf;
