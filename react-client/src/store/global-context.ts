import React from 'react';


const GlobalContext = React.createContext({
  selectedDom: null,
  onChangeBookmarks: () => {},
  onClickFocus: () => {}
});

GlobalContext.displayName = "GlobalContext";



export default GlobalContext;