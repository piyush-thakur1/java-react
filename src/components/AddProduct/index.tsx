import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import styles from "./index.module.css";
import { productSchema } from "../../utils/yup";
import { toast } from "sonner";

interface ProductFormData {
  pname: string;
  subscription: string;
  price: number;
}

const AddProduct: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(!!id);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      pname: "",
      subscription: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}getProductS1/${id}`
      );
      const { pname, subscription, price } = response.data;
      setValue("pname", pname);
      setValue("subscription", subscription);
      setValue("price", price);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product data");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}updateProdS1/${id}`,
          data
        );
        toast.success("Product updated successfully!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}setProdS1`, data);
        toast.success("Product added successfully!");
      }
      reset();
      navigate("/");
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate("/")}
              aria-label="Go back"
            >
              <FaArrowLeft />
            </button>
            <h2>{id ? "Edit Product" : "Add New Product"}</h2>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p>Loading product data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="pname">Product Name</label>
              <input
                type="text"
                id="pname"
                placeholder="Enter product name"
                {...register("pname")}
              />
              {errors.pname && (
                <p className={styles.error}>{errors.pname.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="subscription">Subscription</label>
              <input
                type="text"
                id="subscription"
                placeholder="Enter subscription type"
                {...register("subscription")}
              />
              {errors.subscription && (
                <p className={styles.error}>{errors.subscription.message}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                placeholder="0.00"
                step="0.01"
                {...register("price")}
              />
              {errors.price && (
                <p className={styles.error}>{errors.price.message}</p>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                <FaSave className={styles.buttonIcon} />
                {isSubmitting
                  ? id
                    ? "Updating..."
                    : "Adding..."
                  : id
                  ? "Update Product"
                  : "Add Product"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
