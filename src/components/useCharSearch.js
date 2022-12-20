import { useEffect, useState } from "react";

export default function useCharSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const controller = new AbortController();
    const signal = controller.signal;
    const requestOptions = {
      method: "GET",
      redirect: "follow",
      signal: signal,
    };
    const params = { name: query, page: pageNumber };
    fetch(
      `https://xivapi.com/character/search?name=${params.name}&page=${params.page}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.Results);
        setBooks((prevBooks) => {
          return [
            ...new Set([...prevBooks, ...result.Results.map((b) => b.Name)]),
          ];
        });
        setHasMore(result.Results.length > 0);
        setLoading(false);
      })
      .catch((error) => {
        if (signal.aborted) return;
        // console.log(signal.aborted);
        setError(true);
        return console.log("error", error.message);
      });

    return () => controller.abort();
  }, [query, pageNumber]);
  return { loading, error, books, hasMore };
}
