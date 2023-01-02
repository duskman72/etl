import { Icon, IconAttributes } from "../Icon";

export const ClockIcon = (props: IconAttributes) => {
    const size = props.size || 16;
    return <Icon {...props}>
        <path d="M8 0a8 8 0 110 16A8 8 0 018 0zM1.5 8a6.5 6.5 0 1013 0 6.5 6.5 0 00-13 0zm7-3.25v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.751.751 0 017 8.25v-3.5a.75.75 0 011.5 0z" />
    </Icon>
}