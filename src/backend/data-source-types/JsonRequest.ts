import { DataSourceType } from "../core/DataSourceType";

export class JsonRequest extends DataSourceType {

    contentType = () => {
        return "application/json"
    }

    config = () => {
        return {
            formFields: [
                {
                    name: "url",
                    label: "Url",
                    type: "input",
                    required: true
                }
            ]
        }
    }
}
