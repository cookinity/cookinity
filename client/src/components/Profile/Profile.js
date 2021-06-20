import React, { useEffect, useState, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { getProfile, editUser, deleteUser } from '../../store/features/user/userActions';
import { loadMe } from '../../store/features/authentication/authActions';
import Layout from '../Layout/Layout';
import Loader from '../Shared/Loader/Loader';
import requireAuth from '../../higherOrderComponents/requireAuth';
import { profileSchema } from './validation';
import { Button, Form, Image } from 'react-bootstrap';

import './styles.scss';

const Profile = ({
  getProfile,
  user: { profile, isLoading, error },
  auth: { me },
  editUser,
  deleteUser,
  loadMe,
  history,
  match,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const retryCount = useRef(0);
  const matchUsername = match.params.username;

  useEffect(() => {
    getProfile(matchUsername, history);
  }, [matchUsername]);

  // if changed his own username reload me, done in userActions

  const onChange = (event) => {
    formik.setFieldValue('image', event.currentTarget.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
    setAvatar(event.target.files[0]);
  };

  const handleClickEdit = () => {
    retryCount.current = 0;
    setIsEdit(!isEdit);
    setImage(null);
    setAvatar(null);
    formik.setFieldValue('id', profile.id);
    formik.setFieldValue('name', profile.name);
    formik.setFieldValue('username', profile.username);
    formik.setFieldValue('description', profile.description);
  };

  const handleDeleteUser = (id, history) => {
    deleteUser(id, history);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: '',
      name: '',
      username: '',
      password: '',
      description: ''
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('avatar', avatar);
      formData.append('name', values.name);
      formData.append('username', values.username);
      if (profile.provider === 'email') {
        formData.append('password', values.password);
      }
      formData.append('description', values.description);
      editUser(values.id, formData, history);
      //setIsEdit(false);
    },
  });

  return (
    <Layout>
      <div className="profile">
        <h1>Profile page</h1>
        <p>
          This is the profile page. User can edit his own profile and Admin can edit any user's
          profile. Only authenticated users can see this page.
        </p>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="profile-info">
            <Image src={image ? image : profile.avatar} className="avatar" rounded />
            <div className="info-container">
              <div>
                <span className="label">Provider: </span>
                <span className="info">{profile.provider}</span>
              </div>
              <div>
                <span className="label">Role: </span>
                <span className="info">{profile.role}</span>
              </div>
              <div>
                <span className="label">Name: </span>
                <span className="info">{profile.name}</span>
              </div>
              <div>
                <span className="label">Username: </span>
                <span className="info">{profile.username}</span>
              </div>
              <div>
                <span className="label">Email: </span>
                <span className="info">{profile.email}</span>
              </div>
              <div>
                <span className="label">Joined: </span>
                <span className="info">
                  {moment(profile.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
                </span>
              </div>
              <div>
                <span className="label">Description: </span>
                <span className="info">{profile.description}</span>
              </div>
              <div>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleClickEdit}
                  disabled={!(me?.username === profile.username || me?.role === 'ADMIN')}
                >
                  {isEdit ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {isEdit && (
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group>
              <Form.File label="Avatar:" name="image" onChange={onChange} />
            </Form.Group>
            {image && (
              <Button
                style={{ marginBottom: 5 }}
                variant="primary"
                type="button"
                onClick={() => {
                  setImage(null);
                  setAvatar(null);
                }}
              >
                Remove Image
              </Button>
            )}
            <Form.Control name="id" type="hidden" value={formik.values.id} />
            <div className="input-div">
              <Form.Group controlId="nameInput">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  placeholder="Name"
                  name="name"
                  className=""
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
              </Form.Group>
              {formik.touched.name && formik.errors.name ? (
                <p className="error">{formik.errors.name}</p>
              ) : null}
            </div>
            <div className="input-div">
              <Form.Group controlId="userNameInput">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  placeholder="Username"
                  name="username"
                  className=""
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                />
              </Form.Group>
              {formik.touched.username && formik.errors.username ? (
                <p className="error">{formik.errors.username}</p>
              ) : null}
            </div>
            {profile.provider === 'email' && (
              <div className="input-div" style={{ marginBottom: 10 }}>
                <Form.Group controlId="emailInput">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    placeholder="Password"
                    name="password"
                    className=""
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                </Form.Group>
                {formik.touched.password && formik.errors.password ? (
                  <p className="error">{formik.errors.password}</p>
                ) : null}
              </div>
            )}
            <div className="input-div">
              <Form.Group controlId="descriptionInput">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                  placeholder="Description"
                  name="description"
                  className=""
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description || ''}
                />
              </Form.Group>
              {formik.touched.description && formik.errors.description ? (
                <p className="error">{formik.errors.description}</p>
              ) : null}
            </div>
            <Button variant="primary" type="submit">
              Save
            </Button>
            <Button variant="primary" onClick={() => handleDeleteUser(profile.id, history)}>
              Delete profile
            </Button>
          </Form>
        )}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  auth: state.auth,
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { getProfile, editUser, deleteUser, loadMe }),
)(Profile);
