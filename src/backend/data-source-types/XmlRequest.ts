import { DataSourceType } from "../core/DataSourceType";

export class XmlRequest extends DataSourceType {

    contentType = () => {
        return "application/xml"
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
