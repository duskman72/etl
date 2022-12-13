import React, { HTMLAttributes, PropsWithChildren } from "react";

export interface IconAttributes extends HTMLAttributes<HTMLElement> {
    size?: number;
}

export const Icon = (props: PropsWithChildren<IconAttributes>) => {
    const classNames = [];
    classNames.push("octicon");

    props.className?.split(" ").forEach( cl => {
        if( !classNames.includes( cl ))
            classNames.push( cl );
    })
    return <span className={classNames.join(" ")} onClick={props.onClick}>
        {props.children}
    </span>
}