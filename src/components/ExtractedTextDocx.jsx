import React, { useState, useEffect } from "react";
import mammoth from "mammoth";
import JSZip from "jszip";

const ExtractedTextDocx = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState(""); 
  const [extractedImages, setExtractedImages] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleExtractText = async () => {
    if (!file) {
      alert("Please select a DOCX file first.");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();

      
      const textResult = await mammoth.extractRawText({ arrayBuffer });
      setExtractedText(textResult.value); 

     
      const zip = await JSZip.loadAsync(arrayBuffer);
      const images = [];
      zip.folder("word/media").forEach(async (relativePath, file) => {
        const base64Data = await file.async("base64");
        images.push(`data:image/png;base64,${base64Data}`);
        setExtractedImages([...images]);
      });
    } catch (error) {
      console.error("Failed to extract content from DOCX", error);
    }
  };

  useEffect(() => {
    if (extractedImages.length > 0) {
      console.log("Extracted Images:", extractedImages);
    }
  }, [extractedImages]);

  useEffect(() => {
   
      console.log("Extracted Text:", extractedText);
    
  }, [extractedText]);

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

      
      {extractedText && (
        <div
          style={styles.text}
          dangerouslySetInnerHTML={{ __html: extractedText }}
        />
      )}

     
      {extractedImages.length > 0 && (
        <div style={styles.imagesContainer}>
          {extractedImages.map((image, index) => (
            
            <div key={index} style={styles.imageContainer}>
              <img
                src={image}
                alt={`Extracted Image ${index + 1}`}
                style={styles.image}
              />
            </div>
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
  imagesContainer: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: "10px",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
};

export default ExtractedTextDocx;
