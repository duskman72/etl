import { Icon, IconAttributes } from "../Icon";

export const SearchIcon = (props: IconAttributes) => {
    const size = props.size || 16;
    return <Icon {...props}>
        <path d="M10.68 11.74a6 6 0 01-7.922-8.982 6 6 0 018.982 7.922l3.04 3.04a.749.749 0 01-.326 1.275.749.749 0 01-.734-.215zM11.5 7a4.499 4.499 0 10-8.997 0A4.499 4.499 0 0011.5 7z"/>
    </Icon>
}