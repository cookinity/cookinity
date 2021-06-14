import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getUsers } from '../../store/features/users/usersActions';
import Layout from '../Layout/Layout';
import requireAuth from '../../higherOrderComponents/requireAuth';
import { Col, Row } from 'react-bootstrap';
import HostCard from './HostCard';


const Users = ({ getUsers, users: { users, isLoading } }) => {
  useEffect(() => {
    getUsers();
  }, []);

  //ohne Filter
  const hCards = users.map((c) => {
    return (
      <Col sm={12} md={6} lg={4}>
        <HostCard c={c} key={c.id}></HostCard>
      </Col>)
  });

  return (
    <Layout>
      <div className={"users"} >
        <p className={"text-primary text-center font-weight-bold"}>
          <h1>HOSTS</h1>
        </p>

        <p className="text-center">
          This is the Hosts page. Here are listed all of the users of the app with at least one offered cooking course. Click the avatar (not supported yet) or
          the username link to go to user's profile. Only authenticated users can see this page.
        </p>
        <Row><Col>
        </Col>
        </Row>
        <Row>{hCards} </Row>
      </div >

    </Layout >
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default compose(requireAuth, connect(mapStateToProps, { getUsers }))(Users);