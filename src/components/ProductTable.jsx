import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button } from "react-bootstrap";
import { deleteSingleProduct, getProducts } from "../redux/productSlice";
import { toast } from "react-toastify";
import ProductForm from "./ProductForm";
import "./ProductTable.css";

const ProductTable = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    console.log(id);
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteSingleProduct(id))
        .then(() => {
          toast.info("Product Deleted!", {
            autoClose: 1500,
          });
          dispatch(getProducts());
          console.log("Product deleted successfully");
        })
        .catch((error) => {
          console.log("Failed to delete product:", error);
        });
    }
  };

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-baseline mt-3 mb-4">
        <div>
          <h1 className="shop_title">MY SHOP PRODUCTS</h1>
        </div>
        <ProductForm />
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>VAT(%)</th>
            <th>Total Stock</th>
            <th>Price per Qty (net)</th>
            <th>Price per Qty (Gross)</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.vat}</td>
                <td>{product.totalStock}</td>
                <td>{product.priceNet}</td>
                <td>{product.priceGross}</td>
                <td>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ maxWidth: "100px" }}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td><div className="d-flex justify-content-around">
                  <Button
                    style={{ backgroundColor: "#26e49e", border: "none" }}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    style={{ backgroundColor: "#26e49e", border: "none" }}
                  >
                    Edit
                  </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default ProductTable;
