import { useState, useRef, useCallback } from "react";
import "./App.css";
import useFetch from "./useFetch";
function App() {
  const [pageNumber, setpageNumber] = useState(1);
  const [query, setQuery] = useState("hello");
  const { books, hasMore, loading, error } = useFetch(query, pageNumber);

  const observer = useRef();
  const lastele = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setpageNumber(prev => prev + 1);
          console.log("visible");
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleChange(e) {
    setQuery(e.target.value);
    setpageNumber(1);
  }
  return (
    <div className="app">
      <input type="text" value={query} onChange={handleChange} />
      <h3>list</h3>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastele} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      <div>{loading && "loading..."}</div>
      <div>{error && "error"}</div>
    </div>
  );
}

export default App;
