import { createRef, RefObject, useEffect, useRef, useState } from "react"
import { Dialog } from "../core/Dialog";
import { Page } from "../core/Page"
import { Modal } from "bootstrap";
import { AlertIcon } from "../core/icons/AlertIcon";
import { TrashIcon } from "../core/icons/TrashIcon";
import { AddIcon } from "../core/icons/AddIcon";
import { RefreshIcon } from "../core/icons/RefreshIcon";
import { LockIcon } from "../core/icons/LockIcon";

const ApikeyConfigFields = (props: {refObjects: Array<RefObject<any>>}) => {
    return <>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">API Key Name <span className="text-danger">*</span></label>
            <input ref={props.refObjects[0]} name="name" data-display-name="API Key Name" data-required={true} type="text" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">API Key <span className="text-danger">*</span></label>
            <input ref={props.refObjects[1]} type="text" data-display-name="API Key" data-required={true} name="value" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">API Key Location <span className="text-danger">*</span></label>
            <select ref={props.refObjects[2]} defaultValue={""} data-required={true} data-display-name="API Key Location" name="location" className="form-control form-control-sm form-select">
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
            <label className="form-label mb-1 fw-bolder">JWT / Bearer Token <span className="text-danger">*</span></label>
            <input ref={props.refObjects[0]} type="text" data-required={true} name="token" data-display-name="JWT / Bearer Token" className="form-control form-control-sm" />
        </div>
    </>
}

const UserConfigFields = (props: {refObjects: Array<RefObject<any>>}) => {
    return <>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">Username <span className="text-danger">*</span></label>
            <input ref={props.refObjects[0]} type="text" data-required={true} name="user" data-display-name="Username" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">Password <span className="text-danger">*</span></label>
            <input ref={props.refObjects[1]} type="text" data-required={true} name="password" data-display-name="Password" className="form-control form-control-sm" />
        </div>
    </>
}

const BasicConfigFields = (props: {refObjects: Array<RefObject<any>>}) => {
    return <>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">Username <span className="text-danger">*</span></label>
            <input ref={props.refObjects[0]} type="text" data-required={true} name="user" data-display-name="Username" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">Password <span className="text-danger">*</span></label>
            <input ref={props.refObjects[1]} type="text" data-required={true} name="password" data-display-name="Password" className="form-control form-control-sm" />
        </div>
    </>
}

const OAuthConfigFields = (props: {refObjects: Array<RefObject<any>>}) => {
    return <>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">OAuth Client ID <span className="text-danger">*</span></label>
            <input ref={props.refObjects[0]} type="text" data-required={true} name="client-id" data-display-name="OAuth Client ID" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">OAuth Client Secret <span className="text-danger">*</span></label>
            <input ref={props.refObjects[1]} type="text" data-required={true} name="client-secret" data-display-name="OAuth Client Secret" className="form-control form-control-sm" />
        </div>
        <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">OAuth Token Url <span className="text-danger">*</span></label>
            <input ref={props.refObjects[2]} type="text" data-required={true} name="token-url" data-display-name="OAuth Token Url" className="form-control form-control-sm" />
        </div>
    </>
}

export const CredentialsView = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedCredentailsType, setSelectedCredentailsType] = useState(null);
    const [allItemsChecked, setAllItemsChecked] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogError, setDialogError] = useState(null);

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
        setAllItemsChecked( false );
        setError(false);
        setLoading( true );

        $.get("/api/credentials")
        .done( response => {
            setLoading( false );
            setItems( response.items.map( item => {
                item.checked = false;
                return item;
            }));
        })
        .fail(() => {
            setLoading( false );
            setError( true );
        })
    }

    const deleteItems = () => {
        const modal = Modal.getOrCreateInstance(document.querySelector("#deleteDialog"));
        modal.hide();

        Promise.all(items.filter(item => item.checked ).map( item => {
            return new Promise((accept, _reject) => {
                const id = item._id;
                $.ajax({
                    url: "/api/credentials/" + id,
                    method: "delete"
                }).then( () => {
                    accept(null);
                })
            });

        }))
        .then(() => {
            refresh();
        })
    }

    const showDeleteDialog = () => {
        const modal = Modal.getOrCreateInstance(document.querySelector("#deleteDialog"));
        modal.show();
    }

    const showAddDialog = () => {
        setSelectedCredentailsType( null );
        setDialogError( null );

        const el = document.querySelector("#addCredentialsDialog");
        const modal = Modal.getOrCreateInstance(el);
        modal.show();

        nameRef.current.value = "";

        if( selectRef.current ) {
            selectRef.current.selectedIndex = 0;
        }

        refObjects.forEach( ref => {
            const refObject: any = ref.current;
            if( refObject ) refObject.value = "";
        });
    }

    const onDialogOk = () => {
        setDialogError( null );
        const el = document.querySelector("#addCredentialsDialog");
        const modal = Modal.getOrCreateInstance( el );

        const config = {};
        const name = nameRef.current.value?.trim();
        const type = selectedCredentailsType;

        if( name.length < 4 ) {
            setDialogError("Error: name must be at least 4 characters");
            return;
        }

        if( !type ) {
            setDialogError("Error: credentials type must be set");
            return;
        }

        for(const ref of refObjects ) {
            const refObject: any = ref.current;
            if( refObject ) {
                const key = refObject.getAttribute("name");
                const required = refObject.getAttribute("data-required");
                const value = refObject.value.trim();
                if( required && !value ) {
                    const displayName = refObject.getAttribute("data-display-name");
                    setDialogError(`Error: Missing value for field ${displayName}`);
                    return;
                }
                config[key] = value;
            }
        }
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

    const setItemsChecked = (event) => {
        const checked = event.target.checked;
        const newItems = items.map( i => {
            i.checked = checked;
            return i;
        });

        setItems( newItems );
        setAllItemsChecked( checked );
    }

    const setItemChecked = (event, item) => {
        const checked = event.target.checked;
        const newItems = items.map( i => {
            if( item._id === i._id )
                i.checked = checked;

            return i;
        });

        setItems( newItems );

        const allChecked = newItems.filter( i => i.checked ).length === newItems.length;
        setAllItemsChecked( allChecked );
    }

    useEffect(() => {
        refresh();
    }, []);

    const deleteDisabled = items.filter(item => item.checked).length === 0;

    return <Page>
        <Dialog id="addCredentialsDialog" title="Add Credentials" onOk={onDialogOk}>
            {
                dialogError &&
                <div className="alert alert-sm alert-danger">
                    {dialogError}
                </div>
            }
            <div className="flex flex-column mb-3">
                <label className="form-label mb-1 fw-bolder">Name <span className="text-danger">*</span></label>
                <input type="text" name="name" ref={nameRef} className="form-control form-control-sm" />
            </div>
            <div className="flex flex-column mb-3">
                <label className="form-label mb-1 fw-bolder">Credentials Type <span className="text-danger">*</span></label>
                <select ref={selectRef} name="type" className="form-control form-control-sm form-select" onChange={(event) => {
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

        <div className={`modal fade`} id="deleteDialog" tabIndex={1} aria-labelledby="deleteDialogLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h6 id="deleteDialogLabel" className="fs-8">Delete Data Source</h6>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    Do you realy want to delete the selected items?
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={() => deleteItems()}>Delete</button>
                </div>
                </div>
            </div>
        </div>

        <div className="flex flex-column p-2">
            <h5 className="flex align-items-center">
                <LockIcon size={16} className="text-amber-500 flex me-2"/>
                <span>Credentials</span>
            </h5>
            <div className="text-secondary fst-italic mb-3">Credentials are used to authenticate requests.</div>
            <div className="command-bar">
                <button className="btn btn-sm btn-default me-2 flex align-items-center" disabled={error || loading} onClick={showAddDialog}>
                    <AddIcon className={`me-1 ${error || loading ? "" : "text-primary"}`}/>
                    <span>Create</span>
                </button>
                <button className="btn btn-sm btn-default flex align-items-center" onClick={refresh}>
                    <RefreshIcon className="text-primary me-1"/>
                    <span>Refresh</span>
                </button>
                <button disabled={deleteDisabled} className="btn btn-sm btn-default flex align-items-center" onClick={showDeleteDialog}>
                    <TrashIcon className={`me-1 ${deleteDisabled ? "" : "text-primary"}`}/>
                    <span>Delete</span>
                </button>
            </div>
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
                        <div className="table-column table-header col-auto icon">
                            <input type="checkbox" className="form-check-input" checked={allItemsChecked} onChange={(event) => setItemsChecked(event)}/>
                        </div>
                        <div className="table-column table-header col">NAME</div>
                        <div className="table-column table-header col">TYPE</div>
                        <div className="table-column table-header col">CREATED</div>
                    </div>
                    {
                        items.map( item => {
                            return <div key={item._id} className={`row ${item.checked ? "selected" : ""}`}>
                                <div className="table-column col-auto icon">
                                    <input type="checkbox" className="form-check-input" checked={item.checked} onChange={(event) => setItemChecked(event, item)} />
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
                            </div>
                        })
                    }
                </div>
            }
        </div>
    </Page>
}