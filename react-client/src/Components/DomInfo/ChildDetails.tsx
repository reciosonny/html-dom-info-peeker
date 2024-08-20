import React from "react";
import { ChildDetailsModel } from "../../model/DomDetails";

const ChildDetails = ({ childElements }: ChildDetailsModel) => {
  const [filteredChildren, setFilteredChildren] = React.useState([]);
  const [seeMoreChild, setSeeMoreChild] = React.useState(true);
  const numChildrenToDisplay = !seeMoreChild ? filteredChildren.length : 2;
  const leftover = filteredChildren.length - 2;

  const handleSeeMoreChild = () => {
    setSeeMoreChild(!seeMoreChild);
  };

  React.useEffect(() => {
    const filteredList = childElements.filter(
      (clsname: any) => clsname.id !== "#domInfoHighlight"
    );

    setFilteredChildren(filteredList);

    return () => { };
  }, [childElements]);

  return (
    <>
      <div className="dialog-label">Children[{filteredChildren.length}]</div>
      <div className="dialog-list">
        {filteredChildren.slice(0, numChildrenToDisplay).map((val: any) => (
          <div className={val.updated && "highlight-div"}>
            <div className="dom-details-tag">{val.tag}</div>
            {val.id}
            {val.class &&
              val.class
                .replace(/  /g, ".")
                .replace(/ /g, ".")
                .replace(/,,/g, ".")}
            <br />
          </div>
        ))}
      </div>
      {filteredChildren.length > 2 && (
        <div className="see-more" onClick={handleSeeMoreChild}>
          {seeMoreChild ? `... ${leftover} more` : `... see less`}
        </div>
      )}
    </>
  );
};

export default ChildDetails;
