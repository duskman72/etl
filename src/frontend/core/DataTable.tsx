import { v4 as uuid } from "uuid";

export type DataTableColumn = {
    content: any,
    className?: string
}

export type DataTableRecord = {
    selected?: boolean,
    columns: Array<DataTableColumn>
}

export type DataTableProps = {
    headers: Array<DataTableColumn>,
    items: Array<DataTableRecord>
}

export const DataTable = (props: DataTableProps) => {
    return <div className="data-table">
        <div className="row header-row">
            {
                props.headers.map( header => {
                    return <div key={uuid()} className={`table-column table-header ${header.className}`}>
                        {header.content}
                    </div>
                })
            }
        </div>
        {
            props.items.map( item => {
                return <div key={uuid()} className={`row ${item.selected ? "selected": ""}`}>
                    {
                        item.columns.map( column => {
                            return <div key={uuid()} className={`table-column ${column.className}`}>
                                {column.content}
                            </div>
                        })
                    }
                </div>
            })
        }
    </div>
}