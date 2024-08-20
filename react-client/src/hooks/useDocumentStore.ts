import React, { useEffect, useState } from "react";

// TODO: Put window document store here...
const useDocumentStore = () => {
    // @ts-ignore
    const [state, setState] = useState(window.store);

    useEffect(() => {
        // @ts-ignore
        if (!window.store) {
            //initialize window.store if it doesn't have any value yet.
            // @ts-ignore
            window.store = {
                focusMode: false,
                switchExtensionFunctionality: true,
                bookmarkBtnClicked: false, //we can use this to set a guard to `onClick` event we wired up using plain javascript to prevent those logic from getting mixed up
            };
        }
        // @ts-ignore
        setState(window.store);

        return () => {};
    }, []);

    // When state is changed, update window.store DB
    useEffect(() => {
        // @ts-ignore
        window.store = state;

        return () => {};
    }, [state]);

    const setDocumentStore = (value: any) => {
        setState(value);
    };

    return [state, setDocumentStore];
};

export default useDocumentStore;
