import { FormField } from "../core/FormField";

export type FormFieldConfig = {
    [key: string]: FormField;
}

export type DataSourceConfig = {
    formFields: FormFieldConfig
}

export abstract class DataSourceType {
    config: () => DataSourceConfig;
    contentType: () => string;
}