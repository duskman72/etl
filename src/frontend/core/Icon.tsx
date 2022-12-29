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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 16 16`} width={props.size} height={props.size}>
            {props.children}
        </svg>
    </span>
}