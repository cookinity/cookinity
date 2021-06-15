import React from 'react';
import { Form, Col, InputGroup } from 'react-bootstrap';

const GuestsSection = ({ formik }) => {
  return (
    <>
      <Form.Row>
        <Form.Group as={Col} controlId="pricePerPerson">
          <Form.Label>Price Per Person</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="50,00"
              name="pricePerPerson"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pricePerPerson}
              className={
                formik.touched.pricePerPerson && formik.errors.pricePerPerson ? 'form-error' : null
              }
            />
            <InputGroup.Append>
              <InputGroup.Text>€</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          {formik.touched.pricePerPerson && formik.errors.pricePerPerson ? (
            <div className="form-error-message">{formik.errors.pricePerPerson}</div>
          ) : null}
        </Form.Group>
        <Form.Group as={Col} controlId="minGuests">
          <Form.Label>Minimum Number of Guests</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="1"
              name="minGuests"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.minGuests}
              className={formik.touched.minGuests && formik.errors.minGuests ? 'form-error' : null}
            />
            <InputGroup.Append>
              <InputGroup.Text>Guests</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          {formik.touched.minGuests && formik.errors.minGuests ? (
            <div className="form-error-message">{formik.errors.minGuests}</div>
          ) : null}
        </Form.Group>
        <Form.Group as={Col} controlId="maxGuests">
          <Form.Label>Maximum Number of Guests</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="1"
              name="maxGuests"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.maxGuests}
              className={formik.touched.maxGuests && formik.errors.maxGuests ? 'form-error' : null}
            />
            <InputGroup.Append>
              <InputGroup.Text>Guests</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          {formik.touched.maxGuests && formik.errors.maxGuests ? (
            <div className="form-error-message">{formik.errors.maxGuests}</div>
          ) : null}
        </Form.Group>
      </Form.Row>
    </>
  );
};

export default GuestsSection;
