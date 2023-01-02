import { DataType } from "../core/DataType";

export class JsonRequest extends DataType {

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
