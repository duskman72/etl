import { PropsWithChildren, useEffect } from "react";

export type DialogProps = {
    id: string;
    title: string;
    onOk: () => any;
}

export const Dialog = (props: PropsWithChildren<DialogProps>) => {
    const id = props.id;

    useEffect(() => {
        const modal = document.querySelector(`#${id}`);
        document.body.appendChild( modal )
    });

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
                <button type="button" className="btn btn-danger" onClick={props.onOk}>Delete</button>
            </div>
        </div>
    </div>
</div>
}