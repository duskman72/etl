import { FormField } from "../core/FormField";

export type DataSourceConfig = {
    formFields: Array<FormField>;
}

export abstract class DataSourceType {
    config: () => DataSourceConfig;
    contentType: () => string;
}