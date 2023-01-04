import { createRef, memo, RefObject, useEffect } from "react";
import { CalendarIcon } from "./icons/CalendarIcon";

import "bootstrap-datepicker";

export const DateInput = memo((props: {label: string, name: string, labelClass?: string, required?: boolean, inputRef?: RefObject<any>}) => {
    const ref = props.inputRef || createRef();
    useEffect(() => {
        if (ref.current && !ref.current.value) {
            ref.current.value = moment(new Date()).format("YYYY-MM-DD");
        }

        if (ref.current ) {
            const e = $(ref.current);
            e.datepicker({
                weekStart: 1,
                format: "yyyy-mm-dd",
                autoclose: true,
                defaultViewDate: new Date(),
                setDate: new Date()
            })
            .on("show", event => {
                e.datepicker("setDate", ref.current.value)
            })
        }
    }, []);

    return <div className="flex flex-column w-50 me-2">
        <label className="form-label mb-1 fw-bolder">{props.label} {props.required ? <span className="text-danger">*</span> : null}</label>
        <div className="input-group">
            <input ref={ref} readOnly className="form-control form-control-sm" name={props.name} data-display-name={props.label} data-required={props.required} type="text" />
            <span className="input-group-text">
                <CalendarIcon />
            </span>
        </div>
    </div>
});
