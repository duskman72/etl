import { DataSourceType } from "../core/DataSourceType";

export class JsonRequest extends DataSourceType {

    contentType = () => {
        return "application/json"
    }

    config = () => {
        return {
            formFields: {
                general: [
                    {
                        name: "url",
                        label: "Url",
                        type: "input",
                        required: true
                    },
                    {
                        name: "request-credentials",
                        label: "Request Credentials",
                        type: "credentials-mgr"
                    }
                ]
            }
        }
    }
}
