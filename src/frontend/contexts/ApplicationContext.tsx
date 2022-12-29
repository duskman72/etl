import { createContext } from "react";

export const ApplicationContext = createContext({
    context: "",
    setContext: (ctx) => {},
    searchBar: true,
    setSearchBar: (visible) => {}
});