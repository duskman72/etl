import { PropsWithChildren } from "react";
import { PageNavigation } from "./PageNavigation";

export const PageContent = (props: PropsWithChildren) => {
    return <div className="page-content">
        {props.children}
    </div>
}