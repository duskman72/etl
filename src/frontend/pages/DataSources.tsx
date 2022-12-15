import { useEffect, useRef, useState } from "react";
import { Page } from "../core/Page";
import { Modal } from "bootstrap";
import { AlertIcon } from "../core/icons/AlertIcon";
import { Select2 } from "select2-react-component";
import { TrashIcon } from "../core/icons/TrashIcon";

export const DataSources = () => {
    const [items, setItems] = useState([]);
    const [dataSourceTypes, setDataSourceTypes] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataSourceTypesLoading, setDataSourceTypesLoading] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef<HTMLInputElement>();
    const selectRef = useRef<Select2>();

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

    const deleteItem = () => {
        const modal = Modal.getInstance(document.querySelector("#deleteSourceDialog"));
        modal.hide();

        const id = selectedItem._id;
        setSelectedItem( null );
        
        $.ajax({
            url: "/api/data-sources/" + id,
            method: "delete"
        })
        .done(() => {
            refresh();
        });
    }

    const addItem = () => {
        const select2: any = selectRef.current;
        const typeId = select2.option?.value;
        const name = nameRef.current.value;

        const el = document.querySelector("#addSourceDialog");
        const modal = Modal.getInstance(el);
        modal.hide();

        $.ajax({
            url: "/api/data-sources",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({
                name,
                typeId
            })
        })
        .done(() => {
           refresh();
        })
        .fail(() => {
            console.log("ERROR!!!")
        });
    }

    const showAddDialog = () => {
        const el = document.querySelector("#addSourceDialog");
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
        <div className={`modal fade`} id="addSourceDialog" tabIndex={1} aria-labelledby="addSourceDialogLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 id="addSourceDialogLabel" className="fs-7">Add Data Source</h6>
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
                                    <label className="form-label mb-1 fw-bolder">Display Name</label>
                                    <input type="text" ref={nameRef} className="form-control form-control-sm disabled" />
                                </div>
                                <div className="flex flex-column">
                                    <label className="form-label mb-1 fw-bolder">TypeName</label>
                                    <Select2 ref={selectRef} placeholder="Please choose..." data={
                                        dataSourceTypes.map( dst => {
                                            return {
                                                label: dst.typeName,
                                                value: dst._id
                                            }
                                        })
                                    }/>
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

        <div className={`modal fade`} id="deleteSourceDialog" tabIndex={1} aria-labelledby="deleteSourceDialogLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h6 id="deleteSourceDialogLabel" className="fs-7">Delete Data Source</h6>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    Do you realy want to delete this data source?
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
                <span className="me-3">Data Sources</span>
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
                        <div className="table-column table-header col">TYPENAME</div>
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
                                    {item.type?.typeName}
                                </div>
                                <div className="table-column col">
                                    {moment(item.createdAt).fromNow()}
                                </div>
                                <div className="table-column col-1">
                                    <TrashIcon className="text-danger" size={14} onClick={() => {
                                        setSelectedItem( item );
                                        const modal = Modal.getOrCreateInstance(document.querySelector("#deleteSourceDialog"));
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