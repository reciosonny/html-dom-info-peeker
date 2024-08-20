import React from "react";
import { SwitchButtonModel } from "../../../model/Shared";

const SwitchButton = ({ display }: SwitchButtonModel) => {
  return (
    <button id="switchButton" className="switch-button" hidden={false}>
      {display}
    </button>
  );
};

export default SwitchButton;
