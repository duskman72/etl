import React, { PropsWithChildren } from "react";
import { PageContent } from "./PageContent";
import { PageHeader } from "./PageHeader";

export const Page = (props: PropsWithChildren) => {
    return <>
        <PageHeader />
        <PageContent>
            {props.children}
        </PageContent>
    </>
}