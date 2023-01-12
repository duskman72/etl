import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApplicationContext } from "../contexts/ApplicationContext";
import { ArrowLeftIcon, CommandBarButton, DataTable, EditIcon, ListIcon, MessageBar, MessageBarType, Page, RefreshIcon } from "../core"

export default () => {
    const {id} = useParams();
    const [ajaxData, setAjaxData] = useState({
        loading: false,
        loaded: false,
        error: null,
        items: null,
        currentPage: 0,
        pages: 0,
        total: 0
    });

    const navigate = useNavigate();
    const ctx = useContext(ApplicationContext);

    const fetchPage = (page) => {

        fetch("/api/jobs/" + id + "/logs?page=" + page, {
            headers: {
                "X-Requested-With": "XmlHttpRequest"
            }
        })
        .then(async response => {
            if (!response.ok) {
                throw new Error();
            }
            return await response.json()
        })
        .then((data) => {
            const sorted: any = data.items;
            sorted.sort((a: any, b: any) => {
                return moment(b.time).toDate().getTime() - moment(a.time).toDate().getTime();
            })

            setAjaxData(prev => {
                return {
                    ...prev,
                    loaded: true,
                    loading: false,
                    items: sorted,
                    error: null,
                    currentPage: data._meta.currentPage,
                    pages: data._meta.pages,
                    total: data._meta.total
                }
            });
        })
        .catch(() => {
            setAjaxData(prev => {
                return {
                    ...prev,
                    loaded: true,
                    loading: false,
                    items: [],
                    currentPage: 0,
                    pages: 0,
                    total: 0,
                    error: "Unable to load item " + id
                }
            });
        });
    }

    const refresh = () => {
        setAjaxData(prev => {
            return {
                ...prev,
                loaded: false,
                loading: true,
                error: false,
                items: [],
                currentPage: 1,
                pages: 0,
                total: 0
            }
        });

        fetchPage(1);
    }

    useEffect(() => {
        if( !ajaxData.loaded ) {
            refresh();
        }

        ctx.setContext("Job Logs");
        ctx.setSearchBar(true);

    }, []);

    return <Page>
        <h5 className="flex align-items-center mb-3">
            <ArrowLeftIcon size={16} className="me-2 cursor-pointer" onClick={() => navigate(`/jobs/${id}`)} />
            <ListIcon size={16} className="text-blue-800 me-2" />
            <span>Repetitive Job Logs</span>
        </h5>
        {
            ajaxData.loading &&
            <MessageBar type={MessageBarType.INFO} message={"Please wait while loading..."} />
        }
        {
            ajaxData.error &&
            <MessageBar type={MessageBarType.ERROR} message={"Unable to load items"} />
        }
        { 
            ajaxData.items?.length > 0 &&
            <>
                <div className="command-bar">
                    <CommandBarButton label="Refresh" icon={<RefreshIcon />} onClick={refresh} />
                </div>

                <DataTable 
                    headers={[
                        {
                            content: "Date",
                            className: "col-2"
                        },
                        {
                            content: "Message",
                            className: "col"
                        }
                    ]}

                    items={
                        ajaxData.items.map( item => {
                            return {
                                selected: false,
                                columns: [
                                    {
                                        content: moment(item.time).format("YYYY-MM-DD HH:mm"),
                                        className: "col-2"
                                    },
                                    {
                                        content: item.message,
                                        className: "col"
                                    }
                                ]
                            }
                        })
                    }
                />
                {
                    ajaxData.total > 1 &&
                    <nav className="mt-3">
                        <ul className="pagination pagination-sm justify-content-start">
                            {
                                ajaxData.currentPage > 1 &&
                                <li className="page-item" onClick={() => fetchPage(ajaxData.currentPage - 1)}>
                                    <span className="page-link cursor-pointer" aria-disabled="true">Previous</span>
                                </li>
                            }
                            {
                                Array(ajaxData.total).fill(1).map((e, i) => {
                                    return <li onClick={() => {
                                        if (ajaxData.currentPage === i + 1 ) return;

                                        fetchPage(i+1);
                                    }} className={`page-item cursor-pointer ${ajaxData.currentPage === i + 1 ? "active" : ""}`}><span className="page-link">{i + 1}</span></li>
                                })
                            }
                            {
                                ajaxData.currentPage < ajaxData.total &&
                                    <li className="page-item" onClick={() => fetchPage(ajaxData.currentPage + 1)}>
                                        <span className="page-link cursor-pointer" aria-disabled="true">Next</span>
                                    </li>
                            }
                        </ul>
                    </nav>
                }
            </>
        }
    </Page>
}