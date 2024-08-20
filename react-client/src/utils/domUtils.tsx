import { v4 as uuidv4 } from 'uuid';

// Recursion algorithm. Performance may be slower so let's improve the tail-recursion algorithm later
// TODO: Offer another function for this one which checks for multiple classNames needed checking
function ancestorExistsByClassName(element: any, className: any) {
    if (!element) return false;
    if (element.className === className) {
        return true;
    }
    if (!element.parentElement) return false;

    if (element.parentElement.className !== className) {
        return ancestorExistsByClassName(element.parentElement, className);
    }

    return true;
}

function ancestorExistsByClassNames(element: any, classNames: any) {
    if (!element) return false;
    if (classNames.some((className: any) => className === element.className)) {
        return true;
    }
    if (!element.parentElement) return false;

    if (element.parentElement.className !== classNames) {
        return ancestorExistsByClassName(element.parentElement, classNames);
    }

    return true;
}

function ancestorExistsByID(element: any, idName: any) {
    if (!element) return false;
    if (!element.parentElement) return false;

    if (element.parentElement.id === idName) return true;

    if (element.id === idName) return true;

    if (element.parentElement.id !== idName) {
        return ancestorExistsByID(element.parentElement, idName);
    }

    return true;
}

// This algorithm gets the unique element identifier by using element tag(e.g. p, div, span, input), and the index where that particular element is located
function getUniqueElementIdentifierByTagAndIndex(elTarget: any) {
    const result = [
        // @ts-ignore
        ...document.querySelectorAll(elTarget.tagName.toLowerCase()),
    ].reduce(
        (acc, dom, idx) => {
            if (dom === elTarget) {
                acc.elType = dom.tagName.toLowerCase();
                acc.index = idx;
            }

            return acc;
        },
        { elType: "", index: 0 }
    );

    return result;
}

// gets element by element tag and index location
function getElementByTagAndIndex(elType: any, idxToFind: any) {
    // @ts-ignore
    const retrievedElement = [...document.querySelectorAll(elType)].find(
        (dom, idx) => idx === idxToFind
    );

    return retrievedElement;
}

// removes all customed css from classnames in widget
function customWidgetFilter(toFilter: any) {
    if (toFilter != "") {
        const isFiltered = toFilter
            .split(".")
            .filter((customFilter: any) => !customFilter.includes("custom-css"))
            .toString();

        return isFiltered.replace(/,/g, ".");
    } else {
        return toFilter;
    }
}

// special function for certain cases where unncessary targets appear this function is only for html-dom-lens
function isTrueTarget(elTarget: any) {
    if (!(typeof elTarget.className === "string")) {
        //catches className which returns object since this function is only responsible in parsing string
        return false;
    }

    return elTarget.dataset.domLensTarget;
}

// Check if Annotation is existing on Element
function hasAnnotations(annotationStore: any, captureElement: any) {
    const elAnnotation = annotationStore.map(({ elem, domIndex }: any) =>
        getElementByTagAndIndex(elem, domIndex)
    );
    const hasExistingAnnotations = elAnnotation.some(
        (el: any) => el === captureElement
    );

    return hasExistingAnnotations;
}

// to check if the element has already an existing dialog box
function hasDialogBox(dataId: any) {
    const existingDialog = document.getElementById(`${dataId}`);
    return existingDialog !== null;
}

const colorselection = [
    "#311B92",
    "#4527A0",
    "#512DA8",
    "#5E35B1",
    "#673AB7",
    "#7E57C2",
    "#9575CD",
    "#B39DDB",
    "#D1C4E9",
    "#EDE7F6",
    "#E91E63",
    "#D81B60",
    "#C2185B",
    "#AD1457",
    "#880E4F",
    "#EC407A",
    "#F06292",
    "#F48FB1",
    "#F8BBD0",
    "#FCE4EC",
    "#263238",
    "#37474F",
    "#455A64",
    "#546E7A",
    "#607D8B",
    "#78909C",
    "#90A4AE",
    "#B0BEC5",
    "#CFD8DC",
    "#ECEFF1",
];

function extractDomInfo(elTarget: any) {
    const classNames = [...elTarget.classList]
        .map((name) => `.${name}`)
        .filter(
            (val, idx) =>
                val !== ".focused-dom" &&
                val !== ".focused-element" &&
                !val.includes("custom-css")
        );
    const classNamesString = classNames.reduce((init, curr) => init + curr, "");

    const children = [...elTarget.children].map((child) => {
        return {
            id: child.id ? "#" + child.id : null,
            class: child.className && "." + child.className,
            tag: child.localName,
            element: child,
        };
    });

    const dataAttributes = Object.entries(elTarget.dataset).reduce(
        // @ts-ignore
        (arr, [key, value]) => arr.concat([{ key, value }]),
        []
    );

    const elComputedStyle: any = [
        "font-size",
        "color",
        "background-color",
        "font-family",
    ].reduce(
        (init, curr) => ({
            ...init,
            [curr]: window
                .getComputedStyle(elTarget, null)
                .getPropertyValue(curr),
        }),
        {}
    );

    const rgbArr = elComputedStyle["color"]
        .substring(4)
        .slice(0, -1)
        .split(",");

    const colorhex = rgbArr.reduce(
        (init: any, curr: any) => (init += parseInt(curr).toString(16)),
        "#"
    );

    const elParent = elTarget.parentElement;

    const parent = {
        id: elParent.id && `#${elParent.id.trim()}`,
        tag: elParent.localName,
        class: elParent.className && `.${elParent.className}`,
        classes: [
            ...elParent.classList.value
                .split(" ")
                .filter((customFilter: any) => !customFilter.includes("custom-css")),
        ],
    };

    const randomcolor = Math.floor(Math.random() * colorselection.length);
    const dataId = uuidv4();

    return {
        id: elTarget.id !== "" && `#${elTarget.id.trim()}`,
        domElement: elTarget,
        tag: elTarget.localName,
        classNames,
        classNamesString,
        children: children,
        parent,
        size: elComputedStyle["font-size"],
        textcolor: colorhex,
        backgroundColor: elComputedStyle["background-color"],
        family: elComputedStyle["font-family"].replaceAll('"', ""),
        bordercolor: colorselection[randomcolor],
        uniqueID: dataId,
        dataId: dataId,
        attributes: dataAttributes
            .filter((obj: any) => !obj.key.includes("domLensInjected"))
            .filter((obj: any) => !obj.key.includes("domLensTarget"))
            .filter((obj: any) => !obj.key.includes("id")),
    };
}

function isDOMDevTools(target: any) {
    return (
        ancestorExistsByID(target, "domLensApp") ||
        ancestorExistsByClassName(target, "switch-button")
    );
}

export {
    ancestorExistsByClassName,
    extractDomInfo,
    getElementByTagAndIndex,
    getUniqueElementIdentifierByTagAndIndex,
    customWidgetFilter,
    hasAnnotations,
    isTrueTarget,
    hasDialogBox,
    ancestorExistsByID,
    isDOMDevTools,
};
