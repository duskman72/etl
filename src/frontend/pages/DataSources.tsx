import React, { useEffect, useRef, useState } from "react";
import { Page } from "../core/Page";
import * as Inflector from "inflection";
import { Modal } from "bootstrap";

export const DataSources = () => {
    const [items, setItems] = useState([]);
    const [dataSourceTypes, setDataSourceTypes] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataSourceTypesLoading, setDataSourceTypesLoading] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef<HTMLInputElement>();

    const refresh = () => {
        setItems([]);
        loadItems();
    }

    const loadItems = () => {
        if( loading ) return;
        setError(false);
        setLoading(true);

        $.ajax({
            url: "/api/data-sources"
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

    const loadDataSourceTypes = () => {
        if( loading ) return;
        setError(false);
        setDataSourceTypesLoading(true);

        $.ajax({
            url: "/api/data-source-types"
        })
        .done(response => {
            setDataSourceTypesLoading(false);
            setDataSourceTypes( response.items );
        })
        .fail(() => {
            setDataSourceTypesLoading(false);
            setError(true);
        })
    }

    const addItem = () => {

    }

    const showAddDialog = () => {
        const el = document.querySelector("#addSourceTypeDialog");
        const modal = Modal.getOrCreateInstance(el);
        modal.show();

        loadDataSourceTypes();

        if( nameRef )
            nameRef.current.value = "";
    }

    useEffect(() => {
        loadItems();
    }, []);

    return <Page>
        <div className={`modal fade`} id="addSourceTypeDialog" tabIndex={1} aria-labelledby="addSourceTypeDialogLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 id="addSourceTypeDialogLabel" className="fs-7">Add Data Source</h6>
                        {
                            !dataSourceTypesLoading &&
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        }
                    </div>
                    <div className="modal-body">
                        {
                            !dataSourceTypesLoading &&
                            <>
                                <div className="flex flex-column mb-3">
                                    <label className="form-label mb-1 fw-bolder">Source Name</label>
                                    <input type="text"  onKeyUp={(e: any) => {
                                        const text = e.target.value.trim()
                                            .replace(/[äöüß]+/ig, "")
                                            .replace(/[\,\.\;\:\<\>\|\@\#\'\-\_\/\\\=\?\)\(\&\%\$\§\"\!\°\^\[\]\{\}\`\`\*\+\~\s]+/g, "");

                                            nameRef.current.value = Inflector.camelize(text);  
                                    }} ref={nameRef} className="form-control form-control-sm disabled" />
                                </div>
                                <div className="flex flex-column">
                                    <label className="form-label mb-1 fw-bolder">TypeName</label>
                                    <select className="form-control form-control-sm">
                                        {
                                            dataSourceTypes.map( dst => {
                                                return <option value={dst._id}>
                                                    {dst.typeName}
                                                </option>
                                            })
                                        }
                                    </select>
                                </div>
                            </>
                        }
                    </div>
                    {
                        !dataSourceTypesLoading &&
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => addItem()}>Save</button>
                        </div>
                    }
                </div>
            </div>
        </div>

        <div className="flex flex-column p-2">
            <h6 className="mb-3 flex align-items-center">
                <span className="me-3">Data Sources</span>
                <button className="btn btn-sm btn-primary me-2" onClick={showAddDialog}>Add Source</button>
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
        </div>
    </Page>
}