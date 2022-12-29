import { useContext, useEffect } from "react";
import { ApplicationContext } from "../contexts/ApplicationContext";
import { AlertIcon, Page } from "../core"

export const NotFound = () => {
    const ctx = useContext(ApplicationContext);

    useEffect(() => {
        ctx.setContext("Not Found");
        ctx.setSearchBar( false )
    })
    
    return <Page>
        <>
            <h5 className="flex align-items-center mb-3">
                <AlertIcon size={16} className="text-danger flex me-2" />
                <span>Not Found</span>
            </h5>
            <div className="alert alert-danger">
                The url {window.location.href} you requested does not exists.
            </div>
        </>
    </Page>
}