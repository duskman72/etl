import { ThreeBarsIcon } from "./icons/ThreeBarsIcon";
import { Offcanvas } from "bootstrap";
import { SearchBox } from "./SearchBox";
 
export const PageHeader = () => {
    return <header className="page-header">
        <ThreeBarsIcon className="cursor-pointer text-white ms-2" onClick={() => {
            const canvas = Offcanvas.getOrCreateInstance(document.querySelector("#offcanvasMenu"));
            canvas.show();
        }}/>
        <SearchBox />
    </header>
}
