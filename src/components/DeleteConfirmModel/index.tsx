import styles from "./index.module.css";
import { FaExclamationTriangle } from "react-icons/fa";

interface Props {
  onDelete: () => void;
  onCancel: () => void;
  productName?: string;
}

const DeleteConfirmModel = ({ onDelete, onCancel, productName }: Props) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalIcon}>
          <FaExclamationTriangle />
        </div>
        <h3>Delete Confirmation</h3>
        <p className={styles.modalMessage}>
          {productName
            ? `Are you sure you want to delete "${productName}"?`
            : "Are you sure you want to delete this product?"}
        </p>
        <p className={styles.modalWarning}>This action cannot be undone.</p>
        <div className={styles.modalActions}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={onDelete} className={styles.confirmButton}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModel;
