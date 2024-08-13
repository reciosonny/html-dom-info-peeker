interface DomInfoModel {
    key: string;
    elementId: string;
    idx: string;
    tag: string;
    classNames: any;
    classNamesString: string;
    parentElement: any
    childElements: any
    top: number
    left: number
    onClose: any;
    fontsize: string;
    fontfamily: string;
    textcolor: string;
    backgroundColor: string;
    borderclr: string;
    uniqueID: string;
    dataAttributes: any;
    domElement: any;
    focusedState: any;
    hasExistingBookmark: boolean;
    hasExistingAnnotations: boolean;
    onRemoveBookmarkEmit: any;
    onHover: () => void;
}
