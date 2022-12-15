import { DataSourceType } from "../core/DataSourceType";

export class JsonRequest extends DataSourceType {

    contentType = () => {
        return "application/json"
    }

    config = () => {
        return {
            formFields: {
                "url": {
                    type: "input",
                    required: true
                }
            }
        }
    };
}
