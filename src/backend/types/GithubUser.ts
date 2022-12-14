import { DataSource } from "../core/DataSource";
import { FormField } from "../core/FormField";

export class GithubUser implements DataSource {
    formFields(): FormField[] {
        throw new Error("Method not implemented.");
    }
}