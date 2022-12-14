import { Icon, IconAttributes } from "../Icon";

export const LockIcon = (props: IconAttributes) => {
    const size = props.size || 16;
    return <Icon {...props}>
        <path d="M4 4a4 4 0 018 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25v-5.5C2 6.784 2.784 6 3.75 6H4zm8.25 3.5h-8.5a.25.25 0 00-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25v-5.5a.25.25 0 00-.25-.25zM10.5 6V4a2.5 2.5 0 10-5 0v2z"/>
    </Icon>
}