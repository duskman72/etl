import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, CheckIcon, ClockIcon, CommandBarButton, EditIcon, MessageBar, MessageBarType, Page, RefreshIcon } from "../core"

export default () => {
    const {id} = useParams();
    const [editTitle, setEditTitle] = useState(false);
    const [timer, setTimer] = useState(undefined);
    const [intervalValue, setIntervalValue] = useState(0);
    const [ajaxData, setAjaxData] = useState({
        loading: false,
        loaded: false,
        error: null,
        item: null
    });

    const navigate = useNavigate();
    const titleRef = useRef<HTMLInputElement>();

    const refresh = () => {
        setAjaxData(prev => {
            return {
                ...prev,
                loaded: false,
                loading: true,
                error: false,
                item: null
            }
        });

        fetch("/api/jobs/" + id, {
            headers: {
                "X-Requested-With": "XmlHttpRequest"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error();
                }
                return response.json()
            })
            .then((data) => {
                setAjaxData(prev => {
                    return {
                        ...prev,
                        loaded: true,
                        loading: false,
                        item: data.item
                    }
                });
            })
            .catch(() => {
                setAjaxData(prev => {
                    return {
                        ...prev,
                        loaded: true,
                        loading: false,
                        item: null,
                        error: "Unable to load item " + id
                    }
                });
            });
    }

    useEffect(() => {
        if( !ajaxData.loaded ) {
            refresh();
        }

        if (editTitle ) {// listen to state change
            titleRef.current?.focus();
            titleRef.current.select();
        }

        if( !timer ) {
            const interval = setInterval(() => {
                setIntervalValue(new Date().getTime());
            }, 1000 * 5);
            setTimer( interval );
        }

    }, [editTitle]);

    const updateTitle = () => {
        const name = titleRef.current.value;

        setAjaxData(prev => {
            return {
                ...prev,
                loaded: false,
                loading: true,
                error: false,
                item: ajaxData.item
            }
        });

        fetch(`/api/jobs/${id}`, {
            headers: {
                "X-Requested-With": "XmlHttpRequest",
                "Content-Type": "application/json; charset=utf-8"
            },
            method: "post",
            body: JSON.stringify({name})
        })
        .then(response => response.json())
        .then( response => {
            setAjaxData(prev => {
                return {
                    ...prev,
                    loaded: true,
                    loading: false,
                    error: false,
                    item: response.item
                }
            });
        })
    }

    return <Page>
        <input type="hidden" defaultValue={intervalValue} />
        {
            ajaxData.loading &&
            <>
                <h5 className="flex align-items-center mb-2">
                    <ArrowLeftIcon size={16} className="me-2 cursor-pointer" onClick={() => navigate("/jobs")} />
                    <ClockIcon size={16} className="text-blue-800 me-2" />
                    <span>Repetitive Job</span>
                </h5>
                <MessageBar type={MessageBarType.INFO} message={"Please wait while loading..."} />
            </>
        }
        {
            ajaxData.error &&
            <>
                <h5 className="flex align-items-center mb-2">
                    <ArrowLeftIcon size={16} className="me-2 cursor-pointer" onClick={() => navigate("/jobs")} />
                    <ClockIcon size={16} className="text-blue-800 me-2" />
                    <span>Repetitive Job</span>
                </h5>
                <MessageBar type={MessageBarType.ERROR} message={"Unable to load item"} />
            </>
        }
        { 
            ajaxData.item &&
            <>
                <h5 className="flex align-items-center mb-3">
                    <ArrowLeftIcon size={16} className="me-2 cursor-pointer" onClick={() => navigate("/jobs")} />
                    <ClockIcon size={16} className="text-blue-800 me-2" />
                    {
                        !editTitle &&
                        <span>{ajaxData.item.name}</span>
                    }
                    {
                        editTitle &&
                        <input type="text" ref={titleRef} className="form-control form-control-sm w-25" defaultValue={ajaxData.item.name} />
                    }
                    <button className="btn btn-sm bg-grey-200 p-2 ms-2 border-0" onClick={() => {
                        setEditTitle(prev => {
                            const newValue = !prev;
                            if( !newValue ) {
                                updateTitle();
                            }
                            return newValue;
                        });
                    }}>
                        {
                            !editTitle &&
                            <EditIcon size={18} />
                        }
                        {
                            editTitle &&
                            <CheckIcon size={18} className="text-success"/>
                        }
                    </button>
                </h5>
                <div className="command-bar">
                    <CommandBarButton label="Refresh" icon={<RefreshIcon />} onClick={refresh} />
                </div>
                <table className="table w-100 border-1 border border-grey-100">
                    <tbody>
                        <tr>
                            <th className="bg-grey-200 w-25 ps-2 pe-2 pt-1 pb-1 border-1 border-bottom border-white">
                                Job Name
                            </th>
                            <td className=" ps-5 pe-2 pt-1 pb-1 border-1 border-bottom border-grey-100">
                                {ajaxData.item.name}
                            </td>
                        </tr>
                        <tr>
                            <th className="bg-grey-200 w-25 ps-2 pe-2 pt-1 pb-1 border-1 border-bottom border-white">
                                Data Source
                            </th>
                            <td className=" ps-5 pe-2 pt-1 pb-1 border-1 border-bottom border-grey-100">
                                {ajaxData.item.source.name}
                            </td>
                        </tr>
                        <tr>
                            <th className="bg-grey-200 w-25 ps-2 pe-2 pt-1 pb-1 border-1 border-bottom border-white">
                                Data Source Type
                            </th>
                            <td className=" ps-5 pe-2 pt-1 pb-1 border-1 border-bottom border-grey-100">
                                {ajaxData.item.source.type?.typeName}
                            </td>
                        </tr>
                        <tr>
                            <th className="bg-grey-200 w-25 ps-2 pe-2 pt-1 pb-1 border-1 border-bottom border-white">
                                Last Execution
                            </th>
                            <td className=" ps-5 pe-2 pt-1 pb-1 border-1 border-bottom border-grey-100">
                                {moment(ajaxData.item.lastExec).fromNow()} ({moment(ajaxData.item.lastExec).format("YYYY-MM-DD HH:mm")})
                            </td>
                        </tr>
                        <tr>
                            <th className="bg-grey-200 w-25 ps-2 pe-2 pt-1 pb-1">
                                Repeat
                            </th>
                            <td className=" ps-5 pe-2 pt-1 pb-1">
                                {ajaxData.item.repeat ? "every " + ajaxData.item.repeatValue + " " + ajaxData.item.repeatType : "never"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        }
    </Page>
}