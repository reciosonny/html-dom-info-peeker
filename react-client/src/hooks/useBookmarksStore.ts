import React from 'react'

const useBookmarksStore = () => {
  
  const [state, setState] = React.useState([]);

  
  React.useEffect(() => {
    
    const storedBookmarks = localStorage.getItem("bookmarks");

    if (storedBookmarks) {
      setState(JSON.parse(storedBookmarks) ?? []);    
    }

    return () => {
      
    }
  }, []);


  const setBookmarksStore = (value: any) => {
    
    localStorage.setItem('bookmarks', value);
  }

  return [state, setBookmarksStore];
}

export default useBookmarksStore