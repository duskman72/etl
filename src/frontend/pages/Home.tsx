import { useContext, useEffect } from "react";
import { ApplicationContext } from "../contexts/ApplicationContext";
import { Page } from "../core/Page";

export default () => {
    const ctx = useContext(ApplicationContext);
    
    useEffect(() => {
        ctx.setContext("home")
        ctx.setSearchBar( false )
    })

    return <Page>
        <h1>Home</h1>
    </Page>
}