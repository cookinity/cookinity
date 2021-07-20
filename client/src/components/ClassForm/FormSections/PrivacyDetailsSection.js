import React from 'react';
import { Form } from 'react-bootstrap';

const PrivacyDetailsSection = ({ formik }) => {
    return (
        <>
            <Form.Group controlId="privacyDetails">
                <Form.Label>Privacy Details</Form.Label>
                <Form.Control
                    placeholder="This information will only be available to people who booked the class"
                    name="privacyDetails"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.privacyDetails}
                    className={formik.touched.privacyDetails && formik.errors.privacyDetails ? 'form-error' : null}
                />
                {formik.touched.privacyDetails && formik.errors.privacyDetails ? (
                    <div className="form-error-message">{formik.errors.privacyDetails}</div>
                ) : null}
            </Form.Group>
        </>
    );
};

export default PrivacyDetailsSection;