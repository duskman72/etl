import { Icon, IconAttributes } from "../Icon";

export const PackageIcon = (props: IconAttributes) => {
    const size = props.size || 16;
    return <Icon {...props}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width={size} height={size}>
            <path d="M8.878.392l5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 01-.872 1.514l-5.25 3.045a1.75 1.75 0 01-1.756 0l-5.25-3.045A1.75 1.75 0 011 11.049V4.951c0-.624.332-1.201.872-1.514L7.122.392a1.75 1.75 0 011.756 0zM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.248.248 0 00-.25 0zM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432zm6.25 8.271l4.625-2.683a.25.25 0 00.125-.216V5.677L8.75 8.432z"></path>
        </svg>
    </Icon>
}