import React, { useState, useEffect, useRef, useContext, memo } from "react";
import { v4 as uuidv4 } from "uuid";
import MainModal from "../../Shared/modals/MainModal";
import GlobalContext from "../../../store/global-context";
import useLocalStorageStore from "../../../hooks/useLocalStorageStore";
import * as domUtils from "../../../utils/domUtils";
import Input from "../../Shared/inputs/Input";

const BookmarkPanel = memo(
    ({
        domType,
        elClassNames,
        onSaveBookmark,
        onClose,
        domId,
        elementId,
        targetElement,
    }: BookmarkPanelModel) => {
        const [txtInput, setTxtInput] = useState("");
        const [bookmarksStore, setBookmarksStore] = useLocalStorageStore(
            "bookmarks",
            []
        );
        const [capturedSelectedDom, setCapturedSelectedDom] = useState(null);
        const GlobalContextData = useContext(GlobalContext); //We use Context API to avoid prop drilling

        useEffect(() => {
            setCapturedSelectedDom(GlobalContextData.selectedDom);
            return () => { };
        }, []);

        const onSubmitBookmark = async (e: any) => {
            e.preventDefault();

            const domIdentifier =
                domUtils.getUniqueElementIdentifierByTagAndIndex(targetElement);
            const elId = targetElement.id;
            const randomCode = uuidv4();

            let bookmarkObj = {
                id: randomCode,
                title: txtInput || domType + elClassNames,
                elem: domIdentifier.elType,
                elId,
                classes: elClassNames,
                domIndex: domIdentifier.index,
            };

            const newBookmarks = [...bookmarksStore, bookmarkObj];

            GlobalContextData.onChangeBookmarks(); //emit event to communicate with App.js

            await setBookmarksStore(newBookmarks);

            setTxtInput("");

            await onSaveBookmark();
        };

        const onChangeText = (e: any) => {
            setTxtInput(e.target.value);
        };
        return (
            <MainModal
                type="bookmark"
                headerText="Save Bookmark"
                onClose={() => onClose()}
            >
                <form
                    className="frm-panel"
                    data-id={domId}
                    onSubmit={onSubmitBookmark}
                >
                    <Input
                        userInput={txtInput}
                        onChangeText={onChangeText}
                        placeHolder="Bookmark Name"
                    />
                    <label className="label-tag">{domType}</label>
                    <label className="label-id">{elementId}</label>
                    <label>{elClassNames}</label>
                </form>
            </MainModal>
        );
    }
);

export default BookmarkPanel;
