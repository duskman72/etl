import { useEffect, useRef, useState } from "react";
import { Page } from "../core/Page";
import { camelCase, upperFirst } from "lodash";
import { Modal } from "bootstrap";
import { AlertIcon } from "../core/icons/AlertIcon";
import { TrashIcon } from "../core/icons/TrashIcon";
import { CheckCircleFillIcon } from "../core/icons/CheckCircleFillIcon";

export const DataSourceTypesView = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [dialogError, setDialogError] = useState(null);
    const nameRef = useRef<HTMLInputElement>();
    const typeNameRef = useRef<HTMLInputElement>();

    const refresh = () => {
        setItems([]);
        loadItems();
    }

    const loadItems = () => {
        if( loading ) return;
        setError(false);
        setLoading(true);

        $.ajax({
            url: "/api/data-source-types"
        })
        .done(response => {
            setLoading(false);
            setItems( response.items );
        })
        .fail(() => {
            setLoading(false);
            setError(true);
        })
    }

    const deleteItem = () => {
        const modal = Modal.getInstance(document.querySelector("#deleteSourceTypeDialog"));
        modal.hide();

        const id = selectedItem._id;
        setSelectedItem( null );
        
        $.ajax({
            url: "/api/data-source-types/" + id,
            method: "delete"
        })
        .done(() => {
            refresh();
        });
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
    
    useEffect(() => {
        loadItems();
    }, []);

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

        <div className={`modal fade`} id="deleteSourceTypeDialog" tabIndex={1} aria-labelledby="deleteSourceTypeDialogLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h6 id="deleteSourceTypeDialogLabel" className="fs-8">Delete Data Source Type</h6>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    Do you realy want to delete this data source type?
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={() => deleteItem()}>Delete</button>
                </div>
                </div>
            </div>
        </div>

        <div className="flex flex-column p-2">
            <h6 className="mb-3 flex align-items-center">
                <span className="me-3">Data Source Types</span>
                <button className="btn btn-sm btn-primary me-2" disabled={error || loading} onClick={showAddDialog}>Add Type</button>
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
                        <div className="table-column table-header col-1">&nbsp;</div>
                        <div className="table-column table-header col">ID</div>
                        <div className="table-column table-header col">TYPENAME</div>
                        <div className="table-column table-header col-1">IN USE</div>
                        <div className="table-column table-header col">CREATED</div>
                        <div className="table-column table-header col-1">&nbsp;</div>
                    </div>
                    {
                        items.map( item => {
                            return <div key={item._id} className="row">
                                <div className="table-column col-1">
                                    {
                                        !item.config &&
                                        <AlertIcon title="Invalid type" size={14} className="text-danger"/>
                                    }
                                    {
                                        item.config &&
                                        <CheckCircleFillIcon title="Type is valid" size={14} className="text-success"/>
                                    }
                                </div>
                                <div className="table-column col">
                                    {item._id.toUpperCase()}
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