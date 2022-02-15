
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './readImage.less';
 
function ReadImage() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
 
  const handleChange = (event: any) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));
  }
 
  const handleClick = () => {
  
    Tesseract.recognize(
      imagePath,'eng',
      { 
        logger: m => console.log(m) 
      }
    )
    .catch (err => {
      console.error(err);
    })
    .then((result: any) => {
      // Get Confidence score
      //let confidence = result.confidence
     debugger
      let text = result.data.text
      setText(text);
  
    })
  }
 
  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual imagePath uploaded</h3>
        <img 
           src={imagePath} className="App-image" alt="logo"/>
        
          <h3>Extracted text</h3>
        <div className="text-box">
          <p> {text} </p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{height:50}}> convert to text</button>
      </main>
    </div>
  );
}
 
export default ReadImage
