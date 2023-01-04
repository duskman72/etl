import { memo, RefObject } from "react";

export const RepeatInput = memo((props: { required?: boolean, repeatValueRef?: RefObject<any>, repeatTypeRef?: RefObject<any> }) => {
    return <div className="flex align-items-center">
        <span className="flex no-text-wrap me-2 fw-bold">Repeat Every</span>
        {props.required ? <span className="text-danger me-2">*</span> : null}
        <input type="text" ref={props.repeatValueRef} onKeyUp={(e: any) => {
            const value = e.target.value.split("").map(v => v.trim());
            const newValue = [];
            let index = 0;
            for( let val of value ) {
                if( val.match(/[0-9]/)) {
                    const v = parseInt( val );
                    if( v <= 0 && index === 0 ) continue;
                    newValue.push(v);
                    index++;
                }

            }

            props.repeatValueRef.current.value = newValue.join("");
        } } data-display-name="Repeat Field" data-required={props.required} name="repeat-value" className="form-control form-control-sm me-2 w-50" />
        <select ref={props.repeatTypeRef} data-display-name="Repeat Field" data-required={props.required} name="repeat-type" className="form-control form-control-sm form-select w-50">
            <option value="minute">Minute</option>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
        </select>
    </div>
});
