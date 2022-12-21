import { useEffect, useRef, useState } from "react";
import { Page } from "../core/Page";
import { Modal } from "bootstrap";
import { AlertIcon } from "../core/icons/AlertIcon";
import { TrashIcon } from "../core/icons/TrashIcon";
import { CredentialsSelect } from "../core/CredentialsSelect";
import { AddIcon } from "../core/icons/AddIcon";
import { RefreshIcon } from "../core/icons/RefreshIcon";

export const DataSourcesView = () => {
    const [items, setItems] = useState([]);
    const [dataSourceTypes, setDataSourceTypes] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedDataSourceType, setSelectedDataSourceType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataSourceTypesLoading, setDataSourceTypesLoading] = useState(false);
    const [error, setError] = useState(false);
    const [dialogError, setDialogError] = useState(null);
    const [wizardStep, setWizardStep] = useState(0);
    const [config, setConfig] = useState({});
    const nameRef = useRef<HTMLInputElement>();
    const selectRef = useRef<HTMLSelectElement>();

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

    const addItem = (configValues) => {
        setWizardStep( 0 );
        setSelectedDataSourceType( null );
        setDialogError( null );
        setConfig({});

        const el = document.querySelector("#addSourceDialog");
        const modal = Modal.getInstance(el);
        modal.hide();

        $.ajax({
            url: "/api/data-sources",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({...configValues})
        })
        .done(() => {
           refresh();
        })
        .fail(() => {
            console.log("ERROR!!!")
        });
    }

    const showAddDialog = () => {
        setWizardStep( 0 );
        setSelectedDataSourceType( null );
        setDialogError( null );
        setConfig({});
        
        const el = document.querySelector("#addSourceDialog");
        const modal = Modal.getOrCreateInstance(el);
        modal.show();

        loadDataSourceTypes();

        if( nameRef && nameRef.current )
            nameRef.current.value = "";
    }

    useEffect(() => {
        loadItems();
    }, []);

    const renderField = (field) => {
        return <div className="flex flex-column mb-3">
            <label className="form-label mb-1 fw-bolder">
                <span>{field.label}</span>
                {
                    field.required &&
                    <span className="text-danger ps-1">*</span>
                }
            </label>
            {
                field.type === "input" &&
                <input type="text" name={field.name} className="form-control form-control-sm" />
            }
            {
                field.type === "credentials-mgr" &&
                <CredentialsSelect name={field.name} />
            }
        </div>
    }

    return <Page>
        <div className={`modal fade`} id="addSourceDialog" tabIndex={1} aria-labelledby="addSourceDialogLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 id="addSourceDialogLabel" className="fs-8">Add Data Source{wizardStep === 1 ? ` of type ${selectedDataSourceType.typeName}` : ""}</h6>
                        {
                            !dataSourceTypesLoading &&
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        }
                    </div>
                    <div className="modal-body">
                        {
                            dialogError &&
                            <div className="alert alert-sm alert-danger">
                                {dialogError}
                            </div>
                        }
                        {
                            !dataSourceTypesLoading && wizardStep === 0 &&
                            <>
                                {
                                    dataSourceTypes?.length > 0 &&
                                    <div className="flex flex-column mb-3">
                                        <label className="form-label mb-1 fw-bolder">Display Name <span className="text-danger">*</span></label>
                                        <input type="text" ref={nameRef} className="form-control form-control-sm" />
                                    </div>
                                }
                                <div className="flex flex-column">
                                    {
                                        dataSourceTypes?.length > 0 &&
                                        <>
                                            <label className="form-label mb-1 fw-bolder">TypeName <span className="text-danger">*</span></label>
                                            <select onChange={() => {
                                                setSelectedDataSourceType(() => {
                                                    const typeId = selectRef.current.options[selectRef.current.selectedIndex]?.value;
                                                    return dataSourceTypes.find(dst => dst._id === typeId);
                                                });
                                            }} ref={selectRef} defaultValue={""} className="form-control form-control-sm form-select">
                                                <>
                                                <option value="">Please Choose...</option>
                                                {
                                                    dataSourceTypes.map( dst => {
                                                        return <option key={dst._id} value={dst._id}>{dst.typeName}</option>
                                                    })
                                                }
                                                </>
                                            </select>
                                        </>
                                    }
                                    {
                                        dataSourceTypes?.length === 0 &&
                                        <div className="alert alert-sm alert-warning">
                                            There are no data source types configured
                                        </div>
                                    }
                                </div>
                            </>
                        }
                        {
                            !dataSourceTypesLoading && wizardStep === 1 &&
                            <>
                            {
                                // render general fields
                                selectedDataSourceType.config.formFields.general.map( field => {
                                    return renderField(field);
                                })
                            }
                            </>
                        }
                    </div>
                    {
                        !dataSourceTypesLoading &&
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            {
                                dataSourceTypes?.length > 0 &&
                                <button type="button" className="btn btn-primary" onClick={() => {
                                    switch( wizardStep ) {
                                        case 0:
                                            const name = nameRef.current.value.trim();
                                            setDialogError( null );
                                            if( name.length < 4 ) {
                                                setDialogError("Error: Display name must be at least 4 characters");
                                                return;
                                            }

                                            if( !selectedDataSourceType ) {
                                                setDialogError("Error: Please select a data source type");
                                                return;
                                            }

                                            if( !selectedDataSourceType.config ) {
                                                setDialogError("Error: Missing config in selected DataSourceType");
                                                return;
                                            }

                                            if( !selectedDataSourceType.config.formFields ) {
                                                setDialogError("Error: No form fields in selected DataSourceType");
                                                return;
                                            }

                                            if( !selectedDataSourceType.config.formFields.general ) {
                                                setDialogError("Error: No form fields in selected DataSourceType");
                                                return;
                                            }

                                            if( selectedDataSourceType.config.formFields.general.length === 0 ) {
                                                setDialogError("Error: No form fields in selected DataSourceType");
                                                return;
                                            }

                                            setConfig(prev => {
                                                return {
                                                    ...prev,
                                                    typeId: selectedDataSourceType._id,
                                                    name
                                                }
                                            })
                                            setWizardStep( 1 );

                                            break;
    
                                        case 1:
                                            setDialogError( null )
                                            const configuredFields = selectedDataSourceType.config.formFields.general.map(item => {
                                                const domNode: any = document.querySelector(`[name=${item.name}]`) || {};
                                                return {
                                                    name: item.name,
                                                    label: item.label,
                                                    required: item.required,
                                                    value: (""+(domNode.value || "")).trim()
                                                }
                                            });

                                            const requiredFields = configuredFields.filter( field => field.required );
                                            for( const rf of requiredFields ) {
                                                if( rf.value.length === 0 ) {
                                                    setDialogError(`Error: Missing value for field ${rf.label}`);
                                                    return;
                                                }
                                            }

                                            // SAVE TO DATABASE
                                            const fieldMap = {};
                                            for( const field of configuredFields) {
                                                console.log( field )
                                                fieldMap[field.name] = field.value
                                            }

                                            addItem( {
                                                ...config,
                                                config: fieldMap
                                            } );
                                            
                                            break;
                                    }
                                }}>
                                {
                                    wizardStep === 0 && "Next"
                                }
                                {
                                    wizardStep === 1 && "Save"
                                }
                                </button>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>

        <div className={`modal fade`} id="deleteSourceDialog" tabIndex={1} aria-labelledby="deleteSourceDialogLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h6 id="deleteSourceDialogLabel" className="fs-8">Delete Data Source</h6>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    Do you realy want to delete this data source?
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={() => deleteItem()}>Delete</button>
                </div>
                </div>
            </div>
        </div>

        <div className="flex flex-column p-2">
            <h5 className="mb-3 flex align-items-center mb-3">
                <span className="me-3">Data Sources</span>
            </h5>
            <div className="command-bar">
                <button className="btn btn-sm btn-default me-2 flex align-items-center" disabled={error || loading} onClick={showAddDialog}>
                    <AddIcon className={`me-1 ${error || loading ? "" : "text-primary"}`}/>
                    <span>Create</span>
                </button>
                <button className="btn btn-sm btn-default flex align-items-center" onClick={refresh}>
                    <RefreshIcon className="text-primary me-1"/>
                    <span>Refresh</span>
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
                        <div className="table-column table-header col">NAME</div>
                        <div className="table-column table-header col">TYPENAME</div>
                        <div className="table-column table-header col">CREATED</div>
                        <div className="table-column table-header col-1">&nbsp;</div>
                    </div>
                    {
                        items.map( item => {
                            return <div key={item._id} className="row">
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