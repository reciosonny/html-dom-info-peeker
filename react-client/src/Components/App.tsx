import React, { useState } from "react";
import { hot } from "react-hot-loader";
import jss from "jss";
import DomInfoDialogBox from "./DomInfoDialogBox";
import { PRODUCTION_MODE } from "../keys";
import ErrorBoundary from "./ErrorBoundaryComponent";
import * as domUtils from "../utils/domUtils";
import * as chromeExtensionUtils from "../utils/chromeExtensionUtils";
import useLocalStorageStore from "../hooks/useLocalStorageStore";
import GlobalContext from "../store/global-context";
import axios from 'axios';
import SwitchButton from "./Shared/buttons/SwitchButton";
import BookmarkStore from "./Widgets/BookmarkStore";
import DomMinimalDetailsWidget from "./Widgets/DOMMinimalDetailsWidget";

// @ts-ignore
window.store = {
    focusMode: false,
    switchExtensionFunctionality: true,
    bookmarkBtnClicked: false, //we can use this to set a guard to `onClick` event we wired up using plain javascript to prevent those logic from getting mixed up
    DomInfoDialogBox: {
        children: [],
        classList: [],
    },
};

function App() {
    const [domInfo, setDomInfo] = useState([]);
    const [domLeanDetails, setDomLeanDetails] = useState({
        elId: "",
        elClassNames: [],
        domType: "",
        show: false,
    });

    // TODO: Use this once we're done with fixing bookmarks feature...
    const [stateConfigOptions, setStateConfigOptions] = useState({
        showAddBookmarkPanel: false,
        focusMode: false,
        addBookmarkModeEnabled: false,
    });

    const [selectedAddBookmarkDomElIdx, setSelectedAddBookmarkDomElIdx] =
        useState(null);
    const [showAddBookmarkPanel, setShowAddBookmarkPanel] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    // If this is enabled, disable events like mouse hover. If user clicks outside of add bookmark component, then set `add bookmark mode` to false.

    const [selectedElem, setSelectedElem] = useState<any>({});
    const [switchExtensionFunctionality, setExtensionFunctionality] =
        useState(true);

    const [bookmarksStore, setBookmarksStore, updateBookmarksStore] =
        useLocalStorageStore("bookmarks", []);
    const [annotationStore, setAnnotationStore] = useLocalStorageStore(
        "annotation",
        []
    );
    const [stateBookmarks, setStateBookmarks] = useState([]);

    const [domMinimalDetailsStyles, setDomMinimalDetailsStyles] = useState({
        width: "",
        positionY: 100,
        positionX: 0,
    });

    const onTurnOffExtension = () => {
        // unbind event listeners from document
        console.log("removing event listeners...");
        document.removeEventListener("click", documentOnClick, true);
        document.removeEventListener("mouseover", documentMouseOver, true);
        document.removeEventListener("mouseout", documentMouseOut, true);
        // END

        // removes border highlights added in DOM elements when it's clicked
        domInfo.forEach((val: any) => {
            const currEl = document.querySelector(`[data-id="${val.dataId}"]`);

            if (!currEl) return;

            if (currEl.classList.contains(val.cssClassesAssigned)) {
                currEl.classList.remove(val.cssClassesAssigned);
            }
        });

        setTimeout(() => {
            //remove left-over focused-dom highlights
            // @ts-ignore
            [...document.querySelectorAll(".focused-dom")].forEach((el) =>
                el.classList.remove("focused-dom")
            );
        }, 300);

        setDomInfo([]); //if DOM extension is turned off, empty the DOM info state array
        setExtensionFunctionality(false);
    };

    //#region Effects hook

    React.useEffect(() => {
        if (!PRODUCTION_MODE) {
            /**
             * Note: swap the urls for testing different websites. Sample websites for testing:
             * https://web.archive.org/web/20131014212210/http://stackoverflow.com/
             */
            // getPageContent('https://www.redfin.com/');
            // getPageContent(
            //   "https://web.archive.org/web/20131014212210/http://stackoverflow.com/"
            // );
            getPageContent("https://www.thefreedictionary.com/");
        } else {
            injectDOMEventInBody();

            chromeExtensionUtils.onMessageEvent(function (
                msg: any,
                sender: any,
                sendResponse: any
            ) {
                setExtensionFunctionality(true);

                if (msg.text === "are_you_there_content_script?") {
                    sendResponse({ status: "yes" });
                }
            });
        }

        return () => { };
    }, []);

    React.useEffect(() => {
        setStateBookmarks(bookmarksStore);

        return () => { };
    }, [bookmarksStore]);

    React.useEffect(() => {
        //dirty way to get the value from state since normal JS event handlers cannot communicate the state well with React
        // @ts-ignore
        window.store.switchExtensionFunctionality =
            switchExtensionFunctionality;

        return () => { };
    }, [switchExtensionFunctionality]);

    React.useEffect(() => {
        // @ts-ignore
        window.store.focusMode = focusMode;

        return () => { };
    }, [focusMode]);

    React.useEffect(() => {
        return () => { };
    }, [domInfo]);

    //#endregion Injectable event listeners
    const documentOnClick = async (e: any) => {
        e.preventDefault();
        if (!domUtils.isTrueTarget(e.target)) return;
        // @ts-ignore
        if (window.store.focusMode) return;
        let strClassList = "";
        // @ts-ignore
        if (!window.store.switchExtensionFunctionality) return;
        if (domUtils.hasDialogBox(e.target.dataset.id)) return;

        if (domUtils.isDOMDevTools(e.target)) return;
        //capture all classes of the dom for bookmark module
        for (let domClass of e.target.classList.values()) {
            if (domClass !== "focused-dom") {
                strClassList += `.${domClass}`;
            }
        }

        e.target.classList.remove("focused-dom"); //Note: We removed focused-dom class after click so that domUtils can extract the background color from the element, not the color from focused-dom class

        //get the least properties for bookmark module
        setSelectedElem({
            elClassNames: strClassList,
            domType: e.target.nodeName?.toLowerCase(),
            domId: e.target.getAttribute("data-id"),
            x: e.pageX,
            y: e.pageY,
            domTarget: e.target,
            domLeanDetails,
        });

        const elTarget = e.target;

        const extractedDomInfo = domUtils.extractDomInfo(elTarget);
        const pageYcoordinate = e.pageY;

        const sheet = jss
            .createStyleSheet(
                {
                    domBorder: {
                        border: `3px solid ${extractedDomInfo.bordercolor}`,
                        "border-radius": "8px",
                    },
                },
                { classNamePrefix: "custom-css" }
            )
            .attach();

        //for modifying style directly...
        e.target.classList.add(sheet.classes.domBorder);
        //sets data-id to the DOM
        e.target.setAttribute("data-id", extractedDomInfo.dataId);
        e.target.setAttribute("data-dom-lens-injected", true);

        // @ts-ignore
        setDomInfo((value) => {
            return [
                ...value,
                {
                    ...extractedDomInfo,
                    cssClassesAssigned: sheet.classes.domBorder,
                    x: e.pageX,
                    y: pageYcoordinate + 100,
                },
            ];
        });
        // Immediately-Invoked Function Expression algorithm to preserve y-coordinate value once the execution context is already finished.
        (function (pageYcoordinate) {
            setTimeout(async () => {
                //delay the y-coordinate change in microseconds to trigger the y-axis animation of dialog box
                setDomInfo((values: any) => {
                    const mappedValues = values.map((val: any, idx: number) => {
                        if (idx === values.length - 1) {
                            val.y = pageYcoordinate;
                        }
                        return val;
                    });

                    return mappedValues;
                });
            }, 10);
        })(pageYcoordinate);
    };

    const documentMouseOver = async (e: any) => {
        e.target.setAttribute("data-dom-lens-target", true); // data attribute to use as reference in domUtils.isTrueTarget to prevent unnecessary additional e.target
        document.querySelectorAll(".focused-dom").forEach((elTarget, idx) => {
            elTarget.classList.remove("focused-dom");
        });

        if (!containsBookmarkModule(e)) {
            if (
                // @ts-ignore
                !window.store.switchExtensionFunctionality ||
                // @ts-ignore
                window.store.focusMode
            )
                return;
                // @ts-ignore
            if (window.store.focusMode) return;

            const isNotSelectedDomFromBookmark =
                !domUtils.ancestorExistsByClassName(e.target, "selected-dom");
            if (domUtils.isDOMDevTools(e.target)) return;
            if (
                e.target.nodeName !== "HTML" &&
                isNotSelectedDomFromBookmark
                // && !focusMode
            ) {
                const domType = e.target.nodeName?.toLowerCase();
                setDomLeanDetails({
                    ...domLeanDetails,
                    elId: e.target.id,
                    // @ts-ignore
                    elClassNames: [...e.target.classList],
                    domType,
                    show: true,
                }); //note: we used `await` implementation to wait for setState to finish setting the state before we append the React component to DOM. Not doing this would result in a bug and the DOM details we set in state won't be captured in the DOM.

                e.target.classList.toggle("focused-dom");

                const elBoundingRect = e.target.getBoundingClientRect();

                setDomMinimalDetailsStyles({
                    width: `${Math.round(elBoundingRect.width - 30)}px`,
                    positionY: Math.round(
                        window.scrollY + (elBoundingRect.top - 30)
                    ),
                    positionX: Math.round(window.scrollX + elBoundingRect.left),
                });
            }
        }
    };
    const documentMouseOut = (e: any) => {
        e.target.removeAttribute("data-dom-lens-target");

        if (!containsBookmarkModule(e)) {
            if (
                // @ts-ignore
                !window.store.switchExtensionFunctionality ||
                // @ts-ignore
                window.store.focusMode
            )
                return;
            const isNotSelectedDomFromBookmark =
                !domUtils.ancestorExistsByClassName(e.target, "selected-dom");

            const isDomLensInjected =
                e.target.getAttribute("data-dom-lens-injected") === "true"; //note: if dialogbox is injected in the element, don't toggle focused-dom CSS class as this will cause residues and background highlights after being hovered

            if (
                !domUtils.isDOMDevTools &&
                e.target.nodeName !== "HTML" &&
                isNotSelectedDomFromBookmark &&
                !isDomLensInjected
            ) {
                e.target.classList.toggle("focused-dom");
            }
        }
    };

    //#region

    const injectDOMEventInBody = async () => {
        document.addEventListener("click", documentOnClick, true);
        document.addEventListener("mouseover", documentMouseOver, true);
        document.addEventListener("mouseout", documentMouseOut, true);
    };

    const getPageContent = async (url: any) => {
        if (!localStorage.getItem("webpage")) {
            const res = await axios.get(url);
            localStorage.setItem("webpage", res.data);
        }

        document.getElementById("samplePage")!.innerHTML = localStorage.getItem("webpage") as string;
        injectDOMEventInBody();
    };

    const handleRemoveDialogBox = (selectedIdx: any) => {
        setFocusMode(false);
        const filterDomInfosClicked = domInfo.filter(
            (val, idx) => idx !== selectedIdx
        );
        setDomInfo(filterDomInfosClicked);
    };

    const containsBookmarkModule = (e: any) => {
        const isBookmarkPanel = domUtils.ancestorExistsByClassName(
            e.target,
            "bookmark-panel"
        );
        return isBookmarkPanel;
    };

    const onClickAddBookmark = (idx: any) => {
        onChangeBookmarks();
        setSelectedAddBookmarkDomElIdx(idx);
        setShowAddBookmarkPanel(!showAddBookmarkPanel);
    };

    const onClickFocus = (isFocus: boolean) => {
        setFocusMode(isFocus);
    };

    // Re-render bookmarks list state here to update the bookmarks list
    const onChangeBookmarks = () => {
        setTimeout(() => {
            updateBookmarksStore(); //needs to be called so that bookmarksStore will get the latest update from localStorage
            setStateBookmarks(bookmarksStore);
        }, 500);
    };

    return (
        <GlobalContext.Provider
        // @ts-ignore
            value={{ selectedDom: selectedElem.domTarget, onChangeBookmarks }}
        >
            {/* website page renders here... */}
            {!PRODUCTION_MODE && <div id="samplePage"></div>}
            {/* <div onClick={onTurnOffExtension}>{switchExtensionFunctionality && <DomSwitch />}</div> */}
            <div onClick={onTurnOffExtension}>
                {switchExtensionFunctionality && (
                    <SwitchButton display="Disable DOM Lens" />
                )}
            </div>

            {switchExtensionFunctionality && (
                <div id="domLensApp">
                    {domInfo.map((domInfo: any, idx: any) => {
                        const elBookmarks = bookmarksStore.map(
                            ({ elem, domIndex }: any) =>
                                domUtils.getElementByTagAndIndex(elem, domIndex)
                        );
                        const hasExistingBookmark = elBookmarks.some(
                            (el: any) => el === domInfo.domElement
                        );
                        const hasExistingAnnotations = domUtils.hasAnnotations(
                            annotationStore,
                            domInfo.domElement
                        );

                        return (
                            <ErrorBoundary>
                                <DomInfoDialogBox
                                    key={idx}
                                    idx={idx}
                                    elementId={domInfo.id}
                                    tag={domInfo.tag}
                                    classNames={domInfo.classNames}
                                    classNamesString={domInfo.classNamesString}
                                    parentElement={domInfo.parent}
                                    childElements={domInfo.children}
                                    top={domInfo.y}
                                    left={domInfo.x}
                                    onClose={handleRemoveDialogBox}
                                    fontsize={domInfo.size}
                                    fontfamily={domInfo.family}
                                    textcolor={domInfo.textcolor}
                                    backgroundColor={domInfo.backgroundColor}
                                    borderclr={domInfo.bordercolor}
                                    domElement={domInfo.domElement}
                                    uniqueID={domInfo.uniqueID}
                                    dataAttributes={domInfo.attributes}
                                    focusedState={onClickFocus}
                                    hasExistingBookmark={
                                        selectedAddBookmarkDomElIdx === idx ||
                                        hasExistingBookmark
                                    }
                                    hasExistingAnnotations={
                                        hasExistingAnnotations
                                    }
                                    onRemoveBookmarkEmit={onClickAddBookmark}
                                    onHover={() =>
                                        setDomLeanDetails({
                                            ...domLeanDetails,
                                            show: false,
                                        })
                                    }
                                />
                            </ErrorBoundary>
                        );
                    })}

                    {/* Note: This component is used to inject this to display minimal details the DOM has */}
                    {domLeanDetails.show && (
                        <DomMinimalDetailsWidget
                            elId={domLeanDetails.elId}
                            elClassNames={domLeanDetails.elClassNames}
                            domType={domLeanDetails.domType}
                            width={domMinimalDetailsStyles.width}
                            positionX={domMinimalDetailsStyles.positionX}
                            positionY={domMinimalDetailsStyles.positionY}
                        />
                    )}
                    <BookmarkStore bookmarks={stateBookmarks} />
                </div>
            )}

            {/* 
      // TODO by Sonny: Build DevTools to change webpage inside localhost dynamically
      <div id="divDevTools" style={{ padding: '10px', position: 'fixed', right: '50px', bottom: '50px', background: '#fff', border: '2px solid #000', height: '250px', width: '250px' }}>
        <h1>Developer Tools here..</h1>
        <input type="text" name="" id="" placeholder="input url to render page" onChange={e => setTxtFieldPageUrl(e.target.value)} />
        <br />
        <button onClick={() => getPageContent(txtFieldPageUrl)}>Enter</button>
      </div> 
      */}
        </GlobalContext.Provider>
    );
}

// export default App;
export default hot(module)(App);
