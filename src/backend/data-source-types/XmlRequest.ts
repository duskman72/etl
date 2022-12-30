import { DataSourceType } from "../core/DataSourceType";

export class XmlRequest extends DataSourceType {

    contentType = () => {
        return "application/xml"
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
                    }
                ]
            }
        }
    };
}
