import { ThreeBarsIcon } from "./icons/ThreeBarsIcon";
import { Offcanvas } from "bootstrap";
import { SearchBox } from "./SearchBox";
 
export const PageHeader = () => {
    return <header className="page-header">
        <button className="btn btn-menu" onClick={() => {
            const canvas = Offcanvas.getOrCreateInstance(document.querySelector("#offcanvasMenu"));
            canvas.show();
        }}>
            <ThreeBarsIcon className="cursor-pointer text-white" />
        </button>
        <SearchBox />
    </header>
}
