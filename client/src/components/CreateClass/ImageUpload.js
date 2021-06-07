import React from 'react';
import './ImageUpload.scss';

const ImageUpload = ({ onImageChange, image, imageUrl, id }) => {
  return (
    <>
      <div className="input-group mb-3 px-2 py-2 rounded-pill shadow-sm">
        <input id={id} type="file" onChange={onImageChange} className={'form-control upload'} />
        <label htmlFor={id} className="font-weight-light text-muted upload-label">
          {image ? image.name : 'Choose a photo'}
        </label>
        <div className="input-group-append">
          <label htmlFor={id} className="btn btn-light m-0 rounded-pill px-4">
            {' '}
            <i className="fa fa-cloud-upload mr-2 text-muted"></i>
            <small className="text-uppercase font-weight-bold text-muted">Choose file</small>
          </label>
        </div>
      </div>
      <small className="form-text text-muted">jpg, jpeg, png | Max-File-Size: 5 Megabytes</small>
      <div className="image-area mt-4">
        <img
          id="imageResult"
          src={imageUrl}
          width="600px"
          height="300px"
          alt=""
          className="img-fluid rounded shadow-sm mx-auto d-block"
        />
      </div>
    </>
  );
};

export default ImageUpload;
