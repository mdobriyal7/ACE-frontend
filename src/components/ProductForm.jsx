import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Modal, Form, Button, Container } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { MdAddCircle } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { addNewProduct, getProducts } from "../redux/productSlice";
import { toast } from "react-toastify";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "./ProductForm.css";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function ProductForm() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  //   const [FileError, setFileError] = useState("");
  const [imageFormatError, setImageFormatError] = useState("");
  console.log(imageFormatError);
  const [productForm, setProductForm] = useState({
    name: "",
    vat: 10,
    priceGross: 0,
    priceNet: 0,
    totalStock: 0,
  });
  console.log(productForm);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length !== 1) {
      alert("Only drop one file at a time");
      return;
    }
    const file = acceptedFiles[0];
    setFile(file);
    setFileName(file.name);
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop: onDrop, noClick: true });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleFileUpload = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      console.log("Please select your file");
    }
  };

  useEffect(() => {
    if (file) {
      console.log("file::: ", file);
      console.log("fileName::: ", fileName);
    }
  }, [file, fileName]);

  const handleProductFormChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isImageValid = validateImageFormat();
    if (!isImageValid) {
      window.alert(`Image Error:: ${imageFormatError}`);
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", productForm.name);
    formData.append("priceGross", productForm.priceGross);
    formData.append("vat", productForm.vat);
    formData.append("priceNet", productForm.priceNet);
    formData.append("totalStock", productForm.totalStock);

    dispatch(addNewProduct(formData)).then(() => {
      handleClose();
      toast.info("New Product Added!", {
        autoClose: 1500,
      });
      dispatch(getProducts());
    });

    setProductForm({
      name: "",
      priceGross: 0,
      vat: 10,
      priceNet: 0,
      totalStock: 0,
    });
    setFile(null);
    setFileName("");
  };

  const { vat, priceGross } = productForm;

  const handlePriceCalculation = useCallback(() => {
    const vatValue = parseFloat(vat);
    const grossPrice = parseFloat(priceGross);
    const netPrice = grossPrice * (1 - vatValue / 100);
    setProductForm((prevForm) => ({
      ...prevForm,
      priceNet: netPrice.toFixed(2),
    }));
  }, [vat, priceGross]);

  useEffect(() => {
    handlePriceCalculation();
  }, [handlePriceCalculation]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add New product
    </Tooltip>
  );

  const validateImageFormat = () => {
    if (file === null) {
      console.log("executing")
      toast.info("Please select a Image.", {
        autoClose: 1500,
      });
      return
    }
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      setImageFormatError("Only JPG and PNG formats are allowed.");
      return false;
    }
    setImageFormatError("");
    return true;
  };

  return (
    <>
      <div onClick={handleShow}>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 50, hide: 400 }}
          overlay={renderTooltip}
        >
          <h3 className="my-0 btn_color">
            Add <MdAddCircle size={40} style={{ color: "#a975f2" }} />
          </h3>
        </OverlayTrigger>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        style={{ overflowY: "auto" }}
      >
        <div id="root">
          <Container fluid className="dropzone_header"></Container>
          <section className="innersection_dropAndUpload">
            <Modal.Header closeButton style={{ width: "100%", padding: "0" }}>
              <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>
            <Form
              className="ml-6"
              onSubmit={handleSubmit}
              style={{ width: "100%" }}
            >
              <Form.Group controlId="name" className="d-flex my-3 ">
                <Form.Label className="col-4">Product Name</Form.Label>
                <div className="col-8">
                  <Form.Control
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleProductFormChange}
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group
                controlId="vat"
                className="d-flex align-items-center my-3"
              >
                <Form.Label className="col-4">VAT</Form.Label>
                <div className="col-8">
                  <Form.Select
                    aria-label="Default select example"
                    name="vat"
                    onChange={handleProductFormChange}
                    required
                    defaultValue={productForm.vat}
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                  </Form.Select>
                </div>
              </Form.Group>

              <Form.Group
                controlId="totalStock"
                className="d-flex align-items-center my-3"
              >
                <Form.Label className="col-4">Quantity</Form.Label>
                <div className="col-8">
                  <Form.Control
                    type="number"
                    name="totalStock"
                    value={productForm.totalStock}
                    onChange={handleProductFormChange}
                    min="0"
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group
                controlId="number"
                className="d-flex align-items-center my-3"
              >
                <Form.Label className="col-4">Price(net)</Form.Label>
                <div className="col-8">
                  <Form.Control
                    type="number"
                    name="priceNet"
                    value={productForm.priceNet}
                    onChange={handleProductFormChange}
                    readOnly
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group
                controlId="priceGross"
                className="d-flex align-items-center my-3"
              >
                <Form.Label className="col-4">Price(Gross)</Form.Label>
                <div className="col-8">
                  <Form.Control
                    type="number"
                    name="priceGross"
                    value={productForm.priceGross}
                    onChange={handleProductFormChange}
                    min="1"
                    required
                  />
                </div>
              </Form.Group>
              <div className="d-flex align-items-baseline">
                <div className="col-4">
                  <p>Image</p>
                </div>

                <div className="col-8 d-flex flex-column align-items-center">
                  <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <h2 style={{ fontWeight: 600 }}>Drop Product Image here</h2>
                    <p className="pdf-size-msg mb-4">
                      Format: Image(jpg/png) - Max. size: 50 M.B
                    </p>
                    <p style={{ color: "red" }}>
                      {fileName ? `FILE : ${fileName}` : ""}
                    </p>
                  </div>

                  <div className="my-2">
                    <b>OR</b>
                  </div>
                  <div>
                    <label htmlFor="file-upload" className="custom-file-upload">
                      <IoMdAdd style={{ fontSize: "24px" }} />
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileUpload}
                    />
                  </div>
                  <p className="upload-manually">Upload Manually</p>
                  {/* {FileError && <div className="error-msg">{FileError}</div>} */}
                </div>
              </div>
              <Button
                variant="warning"
                type="submit"
                className="d-block mx-auto"
              >
                Submit Details
              </Button>
            </Form>
          </section>
        </div>
      </Modal>
    </>
  );
}

export default ProductForm;
