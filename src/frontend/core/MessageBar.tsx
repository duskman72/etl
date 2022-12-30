import { memo } from "react"

export enum MessageBarType {
    DEFAULT = "default",
    ERROR = "danger",
    SEVEREWARNING = "severe-warning",
    WARNING = "warning",
    SUCCESS = "success",
    INFO = "info"
}

export const MessageBar = memo((props: {message: string, type: MessageBarType, className?: string}) => {
    return <div className={`alert alert-${props.type} ${props.className}`}>
        {props.message}
    </div>
});