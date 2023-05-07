import axios from "axios";
import ProductTable from "./components/ProductTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.baseURL = "https://ace-product-backendat.onrender.com";

function App() {
  return (
    <>
      <div className="container">
        <ToastContainer />
        <ProductTable />
      </div>
    </>
  );
}

export default App;
