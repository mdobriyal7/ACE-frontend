import axios from "axios";

const instance = axios.create({
  baseURL: "https://ace-product-backendat.onrender.com/product",
});

export const fetchProducts = () => {
  return instance
    .get("/")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export const postProduct = (product) => {
  return instance
    .post("/", product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export const updateProduct = (product) => {
  const { id, ...productData } = product;
  return instance
    .patch(`/${id}`, productData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export const deleteProduct = (productId) => {
  return instance
    .delete(`/${productId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};
