import React, { useEffect, useRef, useState } from "react";
import { Page } from "../core/Page";
import $ from "jquery";
import moment from "moment";
import * as Inflector from "inflection";
import { Modal } from "bootstrap";
import { AlertIcon } from "../core/icons/AlertIcon";
import { TrashIcon } from "../core/icons/TrashIcon";
import { CheckCircleFillIcon } from "../core/icons/CheckCircleFillIcon";

export const DataSourceTypes = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
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
        const name = nameRef.current.value?.trim();
        const typeName = typeNameRef.current.value?.trim();

        const el = document.querySelector("#addSourceTypeDialog");
        const modal = Modal.getInstance(el);
        modal.hide();

        $.ajax({
            url: "/api/data-source-types",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({name, typeName})
        })
        .done(() => {
            refresh();
        })
        .fail(() => {
            // TBD show error to user
        })
    }

    const showAddDialog = () => {
        const el = document.querySelector("#addSourceTypeDialog");
        const modal = Modal.getOrCreateInstance(el);
        modal.show();

        if( nameRef )
            nameRef.current.value = "";

        if( typeNameRef )
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
                    <h6 id="addSourceTypeDialogLabel" className="fs-7">Add Data Source Type</h6>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <div className="flex flex-column mb-3">
                        <label className="form-label mb-1 fw-bolder">Source Name</label>
                        <input type="text"  onKeyUp={(e: any) => {
                            const text = e.target.value.trim()
                                .replace(/[äöüß]+/ig, "")
                                .replace(/[\,\.\;\:\<\>\|\@\#\'\-\_\/\\\=\?\)\(\&\%\$\§\"\!\°\^\[\]\{\}\`\`\*\+\~\s]+/g, "");

                            typeNameRef.current.value = Inflector.camelize(text);  
                        }} ref={nameRef} className="form-control form-control-sm disabled" />
                    </div>
                    <div className="flex flex-column">
                        <label className="form-label mb-1 fw-bolder">Type Name</label>
                        <input type="text" ref={typeNameRef} className="form-control form-control-sm" />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={() => addItem()}>Save</button>
                </div>
                </div>
            </div>
        </div>

        <div className={`modal fade`} id="deleteSourceTypeDialog" tabIndex={1} aria-labelledby="deleteSourceTypeDialogLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h6 id="deleteSourceTypeDialogLabel" className="fs-7">Delete Data Source Type</h6>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    Do you realy want to delete this data source type?
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={() => deleteItem()}>Delete</button>
                </div>
                </div>
            </div>
        </div>

        <div className="flex flex-column p-2">
            <h6 className="mb-3 flex align-items-center">
                <span className="me-3">Data Source Types</span>
                <button className="btn btn-sm btn-primary me-2" onClick={showAddDialog}>Add Type</button>
                <button className="btn btn-sm btn-default" onClick={refresh}>Refresh</button>
            </h6>
            {
                loading &&
                <div className="alert alert-info">Please wait while loading...</div>
            }
            {
                !loading && error &&
                <div className="alert alert-danger">Unable to load items</div>
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
                        <div className="table-column table-header col-2">ID</div>
                        <div className="table-column table-header col">NAME</div>
                        <div className="table-column table-header col">TYPENAME</div>
                        <div className="table-column table-header col">CREATED</div>
                        <div className="table-column table-header col-1">&nbsp;</div>
                    </div>
                    {
                        items.map( item => {
                            return <div key={item._id} className="row">
                                <div className="table-column col-1">
                                    {
                                        !item.valid &&
                                        <AlertIcon size={14} className="text-danger"/>
                                    }
                                    {
                                        item.valid &&
                                        <CheckCircleFillIcon size={14} className="text-success"/>
                                    }
                                </div>
                                <div className="table-column col-2">
                                    {item._id.toUpperCase()}
                                </div>
                                <div className="table-column col">
                                    {item.name}
                                </div>
                                <div className="table-column col">
                                    {item.typeName}
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