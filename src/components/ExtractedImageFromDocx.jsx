import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import html2canvas from "html2canvas";

const ExtractedImageFromDocx = () => {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setErrorMessage(""); 
    setImages([]); 
  };

  const renderHtmlToCanvas = (htmlContent) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set canvas dimensions
      canvas.width = 800;
      canvas.height = 1200;

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.width = "800px";
      tempDiv.style.pageBreakBefore = "always";  

      document.body.appendChild(tempDiv);

      html2canvas(tempDiv).then((canvas) => {
        document.body.removeChild(tempDiv);
        resolve(canvas.toDataURL("image/png"));
      });
    });
  };

  const handleExtractImages = async () => {
    if (!file) {
      alert("Please select a DOCX file.");
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;

      try {
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const htmlContent = result.value;

        // Split the content by page breaks (ensure correct page breaks handling)
        const pages = htmlContent.split(/<div[^>]*style="page-break-before:always"[^>]*>/);

        // Render each page separately
        const imagesPromises = pages.map((page, index) =>
          renderHtmlToCanvas(page)
        );

        const imageResults = await Promise.all(imagesPromises);
        setImages(imageResults);
        console.log("Extracted images:", imageResults);
      } catch (error) {
        console.error("Error rendering DOCX content to images", error);
        setErrorMessage("Failed to render DOCX content to images.");
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    console.log('EXTRACTED IMAGES', images);
  }, [images]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>DOCX to Image Renderer</h1>
      <input type="file" accept=".docx" onChange={handleFileChange} style={styles.input} />
      <button onClick={handleExtractImages} style={styles.button} disabled={isLoading}>
        {isLoading ? "Processing..." : "Render Pages as Images"}
      </button>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      <div style={styles.imageContainer}>
        {images.map((src, index) => (
          <div key={index} style={styles.pageContainer}>
            <img src={src} alt={`Page ${index + 1}`} style={styles.image} />
            <div style={styles.pageNumber}>Page {index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    margin: "20px auto",
    maxWidth: "800px",  
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
  error: { color: "red", marginTop: "20px" },
  imageContainer: { marginTop: "20px", textAlign: "center" },
  image: { 
    maxWidth: "100%", 
    margin: "10px auto", 
    display: "block",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
  },
  pageContainer: {
    marginBottom: "20px", 
    display: "inline-block", 
    border: "1px solid #ddd", 
    padding: "10px", 
    backgroundColor: "#fff",
    borderRadius: "8px",
  },
  pageNumber: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#333",
  },
};

export default ExtractedImageFromDocx;
