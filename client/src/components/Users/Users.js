import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';


import { getUsers } from '../../store/features/users/usersActions';
import Layout from '../Layout/Layout';
import Loader from '../Shared/Loader/Loader';
import requireAuth from '../../higherOrderComponents/requireAuth';
import { Button, Card, CardDeck, Col, Container, Row } from 'react-bootstrap';

//import './styles.scss';

const Users = ({ getUsers, users: { users, isLoading } }) => {
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout>
      <div className="users" >
        <p className="text-primary">
          <p className="text-center">
            <p className="font-weight-bold">
              <h1>USER</h1>
            </p>
          </p>
        </p>

        <p className="text-center">
          This is the Users page. Here are listed all of the users of the app. Click the avatar (not supported yet) or
          the username link to go to user's profile. Only authenticated users can see this page.
        </p>

        <div className="list" >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {users.map((user, index) => {
                return (
                  <Card border="primary" style={{ width: '18rem' }} className="pull-left mr-3">
                    <Card.Img variant="top" src={user.avatar} />
                    <Card.Body>
                      <Card.Text>
                        <div>
                          <span className="font-weight-bold">Provider: </span>
                          <span className="info">{user.provider}</span>
                        </div>
                        <div>
                          <span className="font-weight-bold">Role: </span>
                          <span className="info">{user.role}</span>
                        </div>
                        <div>
                          <span className="font-weight-bold">Name: </span>
                          <span className="info">{user.name}</span>
                        </div>
                        <div>
                          <span className="font-weight-bold">Username: </span>
                          <Link to={`/${user.username}`} className="primary" >
                            {user.username}
                          </Link>
                        </div>
                        <div>
                          <span className="font-weight-bold">E-Mail: </span>
                          <span className="info">{user.email}</span>
                        </div>
                        <div>
                          <span className="font-weight-bold">Joined: </span>
                          <span className="info">
                            {moment(user.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
                          </span>
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>

                );
                //mapping ende 
              })}
            </>
          )}
        </div>
      </div >

    </Layout >
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default compose(requireAuth, connect(mapStateToProps, { getUsers }))(Users);
