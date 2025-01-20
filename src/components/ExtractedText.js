// ExtractedText.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExtractedText = () => {
  const [extractedText, setExtractedText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ExtractedText');
        setExtractedText(response.data);
      } catch (error) {
        console.error('Error fetching extracted text:', error);
        // Handle error
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Extracted Text</h2>
      <p>{extractedText}</p>
    </div>
  );
};

export default ExtractedText;