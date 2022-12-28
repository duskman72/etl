import { PropsWithChildren } from "react";
import { PageContent } from "./PageContent";
import { PageHeader } from "./PageHeader";
import { PageNavigation } from "./PageNavigation";

export const Page = (props: PropsWithChildren) => {
    return <>
        <PageNavigation />
        <PageHeader />
        <PageContent>
            {props.children}
        </PageContent>
    </>
}