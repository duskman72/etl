import { DataType } from "../core/DataType";
import https from "https";

type config = {
    url: string;
}

export class JsonRequest implements DataType {
    exec = (configData: config) => {
        const url = configData.url;
        return new Promise((resolve, reject) => {

            const u = new URL(url);

            const options = {
                hostname: u.hostname,
                port: 443,
                path: u.pathname,
                method: 'GET',
                headers: {
                    "User-Agent": "ETL Request"
                }
            };

            https.get(options, (response) => {
                if( response.statusCode > 201 ) {
                    reject({ error: { message: response.statusMessage } })
                    return;
                }

                let data = "";
                response.on("data", (d) => {
                    data += d;
                })

                response.on("end", () => {
                    resolve(JSON.parse(data));
                })
            })
            .on("error", (err) => {
                reject({error: {message: err}})
            })
        });
    };

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
