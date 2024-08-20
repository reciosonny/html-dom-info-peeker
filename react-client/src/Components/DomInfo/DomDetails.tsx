import React from "react";
import { ColorDetailsModel, DomDetailsModel } from "../../model/DomDetails";

const ColorDetails = ({ color }: ColorDetailsModel) => {
  return (
    <>
      <div
        className="display-dot"
        style={{
          background: color,
        }}
      ></div>
      <span style={{ color: "#455A64" }}>{color}</span>
    </>
  );
};

const DomDetails = ({ fontsize, textcolor, backgroundColor, fontfamily }: DomDetailsModel) => {
  return (
    <>
      <div className="flex-row">
        <div className="flex-column">
          <div className="dialog-details"> {fontsize}</div>
          <div className="dialog-label">Size</div>
        </div>
        <div className="flex-column">
          <div className="dialog-details">
            <ColorDetails color={textcolor} />
          </div>
          <div className="dialog-label">Text-Color</div>
        </div>
        <div className="flex-column">
          <div className="dialog-details">
            <ColorDetails color={backgroundColor} />
          </div>
          <div className="dialog-label">Background-Color</div>
        </div>
      </div>
      <div className="dialog-details">{fontfamily}</div>
      <div className="dialog-label">Font Family</div>
    </>
  );
};

export default DomDetails;
