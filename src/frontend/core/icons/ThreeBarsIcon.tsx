import { Icon, IconAttributes } from "../Icon";

export const ThreeBarsIcon = (props: IconAttributes) => {
    const size = props.size || 16;
    return <Icon {...props}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width={size} height={size}>
            <path d="M1 2.75A.75.75 0 011.75 2h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 7.75zM1.75 12h12.5a.75.75 0 010 1.5H1.75a.75.75 0 010-1.5z"></path>
        </svg>
    </Icon>
}