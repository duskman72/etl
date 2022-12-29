import { HTMLAttributes, PropsWithChildren } from "react";
import { v4 as uuid } from "uuid";

export type DialogButton = {
} & PropsWithChildren<HTMLAttributes<HTMLButtonElement>>

export type DialogProps = {
    id: string;
    title: string;
    buttons: Array<DialogButton>
}

export const Dialog = (props: PropsWithChildren<DialogProps>) => {
    const id = props.id;

    return <div className={`modal fade`} id={id} tabIndex={1} aria-hidden="true">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h6 className="fs-7">{props.title}</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {
                    props.children
                }
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                {
                    props.buttons.map( button => {
                        const classList = ["btn"];
                        const attributes = {};

                        for(const key in button) {
                            if( key === "label" ) continue;

                            if( key === "className" ) {
                                button[key].split(" ").map( cls => {
                                    classList.push( cls );
                                });
                                continue;
                            }

                            attributes[key] = button[key];
                        }

                        return <button key={uuid()} className={classList.join(" ")} {...attributes}>{button.children}</button>
                    })
                }
            </div>
        </div>
    </div>
</div>
}