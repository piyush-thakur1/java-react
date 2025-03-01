import styles from "./index.module.css";

interface Props {
    onDelete: () => void;
    onCancel: () => void;
}

const DeleteConfirmModel = ({ onDelete, onCancel }: Props) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3>Are you sure you want to delete this product?</h3>
                <div className={styles.modalActions}>
                    <button onClick={onDelete} className={styles.confirmButton}>
                        Yes, Delete
                    </button>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModel;
