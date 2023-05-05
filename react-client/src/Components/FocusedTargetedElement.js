import React from "react";

const FocusedTargetedElement = ({ leftPosition, topPosition, height, width, opacity }) => {
  return (
    <div
      className="focused-targeted-element"
      style={{ left: leftPosition, top: topPosition, height, width, opacity }}
    ></div>
  );
};

export default FocusedTargetedElement;
