import React from 'react'
import ExtractedTextPdf from './components/ExtractedTextPdf'
import ExtractedTextDocx from './components/ExtractedTextDocx'
import ExtractedImageFromDocx from './components/ExtractedImageFromDocx'
import DocxToImage from './components/DocxToImage'

export default function App() {
  return (
    <div>
      {/* <ExtractedTextPdf /> */}
      {/* <ExtractedTextDocx /> */}
      {/* <ExtractedImageFromDocx /> */}
      <DocxToImage />
    </div>
  )
}
