import { 
    HTMLAttributes, 
    PropsWithChildren 
} from "react";

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

    const filteredProps = {};
    Object.keys(props).forEach( k => {
        if( k !== "className" && k !== "onClick" && k !== "size") {
            filteredProps[k] = props[k];
        }
    })
    return <span className={classNames.join(" ")} onClick={props.onClick} {...filteredProps}>
        {props.children}
    </span>
}