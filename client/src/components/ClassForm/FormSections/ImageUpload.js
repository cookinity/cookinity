import React from 'react';
import './ImageUpload.scss';

const ImageUpload = ({ onImageChange, image, imageUrl, id }) => {
  return (
    <>
      <div>
        <label className="custom-file-upload-label">
          <input className="custom-file-upload" id={id} type="file" onChange={onImageChange} />
          Upload Photo
        </label>
      </div>
      <small className="form-text text-muted">jpg, jpeg, png | Max-File-Size: 5 Megabytes</small>
      <div className="image-area mt-4">
        <img src={imageUrl} alt="" className="img-fluid rounded shadow-sm mx-auto d-block" />
        <small className="form-text text-muted">{image ? image.name : ''}</small>
      </div>
    </>
  );
};

export default ImageUpload;
