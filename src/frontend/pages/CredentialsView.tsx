import { createRef, forwardRef, RefObject, useEffect, useRef, useState } from "react"
import { Dialog } from "../core/Dialog";
import { Page } from "../core/Page"
import { Modal } from "bootstrap";
import { AlertIcon } from "../core/icons/AlertIcon";
import { TrashIcon } from "../core/icons/TrashIcon";

const ApikeyConfigFields = (props: {refObjects: Array<RefObject<any>>}) => {
    return <>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">API Key Name</label>
            <input ref={props.refObjects[0]} name="name" type="text" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">API Key</label>
            <input ref={props.refObjects[1]} type="text" name="value" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">API Key Location</label>
            <select ref={props.refObjects[2]} defaultValue={""} className="form-control form-control-sm form-select">
                <option value="">Please Choose...</option>
                <option value="header">Http Header</option>
                <option value="query-string">Query String</option>
            </select>
        </div>
    </>
}

const BearerConfigFields = (props: {refObjects: Array<RefObject<any>>}) => {
    return <>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">JWT / Bearer Token</label>
            <input ref={props.refObjects[0]} type="text" name="token" className="form-control form-control-sm" />
        </div>
    </>
}

const UserConfigFields = (props: {refObjects: Array<RefObject<any>>}) => {
    return <>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">Username</label>
            <input ref={props.refObjects[0]} type="text" name="user" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">Password</label>
            <input ref={props.refObjects[1]} type="text" name="password" className="form-control form-control-sm" />
        </div>
    </>
}

const BasicConfigFields = (props: {refObjects: Array<RefObject<any>>}) => {
    return <>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">Username</label>
            <input ref={props.refObjects[0]} type="text" name="user" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">Password</label>
            <input ref={props.refObjects[1]} type="text" name="password" className="form-control form-control-sm" />
        </div>
    </>
}

const OAuthConfigFields = (props: {refObjects: Array<RefObject<any>>}) => {
    return <>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">OAuth Client ID</label>
            <input ref={props.refObjects[0]} type="text" name="client-id" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">OAuth Client Secret</label>
            <input ref={props.refObjects[1]} type="text" name="client-secret" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">OAuth Token URL</label>
            <input ref={props.refObjects[2]} type="text" name="token-url" className="form-control form-control-sm" />
        </div>
    </>
}

export const CredentialsView = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedCredentailsType, setSelectedCredentailsType] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const nameRef = useRef<HTMLInputElement>();
    const selectRef = useRef<HTMLSelectElement>();

    const refObjects: Array<any> = [
        createRef(),
        createRef(),
        createRef()
    ]

    const refresh = () => {
        if( loading ) return;
        setItems([]);
        setSelectedItem(null);
        setError(false);
        setLoading( true );

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

    const showAddDialog = () => {
        const el = document.querySelector("#addCredentialsDialog");
        const modal = Modal.getOrCreateInstance(el);

        setSelectedCredentailsType( null );
        if( selectRef.current ) {
            selectRef.current.selectedIndex = 0;
        }

        refObjects.forEach( ref => {
            const refObject: any = ref.current;
            if( refObject ) refObject.value = "";
        });
        modal.show();
    }

    const onDialogOk = () => {
        const el = document.querySelector("#addCredentialsDialog");
        const modal = Modal.getOrCreateInstance( el );

        const config = {};
        const name = nameRef.current.value;
        const type = selectedCredentailsType;

        refObjects.forEach( ref => {
            const refObject: any = ref.current;
            if( refObject ) {
                const key = refObject.getAttribute("name");
                config[key] = refObject.value
            }
        });
        modal.hide();

        // TODO send values to database
        $.ajax({
            url: "/api/credentials",
            method: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                type,
                name,
                config
            })
        })
        .done( response => {
            refresh();
        })
        .fail(() => {
            setError(true)
        })
    }

    useEffect(() => {
        refresh();
    }, []);

    return <Page>
        <Dialog id="addCredentialsDialog" title="Add Credentials" onOk={onDialogOk}>
            <div className="flex flex-column mb-3">
                <label className="form-label mb-1 fw-bolder">Name</label>
                <input type="text" ref={nameRef} className="form-control form-control-sm" />
            </div>
            <div className="flex flex-column mb-3">
                <label className="form-label mb-1 fw-bolder">Credentials Type</label>
                <select ref={selectRef} className="form-control form-control-sm form-select" onChange={(event) => {
                    const index = selectRef.current.selectedIndex;
                    let type = null;
                    if( index > 0 ) {
                        type = selectRef.current.options[index].value;
                    }
                    setSelectedCredentailsType(type);
                }}>
                    <option value={""}>Please Choose...</option>
                    <option value="apikey">Api Key</option>
                    <option value="oauth">OAuth v2</option>
                    <option value="bearer">Auth Bearer</option>
                    <option value="basic">Auth Basic</option>
                    <option value="user">Username &amp; Password</option>
                </select>
            </div>
            {
                selectedCredentailsType === "apikey" &&
                <ApikeyConfigFields refObjects={refObjects}/>
            }
            {
                selectedCredentailsType === "oauth" &&
                <OAuthConfigFields refObjects={refObjects} />
            }
            {
                selectedCredentailsType === "user" &&
                <UserConfigFields refObjects={refObjects} />
            }
            {
                selectedCredentailsType === "bearer" &&
                <BearerConfigFields refObjects={refObjects} />
            }
            {
                selectedCredentailsType === "basic" &&
                <BasicConfigFields refObjects={refObjects} />
            }
        </Dialog>

        <div className="flex flex-column p-2">
            <h6 className="mb-3 flex align-items-center">
                <span className="me-3">Credentials</span>
                <button className="btn btn-sm btn-primary me-2" disabled={error || loading} onClick={showAddDialog}>Add Source</button>
                <button className="btn btn-sm btn-default" onClick={refresh}>Refresh</button>
            </h6>
            {
                loading &&
                <div className="alert alert-info">Please wait while loading...</div>
            }
            {
                !loading && error &&
                <div className="alert alert-danger flex align-items-center">
                    <AlertIcon size={14} className="text-danger me-2"/>
                    <span>Unable to load items.</span>
                </div>
            }
            {
                !loading && !error && items?.length === 0 &&
                <div className="alert alert-info">There are no items in this view.</div>
            }
            {
                items?.length > 0 &&
                <div className="data-table">
                    <div className="row header-row">
                        
                        <div className="table-column table-header col-2">ID</div>
                        <div className="table-column table-header col">NAME</div>
                        <div className="table-column table-header col">TYPE</div>
                        <div className="table-column table-header col">CREATED</div>
                        <div className="table-column table-header col-1">&nbsp;</div>
                    </div>
                    {
                        items.map( item => {
                            return <div key={item._id} className="row">
                                <div className="table-column col-2">
                                    {item._id.toUpperCase()}
                                </div>
                                <div className="table-column col">
                                    {item.name}
                                </div>
                                <div className="table-column col">
                                    {item.type}
                                </div>
                                
                                <div className="table-column col">
                                    {moment(item.createdAt).fromNow()}
                                </div>
                                <div className="table-column col-1">
                                    <TrashIcon className="text-danger" size={14} onClick={() => {
                                        setSelectedItem( item );
                                        const modal = Modal.getOrCreateInstance(document.querySelector("#deleteSourceTypeDialog"));
                                        modal.show();
                                    }}/>
                                </div>
                            </div>
                        })
                    }
                </div>
            }
        </div>
    </Page>
}