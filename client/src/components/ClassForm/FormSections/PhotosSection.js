import React from 'react';
import { Form, Col } from 'react-bootstrap';
import ImageUpload from './ImageUpload';

const PhotosSection = ({
  formik,
  onCoverPhotoChange,
  coverPhoto,
  coverPhotoUrl,
  onPhotoOneChange,
  photoOne,
  photoOneUrl,
  onPhotoTwoChange,
  photoTwo,
  photoTwoUrl,
}) => {
  return (
    <>
      <Form.Row>
        <Col sm={12} md={4}>
          <Form.Group>
            <Form.Label>Choose a Cover Photo For Your Class</Form.Label>
            <ImageUpload
              id="coverPhoto"
              onImageChange={onCoverPhotoChange}
              image={coverPhoto}
              imageUrl={coverPhotoUrl}
            ></ImageUpload>
            {formik.touched.coverPhoto && formik.errors.coverPhoto ? (
              <div className="form-error-message">{formik.errors.coverPhoto}</div>
            ) : null}
          </Form.Group>
        </Col>
        <Col sm={12} md={4}>
          <Form.Group>
            <Form.Label>Choose an Additional Photo</Form.Label>
            <ImageUpload
              id="photoOne"
              onImageChange={onPhotoOneChange}
              image={photoOne}
              imageUrl={photoOneUrl}
            ></ImageUpload>
            {formik.touched.photoOne && formik.errors.photoOne ? (
              <div className="form-error-message">{formik.errors.photoOne}</div>
            ) : null}
          </Form.Group>
        </Col>
        <Col sm={12} md={4}>
          <Form.Group>
            <Form.Label>Choose an Additional Photo</Form.Label>
            <ImageUpload
              id="photoTwo"
              onImageChange={onPhotoTwoChange}
              image={photoTwo}
              imageUrl={photoTwoUrl}
            ></ImageUpload>
            {formik.touched.photoTwo && formik.errors.photoTwo ? (
              <div className="form-error-message">{formik.errors.photoTwo}</div>
            ) : null}
          </Form.Group>
        </Col>
      </Form.Row>
    </>
  );
};

export default PhotosSection;
