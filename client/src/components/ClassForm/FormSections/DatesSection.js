import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Calendar } from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';

const DatesSection = ({ formik }) => {
  return (
    <>
      <Form.Group controlId="durationInMinutes">
        <Form.Label>Class Duration In Minutes</Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            placeholder="60"
            name="durationInMinutes"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.durationInMinutes}
            className={
              formik.touched.pricePerPerson && formik.errors.durationInMinutes ? 'form-error' : null
            }
          />
          <InputGroup.Append>
            <InputGroup.Text>Minutes</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        {formik.touched.durationInMinutes && formik.errors.durationInMinutes ? (
          <div className="form-error-message">{formik.errors.durationInMinutes}</div>
        ) : null}
      </Form.Group>
    </>
  );
};

export default DatesSection;
