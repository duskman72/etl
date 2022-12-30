import { 
    useContext,
    useEffect, 
    useRef, 
    useState 
} from "react";
import { 
    AddIcon,
    CredentialsSelect,
    PackageDependendsIcon,
    Page,
    RefreshIcon,
    TrashIcon,
    CommandBarButton, 
    DataTable, 
    DeleteDialog, 
    MessageBar, 
    MessageBarType 
} from "../core";
import { v4 as uuid } from "uuid";
import { Modal } from "bootstrap";
import { ApplicationContext } from "../contexts/ApplicationContext";
import moment from "moment";

export default () => {
    const [dataSourceTypes, setDataSourceTypes] = useState([]);
    const [selectedDataSourceType, setSelectedDataSourceType] = useState(null);
    const [allItemsChecked, setAllItemsChecked] = useState(false);
    const [dataSourceTypesLoading, setDataSourceTypesLoading] = useState(false);
    const [dialogError, setDialogError] = useState(null);
    const [wizardStep, setWizardStep] = useState(0);
    const [config, setConfig] = useState({});
    const nameRef = useRef<HTMLInputElement>();
    const selectRef = useRef<HTMLSelectElement>();

    const ctx = useContext(ApplicationContext);

    const [ajaxData, setAjaxData] = useState({
        items: [],
        error: false,
        loading: false
    });

    const refresh = () => {
        if (ajaxData.loading) return;
        setAjaxData(prev => {
            return {
                ...prev,
                items: [],
                error: false,
                loading: true
            }
        });

        setWizardStep( 0 );
        setAllItemsChecked( false );

        fetch("/api/data-sources", {
            headers: {
                "X-Requested-With": "XmlHttpRequest"
            }
        })
        .then(response => response.json() )
        .then(data => {
            setAjaxData(prev => {
                return {
                    ...prev,
                    items: data.items.map(item => {
                        item.checked = false;
                        return item;
                    }),
                    loading: false
                }
            });
        })
        .catch(() => {
            setAjaxData(prev => {
                return {
                    ...prev,
                    items: [],
                    error: true,
                    loading: false
                }
            });
        })
    }

    const loadDataSourceTypes = () => {
        if (dataSourceTypesLoading ) return;
        setDataSourceTypesLoading(true);

        fetch("/api/data-source-types", {
            headers: {
                "X-Requested-With": "XmlHttpRequest"
            }
        })
        .then(response => {
            response.json().then(data => {
                setDataSourceTypesLoading(false);
                setDataSourceTypes(data.items);
            })
        })
        .catch(() => {
            setDataSourceTypesLoading(false);
        })
    }

    const deleteItems = () => {
        const modal = Modal.getOrCreateInstance(document.querySelector("#deleteDialog"));
        modal.hide();

        Promise.all(ajaxData.items.filter(item => item.checked ).map( item => {
            return new Promise((accept, _reject) => {
                const url = "/api/data-sources/" + item._id;
                fetch(url, { method: "delete", headers: { "X-Requested-Width": "XmlHttpRequest" } }).then(() => {
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

    const addItem = (configValues) => {
        setWizardStep( 0 );
        setSelectedDataSourceType( null );
        setDialogError( null );
        setConfig({});

        const el = document.querySelector("#addSourceDialog");
        const modal = Modal.getInstance(el);
        modal.hide();

        fetch("/api/data-sources", {
            headers: {
                "X-Requested-With": "XmlHttpRequest",
                "Content-Type": "application/json; charset=utf-8"
            },
            method: "post",
            body: JSON.stringify({ ...configValues })
        })
        .then(() => {
            refresh();
        })
        .catch(() => {
            setAjaxData(prev => {
                return {
                    ...prev,
                    items: [],
                    error: true,
                    loading: false
                }
            });
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

    const setItemsChecked = (event) => {
        const checked = event.target.checked;
        const newItems = ajaxData.items.map( i => {
            i.checked = checked;
            return i;
        });

        setAjaxData(prev => {
            return {
                ...prev,
                items: newItems
            }
        });
        setAllItemsChecked( checked );
    }

    const setItemChecked = (event, item) => {
        const checked = event.target.checked;
        const newItems = ajaxData.items.map( i => {
            if( item._id === i._id )
                i.checked = checked;

            return i;
        });

        setAjaxData(prev => {
            return {
                ...prev,
                items: newItems
            }
        });

        const allChecked = newItems.filter( i => i.checked ).length === newItems.length;
        setAllItemsChecked( allChecked );
    }

    useEffect(() => {
        ctx.setContext("Data Sources");
        ctx.setSearchBar( true )
        refresh();
    }, []);

    const renderField = (field) => {
        return <div key={uuid()} className="flex flex-column mb-3">
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

    const deleteDisabled = ajaxData.items.filter(item => item.checked).length === 0;

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
                            <MessageBar type={MessageBarType.ERROR} message={dialogError} className="alert-sm" />
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
                            // render general fields
                            selectedDataSourceType.config.formFields.general.map( field => {
                                return renderField(field);
                            })
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

                                            const fieldMap = {};
                                            for( const field of configuredFields) {
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

        <DeleteDialog onDelete={deleteItems} />

        <>
            <h5 className="flex align-items-center">
                <PackageDependendsIcon size={16} className="text-blue-800 me-2" />
                <span>Data Sources</span>
            </h5>
            <div className="text-secondary fst-italic mb-3">Fetch any kind of data from different sources.</div>
            <div className="command-bar">
                <CommandBarButton label="Create" disabled={ajaxData.error || ajaxData.loading} icon={<AddIcon />} onClick={showAddDialog} />
                <CommandBarButton label="Refresh" icon={<RefreshIcon />} onClick={refresh} />
                <CommandBarButton label="Delete" disabled={deleteDisabled} icon={<TrashIcon />} onClick={showDeleteDialog} />
            </div>
            {
                ajaxData.loading &&
                <MessageBar type={MessageBarType.INFO} message={"Please wait while loading..."} />
            }
            {
                !ajaxData.loading && ajaxData.error &&
                <MessageBar type={MessageBarType.ERROR} message={"Unable to load items"} />
            }
            {
                !ajaxData.loading && !ajaxData.error && ajaxData.items?.length === 0 &&
                <MessageBar type={MessageBarType.INFO} message={"There are no items in this view"} />
            }
            {
                ajaxData.items?.length > 0 &&
                <>
                    <DataTable headers={[
                        {
                            content: <input type="checkbox" className="form-check-input" checked={allItemsChecked} onChange={(event) => setItemsChecked(event)} />,
                            className: "col-auto icon"
                        },
                        {
                            content: "Name",
                            className: "col"
                        },
                        {
                            content: "TypeName",
                            className: "col"
                        },
                        {
                            content: "Created",
                            className: "col"
                        }
                    ]} items={
                        ajaxData.items.map( item => {
                            return {
                                selected: item.checked,
                                columns: [
                                    {
                                        content: <input type="checkbox" className="form-check-input" checked={item.checked} onChange={(event) => setItemChecked(event, item)} />,
                                        className: "col-auto icon"
                                    },
                                    {
                                        content: item.name,
                                        className: "col"
                                    },
                                    {
                                        content: item.type.typeName,
                                        className: "col"
                                    },
                                    {
                                        content: moment(item.createdAt).fromNow(),
                                        className: "col"
                                    }
                                ]
                            }
                        })
                    } />
                </>
            }
        </>
    </Page>
}