import { Button, Col, Container, Row } from 'react-bootstrap';
import { Checkbox, Image, Select } from 'antd';
import * as yup from 'yup';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import { toast } from 'react-toastify';
import CustomInput from '../../components/CustomInput';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
// import ReactQuill from "react-quill";
// import EditorToolbar, { modules, formats } from "../components/EditorToolbar";
// import "react-quill/dist/quill.snow.css";
import axios from 'axios';
import MySunEditor from '../components/SunEditor';

const productSchema = yup.object({
  name: yup
    .string()
    .required('This field is required'),
  price: yup.number()
    .typeError('Must be a number')
    .required('This field is required')
    .positive('Must be a positive value'),
  originalPrice: yup.number()
    .typeError('Must be a number')
    .required('This field is required')
    .positive('Must be a positive value'),
  year: yup.number()
    .typeError('Must be a number')
    .required('This field is required')
    .positive('Must be a positive value')
    .integer()
    .min(1900),
  categoryId: yup.number()
    .typeError('Must be a number')
    .required('This field is required')
    .positive('Must be a positive value')
    .integer('Must be an integer'),
  brand: yup.number()
    .typeError('Must be a number')
    .required('This field is required')
    .positive('Must be a positive value')
    .integer('Must be an integer'),
  describe: yup.string().required('This field is required'),
  detail: yup.string().required('This field is required'),
  product: yup.array().of(
    yup.object().shape({
      color: yup.string().required('This field is required'),
      image: yup.mixed()
        .required('File is required')
        .test('fileType', 'Unsupported file type', (value) => {
          if (!value) return true;
          const supportedTypes = ['image/jpeg', 'image/png', 'image/gif'];
          return supportedTypes.includes(value.type);
        })
    })
  ).required("Must provide color and image")
});

const initialValues = {
  name: '',
  price: '',
  originalPrice: '',
  categoryId: '',
  brand: '',
  year: '',
  featured: false,
  status: true,
  detail: '',
  describe: '',
  product: [
    {
      color: '',
      image: '',
    },
  ],
};

const AddProduct = () => {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues,
        validationSchema: productSchema,
        onSubmit: async (values) => {
          setIsLoading(true);
          const product = await uploadImage(values.product)
          saveProduct(values, product)
          setIsLoading(false);
        },
    });

    useEffect(() => {
      fetch(`http://localhost:9999/brands`)
          .then((res) => res.json())
          .then((json) => {
            const br = []
            json.map(j => br.push({ value: j.id, label: j.name }))
            setBrands(br)
          });
    }, []);
  
    useEffect(() => {
      fetch(`http://localhost:9999/categories`)
          .then((res) => res.json())
          .then((json) => {
            const cate = []
            json.map(j => cate.push({ value: j.id, label: j.name }))
            setCategories(cate)
          });
    }, []);

    const uploadImage = async (product) => {
      const images = []
      const color = []
      try {
        for (const productItem of product) {
          color.push(productItem.color);
    
          const formData = new FormData();
          formData.append('file', productItem.image);
          formData.append('upload_preset', 'gaxpeofu');
          formData.append('api_key', '337676999889211');
    
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/dck2nnfja/upload`,
            formData
          );
    
          console.log('Upload successful:', response.data);
          images.push(response.data.url);
        }

        return {
          images,
          color
        }
      } catch (error) {
        console.log(error)
        toast.error("Failed to upload image: " + error.message)
      }
    }

    const removeProduct = (index) => {
      const valuesCopy = { ...formik.values };
      const errorsCopy = { ...formik.errors };
  
      valuesCopy.product.splice(index, 1);
      formik.setValues(valuesCopy);

      if (!JSON.stringify(errorsCopy) === '{}') {
        errorsCopy.product.splice(index, 1);
        formik.setErrors(errorsCopy);
      }
    };

    const saveProduct = (values, product) => {
      const { name, price, originalPrice, categoryId, brand, featured, status, detail, describe, year } = values
      const { color, images } = product

      fetch(`http://localhost:9999/products`, {
          method: 'POST',
          body: JSON.stringify({
            name,
            price: Number(price),
            originalPrice: Number(originalPrice),
            categoryId,
            brand,
            year: Number(year),
            featured,
            status,
            detail,
            describe,
            color,
            images,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      )
      .then(() => {
        toast.success('Create product successfully');
        navigate('/admin/product')
      })
      .catch(() => toast.error('Something went wrong!'))
    }

    return (
        <Container>
            {isLoading && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
            >
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <Row>
              <Col>
              <h3 className='mt-3'>Create new product</h3>
              <Formik
                initialValues={initialValues}
                onSubmit={formik.handleSubmit}
              >
                {({values}) => (
                  <Form>
                    <Row>
                      <Col xs={12} lg={6} className='my-3'>
                        <label>Product name</label>
                        <CustomInput
                            type="text"
                            name="name"
                            placeholder="Product name..."
                            onChange={formik.handleChange('name')}
                            onBlur={formik.handleBlur('name')}
                            value={formik.values?.name}
                            errMes={formik.touched.name && formik.errors.name}
                        />
                      </Col>
                      <Col xs={12} lg={3} className='my-3'>
                        <label>Price</label>
                        <CustomInput
                            type="text"
                            name="price"
                            placeholder="Price..."
                            onChange={formik.handleChange('price')}
                            onBlur={formik.handleBlur('price')}
                            value={formik.values?.price}
                            errMes={
                              formik.touched.price &&
                              formik.errors.price
                            }
                        />
                      </Col>
                      <Col xs={12} lg={3} className='my-3'>
                        <label>Original price</label>
                        <CustomInput
                            type="text"
                            name="originalPrice"
                            placeholder="Original price..."
                            onChange={formik.handleChange('originalPrice')}
                            onBlur={formik.handleBlur('originalPrice')}
                            value={formik.values?.originalPrice}
                            errMes={
                              formik.touched.originalPrice &&
                              formik.errors.originalPrice
                            }
                        />
                      </Col>
                      <Col xs={12} lg={6}>
                        <label>Category</label>
                        <Select
                          showSearch
                          size='large'
                          placeholder="Select a category"
                          className='w-100'
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={categories}
                          name="categoryId"
                          onChange={(value) => formik.setFieldValue('categoryId', Number(value))}
                          onBlur={formik.handleBlur('categoryId')}
                          value={formik.values?.categoryId}
                        />
                        {formik.touched.categoryId && <span className='text-danger'>{formik.errors.categoryId}</span>}
                      </Col>
                      <Col xs={12} lg={6} >
                        <label>Brand</label>
                        <Select
                          showSearch
                          size='large'
                          placeholder="Select a brand"
                          className='w-100'
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={brands}
                          name="brand"
                          onChange={(value) => formik.setFieldValue('brand', Number(value))}
                          onBlur={formik.handleBlur('brand')}
                          value={formik.values?.brand}
                        />
                        {formik.touched.brand && <span className='text-danger'>{formik.errors.brand}</span>}
                      </Col>
                      <Col xs={12} className='mt-3'>
                        <FieldArray name="product">
                          {({ insert, remove, push }) => (
                            <>
                              { values.product.length > 0 &&
                                values.product.map((product, index) => (
                                  <Row key={index} className='mb-3'>
                                    <Col xs={12} lg={6}>
                                      <label>Color</label>
                                      <CustomInput
                                          type="text"
                                          name={`product.${index}.color`}
                                          placeholder="Color..."
                                          onChange={formik.handleChange(`product.${index}.color`)}
                                          onBlur={formik.handleBlur(`product.${index}.color`)}
                                          value={formik.values?.product?.[index]?.color}
                                          errMes={
                                            formik.touched.product?.[index]?.color &&
                                            formik.errors.product?.[index]?.color
                                          }
                                      />
                                    </Col>
                                    <Col xs={10} lg={4}>
                                      <label>Image</label>
                                      <div> 
                                        <Field
                                          type="file"
                                          id={`product.${index}.image`}
                                          name={`product.${index}.image`}
                                          accept="image/jpeg, image/png, image/gif"
                                          onChange={(event) => {
                                            formik.setFieldValue(`product.${index}.image`, event.currentTarget.files[0]);
                                          }}
                                        />
                                        {formik.touched.product?.[index]?.image && (
                                          <span className="text-danger d-block">{formik.errors.product?.[index]?.image}</span>
                                        )}
                                      </div>

                                      {/* Image Preview */}
                                      {formik.values.product[index]?.image && (
                                        <div className='mt-2'>
                                          <img
                                            src={URL.createObjectURL(formik.values.product[index]?.image)}
                                            alt={`Preview ${product.color}`}
                                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                          />
                                        </div>
                                      )}
                                    </Col>
                                    <Col xs={2} style={{alignSelf: "center"}}>
                                      <Button
                                        type="button"
                                        className="secondary mx-3"
                                        onClick={() => push({ color: '', image: '' })}
                                      >
                                        +
                                      </Button>
                                      <Button
                                        type="button"
                                        className={index == 0 ? "secondary disabled" : "secondary"}
                                        onClick={() => {
                                          removeProduct(index)
                                          remove(index)
                                        }}
                                      >
                                        X
                                      </Button>
                                    </Col>
                                  </Row>
                                ))
                              }
                            </>
                        )}
                        </FieldArray>
                      </Col>
                      <Col xs={12} lg={6} className='my-3'>
                        <label>Year</label>
                        <CustomInput
                            type="text"
                            name="year"
                            placeholder="Year"
                            onChange={formik.handleChange('year')}
                            onBlur={formik.handleBlur('year')}
                            value={formik.values?.year}
                            errMes={
                              formik.touched.year &&
                              formik.errors.year
                            }
                        />
                      </Col>
                      <Col xs={6} lg={3} className='my-3'>
                        <label className='d-block'>Status</label>
                        <Checkbox 
                          name='status'
                          onChange={(event) => formik.setFieldValue('status', event.target.checked)}
                          checked={formik.values.status}
                        >
                          Is active?
                        </Checkbox>
                      </Col>
                      <Col xs={6} lg={3} className='my-3'>
                        <label className='d-block'>Featured</label>
                        <Checkbox 
                          name='featured'
                          onChange={(event) => formik.setFieldValue('featured', event.target.checked)}
                          checked={formik.values.featured}
                        >
                          Is featured?
                        </Checkbox>
                      </Col>
                      <Col xs={12} className='my-3'>
                        <label>Product configuration</label>
                        <MySunEditor  
                          id='editor1'
                          name='detail'
                          onInit
                          onChange={(content) => {
                            formik.setFieldValue('detail', content); 
                            if (content == '<p><br></p>') {
                              formik.setFieldValue('detail', "")
                            }
                          }}
                          data={formik.values?.detail}
                        />
                        {formik.touched.detail && <span className='text-danger'>{formik.errors.detail}</span>}
                      </Col>
                      <Col xs={12} className='mb-3'>
                        <label>Product detailed description</label>
                        <MySunEditor  
                          id='editor2'
                          name='describe'
                          onChange={(content) => {
                            formik.setFieldValue('describe', content); 
                            if (content == '<p><br></p>') {
                              formik.setFieldValue('describe', "")
                            }
                          }}
                          data={formik.values?.describe}
                        />
                        {formik.touched.describe && <span className='text-danger'>{formik.errors.describe}</span>}
                        {/* <EditorToolbar toolbarId={'t1'}/> */}
                        {/* <ReactQuill
                          theme="snow"
                          className='bg-white'
                          onChange={(content) => {
                            formik.setFieldValue('detail', content); 
                            if (content == '<p><br></p>') {
                              formik.setFieldValue('detail', "")
                            }
                          }}
                          data={formik.values?.detail}
                          placeholder={"Write something awesome..."}
                          modules={modules('t1')}
                          formats={formats}
                        /> */}
                      </Col>
                      <Col xs={12} className='mb-3' style={{textAlign: "right"}}>
                        <Button className="btn-primary mx-2" type='submit'>Submit</Button>
                        <Button className="btn-danger"><Link className="text-white" to={'/admin/product'}>Back to list</Link></Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
              </Col>
          </Row>
        </Container>
    );
};

export default AddProduct;
