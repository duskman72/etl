import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DataSourceTypesView } from "./pages/DataSourceTypesView";
import { DataSourcesView } from "./pages/DataSourcesView";
import { Home } from "./pages/Home";
import { CredentialsView } from './pages/CredentialsView';
import { NotFound } from './pages/NotFound';

import "./resources/sass/app.scss"
import { ApplicationContext } from './contexts/ApplicationContext';
import { useState } from 'react';

const App = () => {
    const [context, setContext] = useState("home");
    const [searchBar, setSearchBar] = useState(true);
    const value = { context, setContext, searchBar, setSearchBar };

    return <ApplicationContext.Provider value={value}>
        <BrowserRouter>
            <Routes>
                <Route path="/data-source-types" element={<DataSourceTypesView />} />
                <Route path="/data-sources" element={<DataSourcesView /> } />
                <Route path="/credentials" element={<CredentialsView /> } />
                <Route path="/" element={<Home /> } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    </ApplicationContext.Provider>
}

const root = createRoot(document.querySelector("#app-root"));
root.render(<App />);
