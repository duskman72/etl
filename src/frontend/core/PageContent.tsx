import { PropsWithChildren } from "react";
import { PageNavigation } from "./PageNavigation";

export const PageContent = (props: PropsWithChildren) => {
    return <div className="page-content">
        <PageNavigation />
        <div className="col-10 p-1">
            {props.children}
        </div>
    </div>
}