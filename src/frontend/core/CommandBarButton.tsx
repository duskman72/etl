import { HTMLAttributes, ReactElement, memo } from "react";

export interface  CommandBarButton extends  HTMLAttributes<HTMLButtonElement> {
    label: string,
    icon?: ReactElement,
    disabled?: boolean
};

export const CommandBarButton = memo((props: CommandBarButton) => {
    const classList = [
        "command-btn" 
    ];

    if( props.className && props.className.length ) {
        props.className.split(" ").forEach( cls => {
            if( !classList.includes( cls.trim() ) )
                classList.push( cls.trim() );
        })
    }

    const attributes = {
        className: classList.join(" ")
    };

    const excludes = ["label", "children", "icon", "className"];
    const attrKeys = Object.keys( props ).filter( key => !excludes.includes(key));

    for( const k of attrKeys ) {
        attributes[k] = props[k];
    }

    return <button {...attributes}>
        {props.icon}
        <span>{props.label}</span>
    </button>
});