import { createRoot } from 'react-dom/client';
import { ApplicationContext } from './contexts/ApplicationContext';
import { Suspense, useState } from 'react';

import { BrowserRouter, Route, Routes } from "react-router-dom";
const DataTypesView = React.lazy(() => import("./pages/DataTypesView"));
const DataSourcesView = React.lazy(() => import("./pages/DataSourcesView"));
const Home = React.lazy(() => import("./pages/Home"));
const CredentialsView = React.lazy(() => import('./pages/CredentialsView'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const RepetitiveJobsView = React.lazy(() => import('./pages/RepetitiveJobsView'));
const RepetitiveJob = React.lazy(() => import('./pages/RepetitiveJob'));
const RepetitiveJobLogs = React.lazy(() => import('./pages/RepetitiveJobLogs'));

import "./resources/sass/app.scss"

const App = () => {
    const [context, setContext] = useState("home");
    const [searchBar, setSearchBar] = useState(true);
    const value = { context, setContext, searchBar, setSearchBar };

    return <ApplicationContext.Provider value={value}>
        <Suspense fallback={<div>Loading...</div>}>
            <BrowserRouter>
                <Routes>
                    <Route path="/jobs/:id/logs" element={<RepetitiveJobLogs />} />
                    <Route path="/jobs/:id" element={<RepetitiveJob />} />
                    <Route path="/jobs" element={<RepetitiveJobsView />} />
                    <Route path="/data-types" element={<DataTypesView />} />
                    <Route path="/data-sources" element={<DataSourcesView /> } />
                    <Route path="/credentials" element={<CredentialsView /> } />
                    <Route path="/" element={<Home /> } />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    </ApplicationContext.Provider>
}

const root = createRoot(document.querySelector("#app-root"));
root.render(<App />);
