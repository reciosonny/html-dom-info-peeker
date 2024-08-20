import React from "react";
import { ParentDetailsModel } from "../../model/DomDetails";

const ParentDetails = ({ tag, id, classes }: ParentDetailsModel) => {
  return (
    <>
      <div className="dialog-label" style={{ marginTop: "5px" }}>
        Parent
      </div>
      <div className="dialog-parent-details">
        <div className="dom-details-tag">{tag}</div>
        {id}
        {classes.map((val: any) => `.${val}`)}
      </div>
    </>
  );
};

export default ParentDetails;
