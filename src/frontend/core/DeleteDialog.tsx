export const DeleteDialog = (props: {onDelete: () => void}) => {
    return <div className={`modal fade`} id="deleteDialog" tabIndex={1} aria-labelledby="deleteDialogLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h6 id="deleteDialogLabel" className="fs-8">Delete Items</h6>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    Do you realy want to delete the selected items?
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={props.onDelete}>Delete</button>
                </div>
            </div>
        </div>
    </div>
}