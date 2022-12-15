import { NavLink } from "react-router-dom";

export const PageNavigation = () => {
    return <nav className="page-navigation">
        <ol className="navbar-nav">
            <li className="nav-item-header">Import</li>
            <li className="nav-item">
                <NavLink to="/data-source-types" className="nav-link">Data Source Types</NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/data-sources" className="nav-link">Data Sources</NavLink>
            </li>
        </ol>
    </nav>
}