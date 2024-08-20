import React from "react";
import { TransparentCloseButton } from "../buttons/CloseButton";
import { MainModalModel } from "../../../model/Shared";

const MainModal = ({
    children,
    type = "",
    headerText = "",
    onClose,
}: MainModalModel) => {
    return (
        <div className={`${type}-panel`}>
            {headerText.trim() !== "" && (
                <div className={`${type}-header`}>
                    {headerText}
                    <TransparentCloseButton onClickClose={() => onClose()} />
                </div>
            )}
            {children}
        </div>
    );
};

export default MainModal;
