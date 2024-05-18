import { useState } from 'react'
import './Journal.css'
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

function dateToInputValueStr(d){
  return d.toISOString().split('T')[0];
}

function todayDate(){
  const dnow = new Date();
  const offset = dnow.getTimezoneOffset();
  const offset_now = new Date(dnow.getTime() - (offset*60*1000));
  return dateToInputValueStr(offset_now);
}

function Journal() {
  const getSelDate = () => {
    const d = localStorage.getItem("journalDate");
    if (d !== null) return dateToInputValueStr( new Date(d));
    return todayDate();
  }

  const getJournalStr = (dstr) => {
    const s = localStorage.getItem("journalStr" + dstr);
    if (s !== null ) return s;
    return "<h1> Nothing here yet </h1> </br> Import a markdown file to get started.";
  }

  const storeJournalStr = (s, dstr) => {
    localStorage.setItem("journalStr" + dstr, s);
  }

  const [selDate, setSelDate] = useState(getSelDate());
  const [journalStr, setJournalStr] = useState(getJournalStr(selDate));

  const updateMarkdownText = (md_str) => {
    // convert the markdown text to html
    const converter = new showdown.Converter({
      tables: true
    });
    const html_str = converter.makeHtml(md_str);

    setJournalStr(html_str);
    storeJournalStr(html_str, selDate);
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

  const setDate = (date_str) => {
    setSelDate(date_str);
    localStorage.setItem("journalDate", date_str);
    setJournalStr(getJournalStr(date_str));
  }

  const handleDateChange = (e) => {
    setDate(e.target.value);
  }

  const getNextDate = (d_str, backward=false) => {
    const d = new Date(d_str);
    const inc = backward ? -1 : 1;
    for (let i = 0; i < 3000; i++) {
      d.setDate(d.getDate() + inc);
      const date_str = dateToInputValueStr(d);
      const s = localStorage.getItem("journalStr" + date_str);
      if (s !== null) {
        return date_str;
      }
    }
    return null;
  }

  const handleButtonPrev = (e) => {
    const date_str = getNextDate(selDate, true);
    if (date_str) {
      setDate(date_str);
    }
  }

  const handleButtonNext = (e) => {
    const date_str = getNextDate(selDate);
    if (date_str) {
      setDate(date_str);
    }
  }

  return (
    <>
      <p>
        Import file: <input type="file" onChange={handleFileChange} />
      </p>

      <p>
        Select images: <input type="file" id="input" multiple onChange={handleImgsUpload} />
      </p>
      <p>
        Select date: <input type="date" value={selDate} onChange={handleDateChange} />
      </p>
      <p>
        <input name="" type="button" value="Prev" onClick={handleButtonPrev} />
        <input name="" type="button" value="Next" onClick={handleButtonNext} />
      </p>

      <article className="journal" dangerouslySetInnerHTML={{ __html: journalStr }}>
      </article>
    </>
  )
}

export default Journal
