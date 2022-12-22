import { useEffect, useRef, useState } from "react";
import { Page } from "../core/Page";
import { camelCase, upperFirst } from "lodash";
import { Modal } from "bootstrap";
import { AlertIcon } from "../core/icons/AlertIcon";
import { TrashIcon } from "../core/icons/TrashIcon";
import { CheckCircleFillIcon } from "../core/icons/CheckCircleFillIcon";
import { AddIcon } from "../core/icons/AddIcon";
import { RefreshIcon } from "../core/icons/RefreshIcon";
import { PackageIcon } from "../core/icons/PackageIcon";

export const DataSourceTypesView = () => {
    const [items, setItems] = useState([]);
    const [allItemsChecked, setAllItemsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [dialogError, setDialogError] = useState(null);
    const nameRef = useRef<HTMLInputElement>();
    const typeNameRef = useRef<HTMLInputElement>();

    const refresh = () => {
        setItems([]);
        setError(false);
        setAllItemsChecked( false );
        loadItems();
    }

    const loadItems = () => {
        if( loading ) return;
        setLoading(true);

        $.ajax({
            url: "/api/data-source-types"
        })
        .done(response => {
            setLoading(false);
            setItems( response.items.map( item => {
                item.checked = false;
                return item;
            }));
        })
        .fail(() => {
            setLoading(false);
            setError(true);
        })
    }

    const deleteItems = () => {
        const modal = Modal.getOrCreateInstance(document.querySelector("#deleteDialog"));
        modal.hide();

        Promise.all(items.filter(item => item.checked ).map( item => {
            return new Promise((accept, _reject) => {
                const id = item._id;
                $.ajax({
                    url: "/api/data-source-types/" + id,
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

    const addItem = () => {
        setDialogError( null );
        const name = nameRef.current.value?.trim();
        const typeName = typeNameRef.current.value?.trim();

        if( name.length < 4 ) {
            setDialogError( "Error: name must be at least 4 characters");
            return;
        }

        const el = document.querySelector("#addSourceTypeDialog");
        const modal = Modal.getInstance(el);

        $.ajax({
            url: "/api/data-source-types",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({name, typeName})
        })
        .done(() => {
            modal.hide();
            refresh();
        })
        .fail(() => {
            // TBD show error to user
            modal.hide();
        })
    }

    const showAddDialog = () => {
        setDialogError( null );
        const el = document.querySelector("#addSourceTypeDialog");
        const modal = Modal.getOrCreateInstance(el);
        modal.show();

        if( nameRef && nameRef.current )
            nameRef.current.value = "";

        if( typeNameRef && typeNameRef.current )
            typeNameRef.current.value = "";
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
        loadItems();
    }, []);

    const deleteDisabled = items.filter(item => item.checked).length === 0;

    return <Page>

        <div className={`modal fade`} id="addSourceTypeDialog" tabIndex={1} aria-labelledby="addSourceTypeDialogLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h6 id="addSourceTypeDialogLabel" className="fs-8">Add Data Source Type</h6>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    {
                        dialogError &&
                        <div className="alert alert-sm alert-danger">
                            {dialogError}
                        </div>
                    }
                    <div className="flex flex-column mb-3">
                        <label className="form-label mb-1 fw-bolder">Source Type Name <span className="text-danger">*</span></label>
                        <input type="text"  onKeyUp={(e: any) => {
                            const text = e.target.value.trim(); 
                            typeNameRef.current.value = upperFirst(camelCase(text.toUpperCase()));  
                        }} ref={nameRef} className="form-control form-control-sm" />
                    </div>
                    <div className="flex flex-column">
                        <label className="form-label mb-1 fw-bolder">Generated Type Name</label>
                        <input type="text" ref={typeNameRef} disabled className="form-control form-control-sm disabled" />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={() => addItem()}>Save</button>
                </div>
                </div>
            </div>
        </div>

        <div className={`modal fade`} id="deleteDialog" tabIndex={1} aria-labelledby="deleteDialogLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h6 id="deleteDialogLabel" className="fs-8">Delete Items</h6>
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
                <PackageIcon size={16} className="text-blue-800 me-2" />
                <span>Data Source Types</span>
            </h5>
            <div className="text-secondary fst-italic mb-3">Basic types to connect your sources for fetching data.</div>
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
                        <div className="table-column table-header col">TYPENAME</div>
                        <div className="table-column table-header col-1">IN USE</div>
                        <div className="table-column table-header col">CREATED</div>
                    </div>
                    {
                        items.map( item => {
                            return <div key={item._id} className={`row ${item.checked ? "selected" : ""}`}>
                                <div className="table-column col-auto icon">
                                    <input type="checkbox" className="form-check-input" checked={item.checked} onChange={(event) => setItemChecked(event, item)} />
                                </div>
                                <div className="table-column col">
                                    {item.typeName}
                                </div>
                                <div className="table-column col-1">
                                    {
                                        item.dataSources.length > 0 &&
                                        <CheckCircleFillIcon size={14} className="text-success"/>
                                    }
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