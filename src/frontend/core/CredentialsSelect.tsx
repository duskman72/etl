import { 
    useEffect, 
    useState 
} from "react";

export const CredentialsSelect = (props: {name: string}) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const loadCredentials = () => {
        if( loading ) return;
        setLoading( true );
        setError( false );

        $.get("/api/credentials")
        .done( response => {
            setLoading( false );
            setItems( response.items );
        })
        .fail(() => {
            setLoading( false );
            setError( true );
        })
    }

    useEffect(() => {
        loadCredentials();
    }, []);

    if( loading ) return <div className="alert alert-sm alert-info">Please wait, while loading...</div>
    if( error ) return <div className="alert alert-sm alert-danger">Unable to load credentials list.</div>
    if( items?.length === 0 ) return <div className="alert alert-sm alert-warning">There are no credentials configured.</div>

    return <select className="form-control form-control-sm form-select" name={props.name}>
        <>
            <option value="">Please Choose...</option>
            {
                items.map( item => {
                    return <option key={item._id} value={item._id}>{item.name}</option>
                })
            }
        </>
    </select>
}