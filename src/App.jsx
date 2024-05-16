import { useState } from 'react'
import './App.css'
import showdown  from 'showdown'

function App() {
  const [htmlText, setHtmlText] = useState();

  // setHtmlText("<h1>Import a markdown file</h1>");

  const handleFileChange = (e) => {
    if (!e.target.files) return;

    let f = e.target.files[0]

    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      let text = reader.result;
      let converter = new showdown.Converter();
      let html      = converter.makeHtml(text);
      setHtmlText(html);
      console.log(html);
    });
    reader.readAsText(f);
  };

  return (
    <>
      <p>
        Import file: <input type="file" onChange={handleFileChange} />
      </p>

      <article className="journal" dangerouslySetInnerHTML={{ __html: htmlText }}>
      </article>
    </>
  )
}

export default App
