import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
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
    const fetchProducts = async () => {
      try {
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
    fetchProducts();
  }, []);

  const handleEdit = (pid: number) => {
    navigate(`/edit-product/${pid}`);
  };

  const handleDelete = async () => {
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

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Product List</h2>
          <div className={styles.buttonContainer}>
          <button
            onClick={() => navigate("/create-product")}
            className={styles.addButton}
          >
            Add Product
          </button>
            </div>
        
        </div>

        {loading ? (
          <div className={styles.loader}>Loading...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Product Name</th>
                <th>Subscription</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product.pid}>
                    <td>{index + 1}</td>
                    <td>{product.pname}</td>
                    <td>{product.subscription}</td>
                    <td>{product.price}</td>
                    <td className={styles.actions}>
                      <FaEdit
                        className={styles.icon}
                        onClick={() => handleEdit(product.pid)}
                      />
                      <FaTrash
                        className={styles.icon}
                        onClick={() => handleDeleteConfirmation(product.pid)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.noData}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {showDeleteModel && (
          <DeleteConfirmModel onCancel={handleCancel} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default ProductTable;
