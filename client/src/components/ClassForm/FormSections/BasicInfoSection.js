import React from 'react';
import { Form } from 'react-bootstrap';
import { CLASS_CATEGORIES } from '../../../constants/ClassCategories';

const BasicInfoSection = ({ formik }) => {
  const classCategories = CLASS_CATEGORIES.map((category) => {
    return <option key={category}>{category}</option>;
  });
  return (
    <>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          placeholder="Title"
          name="title"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          className={formik.touched.title && formik.errors.title ? 'form-error' : null}
        />
        {formik.touched.title && formik.errors.title ? (
          <div className="form-error-message">{formik.errors.title}</div>
        ) : null}
      </Form.Group>
      <Form.Group controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.category}
          className={formik.touched.category && formik.errors.category ? 'form-error' : null}
        >
          {classCategories}
        </Form.Control>
        {formik.touched.category && formik.errors.category ? (
          <div className="form-error-message">{formik.errors.category}</div>
        ) : null}
      </Form.Group>
      <Form.Group controlId="description">
        <Form.Label>Class Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          className={formik.touched.description && formik.errors.description ? 'form-error' : null}
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="form-error-message">{formik.errors.description}</div>
        ) : null}
      </Form.Group>
    </>
  );
};

export default BasicInfoSection;
