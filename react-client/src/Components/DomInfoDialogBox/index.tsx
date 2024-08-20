import React, { useState, useRef } from "react";
import * as domUtils from "../../utils/domUtils";
import useLocalStorageStore from "../../hooks/useLocalStorageStore";
import useDraggable from "../../hooks/useDraggable";
import FocusedTargetedElement from "../FocusedTargetedElement";
import { RoundedCloseButton } from "../Shared/buttons/CloseButton";
import DOMOptions from "../Widgets/DOMOptions";
import DomHeader from "../DomInfo/DomHeader";
import DomDetails from "../DomInfo/DomDetails";
import ParentDetails from "../DomInfo/ParentDetails";
import ChildDetails from "../DomInfo/ChildDetails";
import AttributeDetails from "../DomInfo/AttributeDetails";
import AnnotationPanel from "../Panels/annotation/AddAnnotationPanel";
import BookmarkPanel from "../Panels/bookmark/AddBookmarkPanel";

let domObserver;

const DomInfoDialogBox = ({
    key,
    elementId,
    idx,
    tag,
    classNames,
    classNamesString,
    parentElement,
    childElements,
    top,
    left,
    onClose,
    fontsize,
    fontfamily,
    textcolor,
    backgroundColor,
    borderclr,
    uniqueID,
    dataAttributes,
    domElement,
    focusedState,
    hasExistingBookmark,
    hasExistingAnnotations,
    onRemoveBookmarkEmit,
    onHover,
}: DomInfoModel) => {
    const [domInfo, setDomInfo] = useState<DomModel>({
        tag: "",
        classNames: [],
        parent: "",
        children: [],
        fontsize: "",
        fontfamily: "",
        textcolor: "",
        borderclr: "",
        uniqueID: "",
        dataAttributes: "",
        domElement: "",
    });
    const [focusMode, setFocusMode] = useState(false);
    const [showAddBookmarkPanel, setShowAddBookmarkPanel] = useState(false);
    const [stateHasExistingBookmark, setStateHasExistingBookmark] =
        useState(false);
    const [stateHasExistingAnnotation, setStateHasExistingAnnotation] =
        useState(false);
    const [showAddAnnotationsPanel, setShowAddAnnotationsPanel] =
        useState(false);
    const [bookmarksStore, setBookmarksStore, updateBookmarksStore] =
        useLocalStorageStore("bookmarks", []);
    const [annotationStore, setAnnotationStore, getAnnotationStoreUpdates] =
        useLocalStorageStore("annotation", []);
    const [focusedTargetedElementStyles, setFocusedTargetedElementStyles] =
        useState({
            leftPosition: "",
            topPosition: "",
            height: "",
            width: "",
            opacity: 0,
        });

    const initializeDomObserver = async () => {
        const targetNode = domElement;
        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true };
        // Callback function to execute when mutations are observed
        const callback = (mutationsList: any, observer: any) => {
            for (const mutation of mutationsList) {
                if (domElement === mutation.target) {
                    const newClassList = [...mutation.target.classList]
                        .map((name) => {
                            const updated = !classNames.some(
                                (existingClass: any) =>
                                    existingClass.slice(1) === name
                            ); //slice/remove the dot(.)
                            return {
                                name: `.${name}`,
                                updated,
                            };
                        })
                        .filter(
                            (obj) =>
                                obj.name !== ".focused-dom" &&
                                obj.name !== ".focused-element" &&
                                !obj.name.includes("custom-css")
                        );
                    const newChildren = [...mutation.target.children].map(
                        (child) => {
                            // If it doesn't exist in existing children the first time dialogbox shows up, then it's a new child
                            const updated = !childElements.some(
                                (val: any) => val.element === child
                            );
                            return {
                                id: child.id ? "#" + child.id : null,
                                class: child.className
                                    ? "." + child.className
                                    : null,
                                tag: child.localName,
                                updated,
                            };
                        }
                    );
                    setDomInfo({
                        ...domInfo,
                        children: newChildren,
                        classNames: newClassList,
                    }); //need to call window.store.children here for updated data
                }
            }
        };

        domObserver = new MutationObserver(callback);
        domObserver.observe(targetNode, config);
    };
    React.useEffect(() => {
        const classNamesWithStatus = classNames.map((name: any) => ({
            name,
            updated: false,
            removed: false,
        }));
        const childrenWithStatus = childElements.map((child: any) => ({
            ...child,
            updated: false,
            removed: false,
        }));
        
        // @ts-ignore
        window.store.DomInfoDialogBox.children = childrenWithStatus;
        // @ts-ignore
        window.store.DomInfoDialogBox.classList = classNamesWithStatus;

        setDomInfo({
            ...domInfo,
            tag,
            classNames: classNamesWithStatus,
            parent,
            children: childrenWithStatus,
            fontsize,
            fontfamily,
            textcolor,
            borderclr,
            uniqueID,
            dataAttributes,
            domElement,
        }); //set DOM info here...
        // initializeDomObserver();

        return () => {
            // domObserver.disconnect();
        };
    }, [classNames, childElements]);

    React.useEffect(() => {
        // if the DOM has existing bookmark, enable it by default.
        setStateHasExistingBookmark(hasExistingBookmark);
        return () => { };
    }, [hasExistingBookmark]);

    React.useEffect(() => {
        setStateHasExistingAnnotation(hasExistingAnnotations);
        return () => { };
    }, [hasExistingAnnotations]);

    const removeExistingBookmark = () => {
        const domIdentifier =
            domUtils.getUniqueElementIdentifierByTagAndIndex(domElement);
        const duplicateIndex = bookmarksStore.findIndex(
            (obj: any) =>
                obj.domIndex === domIdentifier.index &&
                obj.elem === domIdentifier.elType
        );
        const filteredBookmark = bookmarksStore.filter(
            (idx: any) => idx !== duplicateIndex
        );
        setBookmarksStore(filteredBookmark);
        setShowAddBookmarkPanel(false);
        onRemoveBookmarkEmit();
    };

    const onClickAddBookmark = () => {
        stateHasExistingBookmark
            ? removeExistingBookmark()
            : setShowAddBookmarkPanel(!showAddBookmarkPanel);
        setStateHasExistingBookmark(!stateHasExistingBookmark);
        setShowAddAnnotationsPanel(false);
    };

    const onClickAddAnnotation = () => {
        !stateHasExistingAnnotation
            ? setStateHasExistingAnnotation(!stateHasExistingAnnotation)
            : setStateHasExistingAnnotation(
                domUtils.hasAnnotations(annotationStore, domElement)
            );
        setShowAddAnnotationsPanel(!showAddAnnotationsPanel);
        setShowAddBookmarkPanel(false);
    };

    const onRemoveAnnotation = () => {
        getAnnotationStoreUpdates();
        setStateHasExistingAnnotation(false);
        setShowAddAnnotationsPanel(false);
    };

    const onUpdatedAnnotation = () => {
        getAnnotationStoreUpdates();
        setStateHasExistingAnnotation(true);
    };

    const onClickCloseDialogBox = () => {
        const focusedEl = document.querySelectorAll(".focused-element");
        console.log("on close dialogbox...");
        if (focusedEl.length > 0 && domElement !== focusedEl[0]) {
            console.log("no focused element found...");
            return;
        }

        console.log("dom element: ", domElement);

        domElement.classList.remove(
            domElement.className
                .split(" ")
                .filter((cls: any) => cls.includes("custom-css"))
                .toString()
        );
        domElement.classList.remove("focused-element");
        setFocusMode(false);

        setFocusedTargetedElementStyles({
            ...focusedTargetedElementStyles,
            leftPosition: `0px`,
            topPosition: `0px`,
            height: `0px`,
            width: `0px`,
            opacity: 0,
        });
        onClose(idx, elementId, uniqueID);
    };

    const onClickFocus = (elTarget: any) => {
        const existingFocus =
            document.getElementsByClassName("focused-element");
        const cutoutTarget = document.querySelector(
            ".focused-targeted-element"
        );

        if (existingFocus[0] === elTarget) {
            existingFocus[0].classList.remove("focused-element");
            setFocusedTargetedElementStyles({
                ...focusedTargetedElementStyles,
                opacity: 0,
            });
            focusedState(false);
            setFocusMode(false);
        } else {
            if (existingFocus.length === 0) {
                updateFocusedTargetedElementStyles(elTarget, cutoutTarget);
                focusedState(true);
            }
        }
    };

    const updateFocusedTargetedElementStyles = (elTarget: any, cutoutTarget: Element | null) => {
        setFocusMode(!focusMode);

        const elProperties = elTarget.getBoundingClientRect();

        setFocusedTargetedElementStyles({
            ...focusedTargetedElementStyles,
            leftPosition: `${elProperties.x + window.scrollX}px`,
            topPosition: `${elProperties.y + window.scrollY}px`,
            height: `${elProperties.height}px`,
            width: `${elProperties.width}px`,
            opacity: 1,
        });
        elTarget.classList.toggle("focused-element");
    };

    const dragRef = useRef(null);
    useDraggable(dragRef);

    return (
        <>
            <FocusedTargetedElement {...focusedTargetedElementStyles} />
            <div
                id={uniqueID}
                className="dom-info-dialog-box"
                onMouseEnter={onHover}
                style={{
                    top: `${top}px`,
                    left: `${left}px`,
                    border: `3px solid ${borderclr}`,
                }}
                ref={dragRef}
            >
                <RoundedCloseButton onClickClose={onClickCloseDialogBox} />
                <DOMOptions
                    focusMode={focusMode}
                    onClickFocus={() => onClickFocus(domElement)}
                    onClickBookmark={onClickAddBookmark}
                    onClickAnnotation={onClickAddAnnotation}
                    showAddBookmarkIcon={stateHasExistingBookmark}
                    showAddAnnotationIcon={stateHasExistingAnnotation}
                />
                <DomHeader
                    tag={tag}
                    elementId={elementId}
                    classNames={domInfo.classNames}
                />
                <DomDetails
                    fontsize={fontsize}
                    textcolor={textcolor}
                    backgroundColor={backgroundColor}
                    fontfamily={fontfamily}
                />
                <ParentDetails
                    tag={parentElement.tag}
                    id={parentElement.id}
                    classes={parentElement.classes}
                />
                <AttributeDetails dataAttributes={dataAttributes} />
                <ChildDetails childElements={domInfo.children} />
                {showAddBookmarkPanel && (
                    <BookmarkPanel
                        domType={tag}
                        elClassNames={classNamesString}
                        domId={uniqueID}
                        elementId={elementId}
                        onSaveBookmark={() => setShowAddBookmarkPanel(false)}
                        onClose={() => setShowAddBookmarkPanel(false)}
                        targetElement={domElement}
                    />
                )}
                {showAddAnnotationsPanel && (
                    <AnnotationPanel
                        onRemoveAnnotation={onRemoveAnnotation}
                        targetElement={domElement}
                        onUpdatedAnnotation={onUpdatedAnnotation}
                    />
                )}
            </div>
        </>
    );
};

export default DomInfoDialogBox;
