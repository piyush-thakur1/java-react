import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styles from "./index.module.css";
import DeleteConfirmModel from "../DeleteConfirmModel";

interface Product {
  pid: number;
  pname: string;
  subscription: string;
  price: number;
}

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModel, setShowDeleteModel] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>(
        `${import.meta.env.VITE_API_URL}getProductS1`
      );
      setProducts(response.data);
    } catch (error) {
      toast.error("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pid: number) => {
    navigate(`/edit-product/${pid}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}deleteProdS1/${deleteId}`
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.pid !== deleteId)
      );
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Error deleting product.");
    } finally {
      setShowDeleteModel(false);
      setDeleteId(null);
    }
  };

  const handleDeleteConfirmation = (id: number) => {
    setDeleteId(id);
    setShowDeleteModel(true);
  };

  const handleCancel = () => {
    setShowDeleteModel(false);
    setDeleteId(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const selectedProduct = products.find((p) => p.pid === deleteId);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Product Management</h2>
          <button
            onClick={() => navigate("/create-product")}
            className={styles.addButton}
          >
            <FaPlus className={styles.buttonIcon} />
            <span>Add Product</span>
          </button>
        </div>

        {loading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Subscription</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product.pid} className={styles.tableRow}>
                      <td>{index + 1}</td>
                      <td className={styles.productName}>{product.pname}</td>
                      <td>
                        <span className={styles.subscriptionBadge}>
                          {product.subscription}
                        </span>
                      </td>
                      <td className={styles.price}>
                        {formatPrice(product.price)}
                      </td>
                      <td className={styles.actions}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEdit(product.pid)}
                        >
                          <FaEdit className={styles.editIcon} />
                          <span>Edit</span>
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteConfirmation(product.pid)}
                        >
                          <FaTrash className={styles.deleteIcon} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={styles.noData}>
                      <div className={styles.emptyState}>
                        <p>No products found</p>
                        <button
                          onClick={() => navigate("/create-product")}
                          className={styles.emptyStateButton}
                        >
                          Add your first product
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showDeleteModel && (
          <DeleteConfirmModel
            onCancel={handleCancel}
            onDelete={handleDelete}
            productName={selectedProduct?.pname}
          />
        )}
      </div>
    </div>
  );
};

export default ProductTable;
