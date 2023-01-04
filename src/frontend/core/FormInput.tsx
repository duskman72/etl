import { memo, RefObject } from "react";

export const FormInput = memo((props: {label: string, name: string, labelClass?: string, required?: boolean, inputRef?: RefObject<any>}) => {
    return <div className="flex flex-column mb-3">
        <label className="form-label mb-1 fw-bolder">{props.label} {props.required ? <span className="text-danger">*</span> : null}</label>
        <input ref={props.inputRef} name={props.name} data-display-name={props.label} data-required={props.required} type="text" className="form-control form-control-sm" />
    </div>
});
