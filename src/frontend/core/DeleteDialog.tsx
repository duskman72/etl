import { Dialog } from "./Dialog"

export const DeleteDialog = (props: {onDelete: () => void}) => {
    return <Dialog id="deleteDialog" title="Delete Item(s)" buttons={[
        {
            className: "btn-danger",
            onClick: props.onDelete,
            children: "Delete"
        }
    ]}>
        Do you realy want to delete the selected items?
    </Dialog>
}