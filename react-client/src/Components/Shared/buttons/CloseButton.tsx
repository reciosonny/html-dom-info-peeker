import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { CloseButtonModel } from "../../../model/Shared";


const RoundedCloseButton = ({ onClickClose }: CloseButtonModel) => {
  return (
    <div onClick={() => onClickClose()} className="rounded-close-btn">
      <AiOutlineClose size={15} />
    </div>
  );
};

const TransparentCloseButton = ({ onClickClose }: CloseButtonModel) => {
  return (
    <button type="button" className="transparent-button" onClick={() => onClickClose()}>
      <AiOutlineClose size={15} color="#546E7A" />
    </button>
  );
};

export { RoundedCloseButton, TransparentCloseButton };
