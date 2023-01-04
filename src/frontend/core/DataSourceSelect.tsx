import { 
    RefObject,
    useEffect, 
    useState 
} from "react";

export const DataSourceSelect = (props: {name: string, selectRef: RefObject<HTMLSelectElement>}) => {

    const [ajaxData, setAjaxData] = useState({
        items: [],
        loading: false,
        error: null
    }); 

    const loadItems = () => {
        if ( ajaxData.loading ) return;
        
        setAjaxData(prev => {
            return {
                ...prev,
                loading: true,
                error: false,
                items: []
            }
        });

        fetch("/api/data-sources", {
            headers: {
                "X-Requested-With": "XmlHttpRequest"
            }
        })
        .then( response => response.json())
        .then( data => {
            setAjaxData(prev => {
                return {
                    ...prev,
                    loading: false,
                    items: data.items,
                    error: false
                }
            });
        })
        .catch(() => {
            setAjaxData(prev => {
                return {
                    ...prev,
                    loading: false,
                    items: [],
                    error: true
                }
            });
        })
    }

    useEffect(() => {
        loadItems();
    }, []);

    if ( ajaxData.loading ) return <div className="alert alert-sm alert-info">Please wait, while loading...</div>
    if ( ajaxData.error ) return <div className="alert alert-sm alert-danger">Unable to load sources list.</div>
    if ( ajaxData.items?.length === 0 ) return <div className="alert alert-sm alert-warning">There are no sources configured.</div>

    return <select className="form-control form-control-sm form-select" ref={props.selectRef} name={props.name}>
        <>
            <option value="">Please Choose...</option>
            {
                ajaxData.items.map( item => {
                    return <option key={item._id} value={item._id}>{item.name}</option>
                })
            }
        </>
    </select>
}