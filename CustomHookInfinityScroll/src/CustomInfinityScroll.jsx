import {useEffect, useRef, useState} from "react";

const useInfiniteScroll = (callback, hasMore, isLoading, loadedPages) => {
  const [page, setPage] = useState(1); // Начальная страница / start page
  const scrollRef = useRef(null); // Ссылка на контейнер / link on container
  const isMounted = useRef(false); // Флаг монтирования компонента / component mount flag

  // Обработчик скролла
  // Scroll handler
  const handleScroll = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Если пользователь достиг конца
      if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [hasMore, isLoading]);

  // Запрос данных на основе изменения страницы
  // Request based on page changes
  useEffect(() => {
    // Проверяем, была ли страница уже загружена или это первый рендер
    // Check, if page has already been download or it's the first rendering
    if ((!loadedPages.includes(page) && hasMore && !isLoading) || !isMounted.current) {
      console.log(`Запрос на страницу: ${page}`);
      callback(page);

      // Устанавливаем флаг после первого рендера
      // Set flag after the first render
      if (!isMounted.current) {
        isMounted.current = true;
      }
    }
  }, [page, hasMore, isLoading, callback, loadedPages]);

  // Возвращаем ref и текущую страницу
  // Return ref and current page
  return { scrollRef, page, setPage };

};

export default useInfiniteScroll;



