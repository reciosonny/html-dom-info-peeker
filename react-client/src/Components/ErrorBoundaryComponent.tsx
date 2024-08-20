import React, { ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

class ErrorBoundary extends React.Component<Props> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        // @ts-ignore
        logErrorToMyService(error, errorInfo);
    }

    render() {
        // @ts-ignore
        if (this.state?.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
