import { DataType } from "../core/DataType";

export class PgsqlRequest extends DataType {

    contentType = () => {
        return "application/json"
    }

    config = () => {
        return {
            formFields: {
                general: [
                    {
                        name: "host",
                        label: "Host",
                        type: "input",
                        required: true
                    },
                    {
                        name: "port",
                        label: "Port",
                        type: "input",
                        required: true
                    },
                    {
                        name: "dbname",
                        label: "Database Name",
                        type: "input",
                        required: true
                    },
                    {
                        name: "user",
                        label: "User Name",
                        type: "input",
                        required: true
                    },
                    {
                        name: "password",
                        label: "Password",
                        type: "input",
                        required: true
                    },
                ]
            }
        }
    }
}
