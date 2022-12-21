import { SearchIcon } from "./icons/SearchIcon";

export const SearchBox = () => {
    return <div className="search-box">
        <SearchIcon className="ms-2 me-2" size={12} />
        <input type="text"
            onFocus={() => {
                document.querySelector(".search-box").classList.add("bg-white");
            }} 

            onBlur={() => {
                document.querySelector(".search-box").classList.remove("bg-white");
            }} 

            placeholder="Search for {{context}} "
        />
    </div>
}