import React, { useState } from 'react';
import mammoth from 'mammoth';

const ExtractedTextDocx = () => {
  const [file, setFile] = useState(null);
  const [extractedContent, setExtractedContent] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleExtractText = () => {
    if (!file) {
      alert("Please select a DOCX file first.");
      return;
    }

    // Use Mammoth to extract text and images from DOCX file
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;

      mammoth.convertToHtml({ arrayBuffer, includeImages: true })
        .then((result) => {
          setExtractedContent(result.value); // HTML content (text + images)
        })
        .catch((error) => {
          console.error("Failed to extract content from DOCX", error);
        });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>DOCX Text and Image Extractor</h1>
      <input
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        style={styles.input}
      />
      <button onClick={handleExtractText} style={styles.button}>
        Extract Content
      </button>
      {extractedContent && (
        <div
          style={styles.text}
          dangerouslySetInnerHTML={{ __html: extractedContent }}
        />
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
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
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
    transition: "background-color 0.3s ease",
  },
  text: {
    marginTop: "20px",
    textAlign: "left",
    padding: "10px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    whiteSpace: "pre-wrap", 
  },
};

export default ExtractedTextDocx;
