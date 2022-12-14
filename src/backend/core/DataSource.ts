import { FormField } from "./FormField";

export interface DataSource {
    formFields(): Array<FormField>;
}