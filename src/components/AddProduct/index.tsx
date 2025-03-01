import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
  });


  useEffect(() => {
    if (id) {
      axios
        .get(`${import.meta.env.VITE_API_URL}getProductS1/${id}`)
        .then((response) => {
          const { pname, subscription, price } = response.data;
          setValue("pname", pname);
          setValue("subscription", subscription);
          setValue("price", price);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          alert("Failed to load product data.");
        });
    }
  }, [id, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (id) {
        await axios.put(`${import.meta.env.VITE_API_URL}updateProdS1/${id}`, data);
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
    <div className={styles.container}>
      <h2>{id ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Product Name</label>
          <input type="text" {...register("pname")} />
          {errors.pname && <p className={styles.error}>{errors.pname.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label>Subscription</label>
          <input type="text" {...register("subscription")} />
          {errors.subscription && (
            <p className={styles.error}>{errors.subscription.message}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>Price ($)</label>
          <input type="number" {...register("price")} />
          {errors.price && <p className={styles.error}>{errors.price.message}</p>}
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? (id ? "Updating..." : "Adding...") : id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

