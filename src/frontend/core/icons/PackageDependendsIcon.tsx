import { Icon, IconAttributes } from "../Icon";

export const PackageDependendsIcon = (props: IconAttributes) => {
    const size = props.size || 16;
    return <Icon {...props}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width={size} height={size}>
            <path d="M6.122.392a1.75 1.75 0 011.756 0l5.25 3.045c.54.313.872.89.872 1.514V7.25a.75.75 0 01-1.5 0V5.677L7.75 8.432v6.384a1 1 0 01-1.502.865L.872 12.563A1.75 1.75 0 010 11.049V4.951c0-.624.332-1.2.872-1.514zM7.125 1.69a.248.248 0 00-.25 0l-4.63 2.685L7 7.133l4.755-2.758zM1.5 11.049a.25.25 0 00.125.216l4.625 2.683V8.432L1.5 5.677zm10.828 3.684l1.173-1.233H10.25a.75.75 0 010-1.5h3.251l-1.173-1.233a.75.75 0 111.087-1.034l2.378 2.5a.75.75 0 010 1.034l-2.378 2.5a.75.75 0 01-1.087-1.034z"></path>
        </svg>
    </Icon>
}