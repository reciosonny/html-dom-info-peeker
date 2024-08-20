import React from "react";
import { DomHeaderModel } from "../../model/DomDetails";


const DomHeader = ({ tag, elementId, classNames }: DomHeaderModel) => {
  return (
    <div className="dialog-header">
      <span className="label-tag">{tag}</span>
      {elementId && <span className="">{elementId}</span>}
      {classNames.map((val: any) => (
        <span className={`${val.updated ? "highlight-div" : ""}`}>
          {val.name}
        </span>
      ))}
    </div>
  );
};

export default DomHeader;
