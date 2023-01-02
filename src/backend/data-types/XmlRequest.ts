import { DataType } from "../core/DataType";

export class XmlRequest extends DataType {

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
