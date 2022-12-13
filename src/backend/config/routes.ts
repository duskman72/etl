import { ApiRouter } from "../http/ApiRouter";
import { AssetsRouter } from "../http/AssetsRouter";
import { FrontendRouter } from "../http/FrontendRouter";

export const routes = [
    {
        prefix: "/api",
        router: ApiRouter
    },
    {
        prefix: "/assets",
        router: AssetsRouter
    },
    {
        prefix: "/",
        router: FrontendRouter
    }
];