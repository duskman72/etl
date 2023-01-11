import { Modal } from "bootstrap";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { isAutoAccessorPropertyDeclaration } from "typescript";
import { ApplicationContext } from "../contexts/ApplicationContext";
import { 
    AddIcon, 
    ClockIcon, 
    CommandBarButton, 
    DataTable, 
    DateInput,
    DeleteDialog, 
    FormInput,
    MessageBar, 
    MessageBarType, 
    Page,
    RefreshIcon, 
    TrashIcon 
} from "../core";
import { CheckboxInput } from "../core/CheckboxInput";
import { DataSourceSelect } from "../core/DataSourceSelect";
import { RepeatInput } from "../core/RepeatInput";

export default () => {
    const ctx = useContext(ApplicationContext);
    const [dialogError, setDialogError] = useState(null);
    const nameRef = useRef<HTMLInputElement>();
    const dateRef = useRef<HTMLInputElement>();
    const repeatValueRef = useRef<HTMLInputElement>();
    const hourRef = useRef<HTMLSelectElement>();
    const repeatTypeRef = useRef<HTMLSelectElement>();
    const sourceRef = useRef<HTMLSelectElement>();
    const [repeatJob, setRepeatJob] = useState(false);
    const [allItemsChecked, setAllItemsChecked] = useState(false);

    const [timer, setTimer] = useState(undefined);
    const [intervalValue, setIntervalValue] = useState(0);

    const [ajaxData, setAjaxData] = useState({
        items: [],
        error: false,
        loading: false
    });

    const refresh = () => {
        if (ajaxData.loading ) return;

        setAllItemsChecked( false );
        setAjaxData( prev => {
            return {
                ...prev,
                items: [],
                error: false,
                loading: true
            }
        });

        fetch("/api/jobs", {
            headers: {
                "X-Requested-With": "XmlHttpRequest",
            }
        })
        .then( response => response.json())
        .then( data => {
            setAjaxData(prev => {
                return {
                    ...prev,
                    items: data?.items,
                    loading: false
                }
            });
        })
        .catch(() => {
            setAjaxData(prev => {
                return {
                    ...prev,
                    loading: false,
                    error: true
                }
            });
        });
    }
    
    useEffect(() => {
        ctx.setContext("Jobs");
        ctx.setSearchBar( true );
        refresh();

        if (!timer) {
            const interval = setInterval(() => {
                setIntervalValue(new Date().getTime());
            }, 1000 * 5);
            setTimer(interval);
        }
    }, []);

    const showAddDialog = () => {
        setDialogError(null);
        setRepeatJob( false );
        if( nameRef.current )
            nameRef.current.value = "";

        if( dateRef.current )
            dateRef.current.value = moment(new Date()).format("YYYY-MM-DD");

        if( hourRef.current )
            hourRef.current.selectedIndex = 0;

        if( repeatTypeRef.current )
            repeatTypeRef.current.selectedIndex = 0;

        if( repeatValueRef.current )
            repeatValueRef.current.value = "";

        if ( sourceRef.current )
            sourceRef.current.selectedIndex = 0;

        const el = document.querySelector("#addJobDialog");
        const modal = Modal.getOrCreateInstance(el);
        modal.show();
    }

    const showDeleteDialog = () => {
        const el = document.querySelector("#deleteDialog");
        const modal = Modal.getOrCreateInstance(el);
        modal.show();
    }

    const addItem = () => {
        setDialogError( null );
        const el = document.querySelector("#addJobDialog");
        const modal = Modal.getOrCreateInstance(el);

        const data: any = {};
        data.source = sourceRef.current?.value;
        data.name = nameRef.current.value.trim();
        data.date = dateRef.current.value.trim() + "T" + hourRef.current.value + ":00.000Z";
        data.repeat = null;

        if (!data.name) {
            setDialogError("Job name is required.")
            return;
        }

        if (data.name.length <= 3) {
            setDialogError("Job name length must be at least 4 characters.")
            return;
        }

        if( !data.source ) {
            setDialogError("Invalid Data Source");
            return;
        }

        if( repeatJob ) {
            data.repeat = {
                type: repeatTypeRef.current.value,
                value: parseInt(repeatValueRef.current.value) || 0
            }

            if (data.repeat.value <= 0) {
                setDialogError("Invalid repeat interval")
                return;
            }
        }

        modal.hide();

        fetch("/api/jobs", {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-Requested-With": "XmlHttpRequest"
            },
            body: JSON.stringify(data)
        })
        .then( response => response.json())
        .then(() => {
            refresh();
        })
    }

    const deleteItems = () => {
        const el = document.querySelector("#deleteDialog");
        const modal = Modal.getOrCreateInstance(el);

        const selectedItems = ajaxData.items.filter( item => item.checked );
        
        Promise.all( selectedItems.map( item => {
            const p = new Promise((accept, _reject) => {
                fetch("/api/jobs/" + item._id, {
                    method: "delete",
                    headers: {
                        "X-Requested-With": "XmlHttpRequest"
                    }
                })
                .then(() => accept(null) );
            });
            return p;
        }))
            .then(() => { modal.hide(); refresh(); } );
    }

    const deleteDisabled = ajaxData.items.filter(item => item.checked).length === 0;

    const quarters = ["00", "15", "30", "45"];

    const h = [];
    const hours = useMemo(() => {
        if( h.length > 0 ) return h;
        
        for (let i = 0; i < 24; i++) {
            let hour = `${i}`;
            if (hour.length === 1)
                hour = `0${hour}`;

            quarters.forEach(q => {
                h.push(`${hour}:${q}`)
            })
        }

        return h;
    }, [h]);

    const setItemsChecked = (event) => {
        const checked = event.target.checked;
        const newItems = ajaxData.items.map(i => {
            i.checked = checked;
            return i;
        });

        setAjaxData(prev => {
            return {
                ...prev,
                items: newItems
            }
        });
        setAllItemsChecked(checked);
    }

    const setItemChecked = (event, item) => {
        const checked = event.target.checked;
        const newItems = ajaxData.items.map(i => {
            if (item._id === i._id)
                i.checked = checked;

            return i;
        });

        setAjaxData(prev => {
            return {
                ...prev,
                items: newItems
            }
        });

        const allChecked = newItems.filter(i => i.checked).length === newItems.length;
        setAllItemsChecked(allChecked);
    }

    return <Page>
        <input type="hidden" defaultValue={intervalValue} />
        <div className={`modal fade`} id="addJobDialog" tabIndex={1} aria-labelledby="addJobDialogLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 id="addJobDialogLabel" className="fs-8">Add Repetitive Job</h6>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {
                            dialogError &&
                            <MessageBar type={MessageBarType.ERROR} message={dialogError} className="alert-sm" />
                        }
                        <FormInput name="name" inputRef={nameRef} required label="Job Name" />
                        <div className="flex flex-column mb-3">
                            <label className="form-label fw-bold">
                                <span className="me-2">Data Source</span>
                                <span className="text-danger">*</span>
                            </label>
                            <DataSourceSelect name="data-source_select" selectRef={sourceRef} />
                        </div>
                        <div className="flex align-items-center mb-3">
                            <DateInput inputRef={dateRef} required label="Run this job" name="start-date" />
                            <div className="flex flex-column w-50">
                                <label className="form-label mb-1 fw-bolder">At Time</label>
                                <select ref={hourRef} defaultValue={"00:00"} className="form-control form-control-sm form-select">
                                    {
                                        hours.map(h => {
                                            return <option key={h} value={h}>{h}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <CheckboxInput name="repeat-job" label="Repeat Job" onChange={(e) => {
                            setRepeatJob(e.target.checked);
                        }} />
                        {
                            repeatJob &&
                            <RepeatInput required repeatValueRef={repeatValueRef} repeatTypeRef={repeatTypeRef} />
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={() => addItem()}>Save</button>
                    </div>
                </div>
            </div>
        </div>

        <DeleteDialog onDelete={deleteItems} />
        
        <h5 className="flex align-items-center">
            <ClockIcon size={16} className="text-blue-800 me-2" />
            <span>Repetitive Jobs</span>
        </h5>
        <div className="text-secondary fst-italic mb-3">Repetitive jobs are fetching data sources in timed intervals.</div>
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
            <DataTable headers={[
                {
                    content: <input type="checkbox" className="form-check-input" checked={allItemsChecked} onChange={(event) => setItemsChecked(event)} />,
                    className: "col-auto icon"
                },
                {
                    content: "Job Name",
                    className: "col"
                },
                {
                    content: "Source",
                    className: "col"
                },
                {
                    content: "Start",
                    className: "col"
                },
                {
                    content: "Last Execution",
                    className: "col"
                },
                {
                    content: "Repeat",
                    className: "col"
                },
                {
                    content: "Created",
                    className: "col"
                }
            ]} items={
                ajaxData.items.map(item => {
                    return {
                        selected: item.checked,
                        columns: [
                            {
                                content: <input type="checkbox" className="form-check-input" checked={item.checked} onChange={(event) => setItemChecked(event, item)} />,
                                className: "col-auto icon"
                            },
                            {
                                content: <NavLink to={`/jobs/${item._id}`} className="text-primary text-decoration-none hover">{item.name}</NavLink>,
                                className: "col"
                            },
                            {
                                content: item.source.name,
                                className: "col"
                            },
                            {
                                content: moment(item.jobDate).format("YYYY-MM-DD HH:mm"),
                                className: "col"
                            },
                            {
                                content: moment(item.lastExec).format("YYYY-MM-DD HH:mm"),
                                className: "col"
                            },
                            {
                                content: item.repeat ? `Every ${item.repeatValue} ${item.repeatType}` : "never",
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
        }
    </Page>
}