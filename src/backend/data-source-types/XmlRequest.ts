import { DataSourceType } from "../core/DataSourceType";

export class XmlRequest extends DataSourceType {

    contentType = () => {
        return "application/xml"
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
    };
}
