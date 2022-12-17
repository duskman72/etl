import { FormField } from "../core/FormField";

export type DataSourceConfig = {
    formFields: {
        general: Array<FormField>,
        additional?: Array<FormField>,
    };
}

export abstract class DataSourceType {
    config: () => DataSourceConfig;
    contentType: () => string;
}