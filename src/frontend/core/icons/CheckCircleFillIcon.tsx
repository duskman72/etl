import { Icon, IconAttributes } from "../Icon";

export const CheckCircleFillIcon = (props: IconAttributes) => {
    const size = props.size || 16;
    return <Icon {...props}>
        <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z"/>
    </Icon>
}