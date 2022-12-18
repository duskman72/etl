import { useEffect, useRef, useState } from "react"
import { Select2 } from "select2-react-component";

export const CredentialsSelect = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const selectRef = useRef();

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

    return <Select2 ref={selectRef} placeholder="Please Choose..." data={
        items.map( dst => {
            return {
                label: dst.name,
                value: dst._id
            }
        })
    }/>
}