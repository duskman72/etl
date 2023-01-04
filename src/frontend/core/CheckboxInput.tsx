import { RefObject } from "react";

export const CheckboxInput = (props: {label: string, name: string, onChange?: (e) => {} | void, required?: boolean, inputRef?: RefObject<any>}) => {
    return <div className="flex align-items-center mb-3">
        <input type="checkbox" ref={props.inputRef} onChange={props.onChange} name={props.name} className="form-check-input me-2" />
        <span>{props.label} {props.required ? <span className="text-danger">*</span> : null}</span>
    </div>
}