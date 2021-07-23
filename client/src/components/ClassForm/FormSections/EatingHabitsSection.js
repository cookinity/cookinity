import React from 'react';
import { Form, Col } from 'react-bootstrap';
import Tooltip from '../Tooltip.js';

const EatingHabitsSection = ({ formik }) => {
  return (
    <>
      <Form.Label>Eating Habits You Can Accommodate</Form.Label>{' '}
      <Tooltip
        content="Select all dietary preferences that apply to your cooking class."
        direction="right"
      >
        <i className="fa fa-question" data-toggle="tooltip"></i>
      </Tooltip>
      <Form.Row>
        <Form.Group as={Col} controlId="veganFriendly">
          <Form.Check
            label="Vegan"
            type="checkbox"
            value="true"
            name="veganFriendly"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.values.veganFriendly}
            className={
              formik.touched.veganFriendly && formik.errors.veganFriendly ? 'form-error' : null
            }
          />
          {formik.touched.veganFriendly && formik.errors.veganFriendly ? (
            <div className="form-error-message">{formik.errors.veganFriendly}</div>
          ) : null}
        </Form.Group>
        <Form.Group as={Col} controlId="vegetarianFriendly">
          <Form.Check
            label="Vegetarian"
            type="checkbox"
            value="true"
            name="vegetarianFriendly"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.values.vegetarianFriendly}
            className={
              formik.touched.vegetarianFriendly && formik.errors.vegetarianFriendly
                ? 'form-error'
                : null
            }
          />
          {formik.touched.vegetarianFriendly && formik.errors.vegetarianFriendly ? (
            <div className="form-error-message">{formik.errors.vegetarianFriendly}</div>
          ) : null}
        </Form.Group>
        <Form.Group as={Col} controlId="nutAllergyFriendly">
          <Form.Check
            label="Nut Allergy"
            type="checkbox"
            value="true"
            name="nutAllergyFriendly"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.values.nutAllergyFriendly}
            className={
              formik.touched.nutAllergyFriendly && formik.errors.nutAllergyFriendly
                ? 'form-error'
                : null
            }
          />
          {formik.touched.nutAllergyFriendly && formik.errors.nutAllergyFriendly ? (
            <div className="form-error-message">{formik.errors.nutAllergyFriendly}</div>
          ) : null}
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} controlId="pescatarianFriendly">
          <Form.Check
            label="Pescatarian"
            type="checkbox"
            value="true"
            name="pescatarianFriendly"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.values.pescatarianFriendly}
            className={
              formik.touched.pescatarianFriendly && formik.errors.pescatarianFriendly
                ? 'form-error'
                : null
            }
          />
          {formik.touched.pescatarianFriendly && formik.errors.pescatarianFriendly ? (
            <div className="form-error-message">{formik.errors.pescatarianFriendly}</div>
          ) : null}
        </Form.Group>
        <Form.Group as={Col} controlId="eggFree">
          <Form.Check
            label="Egg-Free"
            type="checkbox"
            value="true"
            name="eggFree"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.values.eggFree}
            className={formik.touched.eggFree && formik.errors.eggFree ? 'form-error' : null}
          />
          {formik.touched.eggFree && formik.errors.eggFree ? (
            <div className="form-error-message">{formik.errors.eggFree}</div>
          ) : null}
        </Form.Group>
        <Form.Group as={Col} controlId="soyFree">
          <Form.Check
            label="Soy-free"
            type="checkbox"
            value="true"
            name="soyFree"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.values.soyFree}
            className={formik.touched.soyFree && formik.errors.soyFree ? 'form-error' : null}
          />
          {formik.touched.soyFree && formik.errors.soyFree ? (
            <div className="form-error-message">{formik.errors.soyFree}</div>
          ) : null}
        </Form.Group>
      </Form.Row>
    </>
  );
};

export default EatingHabitsSection;
