import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProducts, deleteProduct, postProduct } from "../services/Api";

export const getProducts = createAsyncThunk("products/get", fetchProducts);
export const addNewProduct = createAsyncThunk(
  "products/posts",
  async (product) => {
    await postProduct(product);
    return product;
  }
);
export const deleteSingleProduct = createAsyncThunk(
  "products/delete",
  async (id) => {
    await deleteProduct(id);
    return id;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
  },
  extraReducers: {
    [getProducts.pending]: (state) => {
      state.status = "loading";
      state.error = null;
    },
    [getProducts.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.products = action.payload;
    },
    [getProducts.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const { addProduct } = productSlice.actions;

export default productSlice.reducer;
