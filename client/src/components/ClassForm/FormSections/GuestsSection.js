import React from 'react';
import { Form, Col, InputGroup } from 'react-bootstrap';
import Tooltip from '../Tooltip.js';

const GuestsSection = ({ formik }) => {
  return (
    <>
      <Form.Row>
        <Form.Group as={Col} xs={12} md={3} controlId="pricePerPerson">
          <Form.Label>Price Per Person</Form.Label>{' '}
          <Tooltip
            content={
              <span>
                <em>Cookinity collects a commission of 10%.</em>
                <br />
                If you set a price of 50€, you will earn 45€.
              </span>
            }
            direction="right"
          >
            <i className="fa fa-question" data-toggle="tooltip"></i>
          </Tooltip>
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
        <Form.Group as={Col} xs={12} md={3} controlId="minGuests">
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
        <Form.Group as={Col} xs={12} md={3} controlId="maxGuests">
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
        <Form.Group as={Col} xs={12} md={3} controlId="minGuestRatingRequired">
          <Form.Label>Minimum Guest Rating</Form.Label>
          <Tooltip
            content={
              <span>
                Please select the minimum stars you expect your guests to have.
                <br />
                Select 0 if you do not care!
              </span>
            }
            direction="top"
          >
            <i className="fa fa-question" data-toggle="tooltip"></i>
          </Tooltip>
          <InputGroup>
            <Form.Control
              type="number"
              name="minGuestRatingRequired"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.minGuestRatingRequired}
              className={
                formik.touched.minGuestRatingRequired && formik.errors.minGuestRatingRequired
                  ? 'form-error'
                  : null
              }
            />
            <InputGroup.Append>
              <InputGroup.Text>Stars</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          {formik.touched.minGuestRatingRequired && formik.errors.minGuestRatingRequired ? (
            <div className="form-error-message">{formik.errors.minGuestRatingRequired}</div>
          ) : null}
        </Form.Group>
      </Form.Row>
    </>
  );
};

export default GuestsSection;
