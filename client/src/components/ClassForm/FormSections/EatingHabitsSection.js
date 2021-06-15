import React from 'react';
import { Form, Col } from 'react-bootstrap';

const EatingHabitsSection = ({ formik }) => {
  return (
    <>
      <Form.Label>Eating Habits You Can Accommodate</Form.Label>
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
    </>
  );
};

export default EatingHabitsSection;
