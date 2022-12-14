import React, { useEffect } from "react";

import "@popperjs/core";
import { Tooltip } from "bootstrap";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DataSourceTypes } from "./pages/DataSourceTypes";
import { DataSources } from "./pages/DataSources";
import { Home } from "./pages/Home";

import "./resources/sass/app.scss"

const App = () => {
    
    useEffect(() => {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        console.log( tooltipTriggerList )
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl)
        })
    }, []);
    
    return <BrowserRouter>
        <Routes>
            <Route path="/data-source-types" element={<DataSourceTypes /> } />
            <Route path="/data-sources" element={<DataSources /> } />
            <Route path="/" element={<Home /> } />
        </Routes>
    </BrowserRouter>
}

const root = createRoot(document.querySelector("#app-root"));
root.render(<App />);
