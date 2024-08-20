import React from "react";
import { BsFillBookmarkFill } from "react-icons/bs";
import { BookmarkButtonModel } from "../../../model/BookmarkStore";

const BookmarkStoreButton = ({ onOpenBookmark }: BookmarkButtonModel) => {
  return (
    <button
      className="bookmark-btn"
      onClick={() => onOpenBookmark()}
    >
      <BsFillBookmarkFill /> &nbsp; Bookmarks
    </button>
  );
};

export default BookmarkStoreButton;
