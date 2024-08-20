import React, { useEffect, useContext, useState } from "react";
import BookmarkStoreButton from "./BookmarkStoreButton";
import useLocalStorageStore from "../../../hooks/useLocalStorageStore";
import { TransparentCloseButton } from "../../Shared/buttons/CloseButton";
import BookmarkItemList from "./BookmarkItemList";
import GlobalContext from "../../../store/global-context";
import * as domUtils from "../../../utils/domUtils"
import { BookmarkStoreModel } from "../../../model/BookmarkStore";

const BookmarkStore = ({ bookmarks }: BookmarkStoreModel) => {
  const [showBookmarkButton, setShowBookmarkButton] = useState(false);
  const [showBookmarkWidget, setShowBookmarkWidget] = useState(false);
  const [retrievedEl, setRetrievedEl] = useState({});
  const [savedElNode, setRetrievedElNode] = useState(null);
  const [bookmarksStore, setBookmarksStore, getBookmarksStoreUpdates] = useLocalStorageStore("bookmarks", []);
  const GlobalContextData = useContext(GlobalContext); //We use Context API to avoid prop drilling

  useEffect(() => {
    getBookmarksStoreUpdates();
    if (showBookmarkWidget) return
    if (bookmarks.length !== 0) {
      setShowBookmarkButton(true);
    } else {
      setShowBookmarkButton(false);
    }
    return () => { };
  }, [bookmarks]);

  const onOpenBookmarkWidget = () => {
    setShowBookmarkButton(false);
    setShowBookmarkWidget(true);
  };

  const onCloseBookmarkWidget = () => {
    setShowBookmarkButton(true);
    setShowBookmarkWidget(false);
  };

  const onEditBookmark = (e: any, updatedTitle: string, bookmarkID: any) => {
    const duplicateBookmark = bookmarks.find((obj: any) => obj.id === bookmarkID);
    duplicateBookmark.title = updatedTitle;
    setBookmarksStore(bookmarks);
  };

  const onRemoveBookmark = (e: any) => {
    const selectedBookmarkIdx = bookmarksStore.findIndex((data: any) => data.id === e.currentTarget.getAttribute("data-id"));
    if (selectedBookmarkIdx !== -1) {
      const newBookmarks = bookmarksStore.filter((idx: any) => idx !== selectedBookmarkIdx);
      setBookmarksStore(newBookmarks);
      if (newBookmarks.length === 0) {
        setShowBookmarkButton(false);
        setShowBookmarkWidget(false);
        setBookmarksStore(null);
      }
      GlobalContextData.onChangeBookmarks();
    }
  };

  const onHoverBookmark = async (e: any) => {
    const selectedBookmark = bookmarksStore.find((data: any) => e.currentTarget.getAttribute("data-bookmark-id") === data.id);

    const elType = selectedBookmark.elem;

    const retrievedElement = domUtils.getElementByTagAndIndex(elType, selectedBookmark.domIndex);

    const focusedDomLength = document.querySelectorAll(".focused-dom").length;
    for (let i = 0; i < focusedDomLength; i++) {
      document.querySelectorAll(".focused-dom")[i].classList.remove("focused-dom");
    }

    await setRetrievedEl({ elClassNames: selectedBookmark.classes, elem: selectedBookmark.elem, elId: selectedBookmark.elId });

    retrievedElement.classList.add("focused-dom");
    retrievedElement.scrollIntoView({ block: "center", behavior: 'smooth' });

    await setRetrievedElNode(retrievedElement);
  }

  return (
    <>
      <div className='bookmark-widget' hidden={!showBookmarkWidget}>
        <div className='widget-header'>
          <label>Bookmarks from this page</label>
          <TransparentCloseButton onClickClose={onCloseBookmarkWidget} />
        </div>
        <div className='widget-body flex-column'>
          {bookmarks.map((data: any, index: number) => (
            <BookmarkItemList
              data={data}
              index={index}
              onEdit={onEditBookmark}
              onRemove={(e: any) => onRemoveBookmark(e)}
              onHover={(e:any) => onHoverBookmark(e)}
            />
          ))}
        </div>
      </div>
      {showBookmarkButton && <BookmarkStoreButton onOpenBookmark={onOpenBookmarkWidget} />}
    </>
  );
};

export default BookmarkStore;
