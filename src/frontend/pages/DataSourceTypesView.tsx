import { 
    useContext,
    useEffect, 
    useRef, 
    useState 
} from "react";
import { 
    camelCase, 
    upperFirst 
} from "lodash";
import { 
    AddIcon,
    CheckCircleFillIcon, 
    PackageIcon, 
    Page, 
    RefreshIcon, 
    TrashIcon 
} from "../core";
import { Modal } from "bootstrap";
import { NavLink } from "react-router-dom";
import { DeleteDialog } from "../core/DeleteDialog";
import { ApplicationContext } from "../contexts/ApplicationContext";
import { DataTable } from "../core/DataTable";
import { MessageBar, MessageBarType } from "../core/MessageBar";
import { CommandBarButton } from "../core/CommandBarButton";

export const DataSourceTypesView = () => {
    const [items, setItems] = useState([]);
    const [allItemsChecked, setAllItemsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [dialogError, setDialogError] = useState(null);
    const nameRef = useRef<HTMLInputElement>();
    const typeNameRef = useRef<HTMLInputElement>();

    const ctx = useContext(ApplicationContext);

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
        ctx.setContext("Data Source Types");
        ctx.setSearchBar( true )
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
                        <MessageBar type={MessageBarType.ERROR} message={dialogError} className="alert-sm" />
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

        <DeleteDialog onDelete={deleteItems} />

        <>
            <h5 className="flex align-items-center">
                <PackageIcon size={16} className="text-blue-800 me-2" />
                <span>Data Source Types</span>
            </h5>
            <div className="text-secondary fst-italic mb-3">Basic types to connect your sources for fetching data.</div>
            <div className="command-bar">
                <CommandBarButton label="Create" disabled={error || loading} icon={<AddIcon />} onClick={showAddDialog} />
                <CommandBarButton label="Refresh" icon={<RefreshIcon />} onClick={refresh} />
                <CommandBarButton label="Delete" disabled={deleteDisabled} icon={<TrashIcon />} onClick={showDeleteDialog} />
            </div>
            {
                loading &&
                <MessageBar type={MessageBarType.INFO} message={"Please wait while loading..."} />
            }
            {
                !loading && error &&
                <MessageBar type={MessageBarType.ERROR} message={"Unable to load items"} />
            }
            {
                !loading && !error && items?.length === 0 &&
                <MessageBar type={MessageBarType.INFO} message={"There are no items in this view"} />
            }
            {
                items.length > 0 &&
                <DataTable headers={[
                    { content: <input type="checkbox" className="form-check-input" checked={allItemsChecked} onChange={(event) => setItemsChecked(event)} />, className: "col-auto icon" },
                    { content: "TypeName", className: "col" },
                    { content: "in use", className: "col-1" },
                    { content: "created", className: "col" }
                ]} items={
                    items.map(item => {
                        return {
                            selected: item.checked,
                            columns: [
                                {
                                    content: <input type="checkbox" className="form-check-input" checked={item.checked} onChange={(event) => setItemChecked(event, item)} />,
                                    className: "col-auto icon"
                                },
                                {
                                    content: <NavLink to={`/data-source-types/${item._id}`} className="text-primary text-decoration-none hover">{item.typeName}</NavLink>,
                                    className: "col"
                                },
                                {
                                    content: item.dataSources.length > 0 ? <CheckCircleFillIcon size={14} className="text-success" /> : null,
                                    className: "col-1"
                                },
                                {
                                    content: moment(item.createdAt).fromNow(),
                                    className: "col"
                                }
                            ]
                        }
                    })
                } />
            }
        </>
    </Page>
}