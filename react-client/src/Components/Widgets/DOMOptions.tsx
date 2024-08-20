import React from "react";
import { MdCenterFocusStrong, MdCenterFocusWeak, MdOutlineCommentBank, MdCommentBank } from "react-icons/md";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { GrTree } from "react-icons/gr";
import OptionsButton from "../Shared/buttons/OptionsButton";

const DOMOptions = ({ onClickBookmark, onClickAnnotation, onClickFocus, showAddBookmarkIcon, showAddAnnotationIcon, focusMode }: DomOptionsModel) => {
  return (
    <div className='dom-options-widget'>
      <OptionsButton onClick={onClickBookmark}>
        {showAddBookmarkIcon && <BsFillBookmarkFill color="#673ab7" />}
        {!showAddBookmarkIcon && <BsBookmark color="#673ab7" />}
      </OptionsButton>
      <OptionsButton onClick={() => { }} >
        <GrTree />
      </OptionsButton>
      <OptionsButton onClick={onClickAnnotation}>
        {showAddAnnotationIcon && <MdCommentBank color="#673ab7" />}
        {!showAddAnnotationIcon && <MdOutlineCommentBank color="#673ab7" />}
      </OptionsButton>
      <OptionsButton onClick={onClickFocus}>
        {!focusMode && <MdCenterFocusStrong color="#673ab7" />}
        {focusMode && <MdCenterFocusWeak color="#673ab7" />}
      </OptionsButton>
    </div>
  );
};

export default DOMOptions;
