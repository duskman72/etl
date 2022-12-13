import React from "react";
import { Icon, IconAttributes } from "../Icon";

export const RefreshIcon = (props: IconAttributes) => {
    const size = props.size || 16;
    return <Icon {...props}>
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" role="img" width={size} height={size}>
            <path data-name="layer1" d="M54.741 28.14a23.002 23.002 0 0 1-39.088 19.124" fill="none" stroke="#202020" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
            <path data-name="layer2" d="M9.065 33.62A23.008 23.008 0 0 1 31.917 8a22.934 22.934 0 0 1 16.262 6.732" fill="none" stroke="#202020" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
            <path data-name="layer2" fill="none" stroke="#202020" stroke-miterlimit="10" stroke-width="2" d="M2 24l7.065 9.619L18 26" stroke-linejoin="round" stroke-linecap="round"></path>
            <path data-name="layer1" fill="none" stroke="#202020" stroke-miterlimit="10" stroke-width="2" d="M62 38l-7.259-9.86L46 36" stroke-linejoin="round" stroke-linecap="round"></path>
        </svg>
    </Icon>
}