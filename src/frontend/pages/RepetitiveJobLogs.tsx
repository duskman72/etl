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
        items: null
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

        fetch("/api/jobs/" + id + "/logs", {
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

    return <Page>
        <input type="hidden" defaultValue={intervalValue} />
        {
            ajaxData.loading &&
            <>
                <h5 className="flex align-items-center mb-2">
                    <ArrowLeftIcon size={16} className="me-2 cursor-pointer" onClick={() => navigate("/jobs")} />
                    <ClockIcon size={16} className="text-blue-800 me-2" />
                    <span>Repetitive Job Logs</span>
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
                    <span>Repetitive Job Logs</span>
                </h5>
                <MessageBar type={MessageBarType.ERROR} message={"Unable to load items"} />
            </>
        }
        { 
            ajaxData.items &&
            <>
                <h5 className="flex align-items-center mb-3">
                    <ArrowLeftIcon size={16} className="me-2 cursor-pointer" onClick={() => navigate("/jobs")} />
                    <ClockIcon size={16} className="text-blue-800 me-2" />
                    <span>Repetitive Job Logs</span>
                </h5>
                <div className="command-bar">
                    <CommandBarButton label="Refresh" icon={<RefreshIcon />} onClick={refresh} />
                </div>
                
            </>
        }
    </Page>
}