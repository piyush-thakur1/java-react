import * as yup from "yup";

export const productSchema = yup.object({
  pname: yup.string().required("Product name is required"), 
  subscription: yup.string().required("Subscription type is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
});