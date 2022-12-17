import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DataSourceTypesView } from "./pages/DataSourceTypesView";
import { DataSourcesView } from "./pages/DataSourcesView";
import { Home } from "./pages/Home";

import "./resources/sass/app.scss"
import { CredentialsView } from './pages/CredentialsView';

const App = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/data-source-types" element={<DataSourceTypesView /> } />
            <Route path="/data-sources" element={<DataSourcesView /> } />
            <Route path="/credentials" element={<CredentialsView /> } />
            <Route path="/" element={<Home /> } />
        </Routes>
    </BrowserRouter>
}

const root = createRoot(document.querySelector("#app-root"));
root.render(<App />);
