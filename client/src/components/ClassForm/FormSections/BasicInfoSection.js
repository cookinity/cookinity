import React from 'react';
import { Form } from 'react-bootstrap';
import { CLASS_CATEGORIES } from '../../../constants/ClassCategories';
import Tooltip from '../Tooltip.js';

const BasicInfoSection = ({ formik }) => {
  const classCategories = CLASS_CATEGORIES.map((category) => {
    return <option key={category}>{category}</option>;
  });
  return (
    <>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>{' '}
        <Tooltip content="Give your cooking class a clear and meaningful title" direction="right">
          <i className="fa fa-question" data-toggle="tooltip"></i>
        </Tooltip>
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
        <Form.Label>Category</Form.Label>{' '}
        <Tooltip
          content="Choose one category in which you think your potential guest would expect to find your class"
          direction="right"
        >
          <i className="fa fa-question" data-toggle="tooltip"></i>
        </Tooltip>
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
        <Form.Label>Class Description</Form.Label>{' '}
        <Tooltip
          content="Briefly describe your cooking class: What makes it special? What will your guest learn?"
          direction="right"
        >
          <i className="fa fa-question" data-toggle="tooltip"></i>
        </Tooltip>
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
      <Form.Group controlId="toBring">
        <Form.Label>Things Guests Need To Bring</Form.Label>{' '}
        <Tooltip
          content="What do you expect your guests to bring with them? Any special product or just a big appetite"
          direction="right"
        >
          <i className="fa fa-question" data-toggle="tooltip"></i>
        </Tooltip>
        <Form.Control
          as="textarea"
          rows={3}
          name="toBring"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.toBring}
          className={formik.touched.toBring && formik.errors.toBring ? 'form-error' : null}
        />
        {formik.touched.toBring && formik.errors.toBring ? (
          <div className="form-error-message">{formik.errors.description}</div>
        ) : null}
      </Form.Group>
    </>
  );
};

export default BasicInfoSection;
