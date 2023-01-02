import { FormField } from "./FormField";

export type DataSourceConfig = {
    formFields: {
        general: Array<FormField>,
        additional?: Array<FormField>,
    };
}

export abstract class DataType {
    config: () => DataSourceConfig;
    contentType: () => string;
}