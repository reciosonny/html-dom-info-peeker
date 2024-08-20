import React from "react";

const useLocalStorageStore = (
    storeName: string,
    defaultValue: any,
    isNotJSON?: boolean
) => {
    const [state, setState] = React.useState(defaultValue);

    React.useEffect(() => {
        let finalValue = getFinalValue();

        if (finalValue) {
            setState(finalValue);
        }

        return () => {};
    }, []);

    const getFinalValue = () => {
        const storedValue = localStorage.getItem(storeName);

        let finalValue;

        if (isNotJSON) {
            finalValue = storedValue;
        } else {
            if (storedValue) {
                finalValue = JSON.parse(storedValue) ?? [];
            }
        }

        return finalValue;
    };

    const setLocalStorage = (value: string) => {
        if (!value) {
            localStorage.removeItem(storeName);
            setState(defaultValue);

            return;
        }

        let finalValue = isNotJSON ? value : JSON.stringify(value);
        localStorage.setItem(storeName, finalValue); //if state changes, sync it on localStorage

        setState(value);
    };

    // we can use this to update the hooks state coming from localstorage
    const getLocalStorageData = () => {
        let finalValue = getFinalValue();

        if (finalValue) {
            setState(finalValue);
        }
    };

    return [state, setLocalStorage, getLocalStorageData];
};

export default useLocalStorageStore;
