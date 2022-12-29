import { PropsWithChildren } from "react";

export const PageContent = (props: PropsWithChildren) => {
    return <div className="page-content">
        {props.children}
    </div>
}