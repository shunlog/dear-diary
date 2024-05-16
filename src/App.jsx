import { useState } from 'react'
import './App.css'
import showdown  from 'showdown'

const readFile = (f, callback) => {
  // start asynchronously reading the file
  // and call the callback function with the result when finished
  const reader = new FileReader();
  reader.addEventListener("loadend", () => {
    callback(reader.result);
  });
  reader.readAsText(f);
}

/**
 * @param {String} HTML representing a single element.
 * @param {Boolean} flag representing whether or not to trim input whitespace, defaults to true.
 * @return {Element | null}
 */
function strToHTML(html, trim = true) {
  // https://stackoverflow.com/a/35385518
  // Process the HTML string.
  html = trim ? html.trim() : html;
  if (!html) return null;

  // Then set up a new template element.
  const template = document.createElement('template');
  template.innerHTML = html;
  const result = template.content;

  // if there's multiple children, wrap them in a div Element
  if (result.length === 1) return result[0];

  let div = document.createElement("div");
  div.append(result);
  return div;
}

function App() {
  const [journalStr, setJournalStr] = useState("");

  const updateMarkdownText = (text) => {
    // convert the markdown text to html
    let converter = new showdown.Converter({
      tables: true
    });
    let html_str = converter.makeHtml(text);

    setJournalStr(html_str);
  }

  const handleImgsUpload = (e) => {
    const files = e.target.files;
    const html = strToHTML(journalStr);

    Array.from(html.getElementsByTagName("img")).map((img) =>{
      const fn  = img.src.split("/").at(-1);
      const file = Array.from(files).find((f) => f.name == fn);
      if (file === undefined) return;
      const url = URL.createObjectURL(file);
      img.src = url;
    });

    setJournalStr(html.innerHTML);
  };

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    readFile(e.target.files[0], updateMarkdownText);
  };


  return (
    <>
      <p>
        Import file: <input type="file" onChange={handleFileChange} />
      </p>

      <p>
        Select images: <input type="file" id="input" multiple onChange={handleImgsUpload} />
      </p>

      <article className="journal" dangerouslySetInnerHTML={{ __html: journalStr }}>
      </article>
    </>
  )
}

export default App
