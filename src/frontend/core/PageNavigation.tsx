import { memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Offcanvas } from "bootstrap";
import { ArrowLeftIcon, 
    LockIcon, 
    PackageDependendsIcon, 
    PackageIcon 
} from "./icons";

export const PageNavigation = memo(() => {
    const navigate = useNavigate();

    const closeCanvas = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const href = e.currentTarget.getAttribute("href");
        
        const el = document.querySelector("#offcanvasMenu");
        el.addEventListener("hide.bs.offcanvas", () => {
            setTimeout(() => navigate(href), 100);
        });

        const canvas = Offcanvas.getOrCreateInstance(el);
        canvas.hide();
    }

    return <div className="offcanvas offcanvas-start page-navigation" id="offcanvasMenu">
        <div className="offcanvas-header">
            <ArrowLeftIcon className="cursor-pointer" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div className="offcanvas-body p-0">
            <nav className="page-navigation-inner">
                <ol className="navbar-nav">
                    <li className="nav-item-header">Import</li>
                    <li className="nav-item">
                        <NavLink to="/data-source-types" className="nav-link" onClick={closeCanvas}>
                            <PackageIcon size={12} className="text-blue-800 me-2" />
                            <span>Data Source Types</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/data-sources" className="nav-link" onClick={closeCanvas}>
                            <PackageDependendsIcon size={12} className="text-blue-800 me-2" />
                            <span>Data Sources</span>
                        </NavLink>
                    </li>
                    <li className="nav-item-header mt-3">Security</li>
                    <li className="nav-item">
                        <NavLink to="/credentials" className="nav-link" onClick={closeCanvas}>
                            <LockIcon size={12} className="text-amber-500 me-2" />
                            <span>Credentials</span>
                        </NavLink>
                    </li>
                </ol>
            </nav>
        </div>
    </div>
});
