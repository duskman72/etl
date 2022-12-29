import { Icon, IconAttributes } from "../Icon";

export const ArrowLeftIcon = (props: IconAttributes) => {
    const size = props.size || 16;
    return <Icon {...props}>
        <path d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.751.751 0 011.042.018.751.751 0 01.018 1.042L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"/>
    </Icon>
}