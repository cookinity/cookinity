import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import YourBookings from './components/YourBookings/YourBookings';
import NotFound from './components/NotFound/NotFound';
import ComingSoon from './components/ComingSoon/ComingSoon';
import HowCookinityWorks from './components/HowCookinityWorks/HowCookinityWorks';
import AboutUs from './components/AboutUs/AboutUs';
import Landing from './components/Landing/Landing';

import Loader from './components/Shared/Loader/Loader';

import { loadMe } from './store/features/authentication/authActions';
import { Home } from 'components/Home/Home';
import HostManagement from 'components/HostManagement/HostManagement';
import CreateClass from 'components/CreateClass/CreateClass';
import ClassDetail from 'components/ClassDetail/ClassDetail';
import EditClass from 'components/EditClass/EditClass';

import FeedbackUser from 'components/FeedbackUser/FeedbackUser';
import FeedbackHost from 'components/FeedbackHost/FeedbackHost';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faCalendarAlt,
  faClock,
  faEuroSign,
  faUsers,
  faMapMarkerAlt,
  faCheckCircle,
  faInfoCircle,
  faUtensils,
  faSeedling,
  faCarrot,
  faMapMarker,
  faHamburger,
  faCalendar,
  faCookie,
  faStar,
  faFish,
  faEgg,
  faLeaf,
} from '@fortawesome/free-solid-svg-icons';
import TimeManagements from 'components/HostManagement/TimeManagement/TimeManagements';
import BookedClasses from 'components/HostManagement/BookedClasses/BookedClasses';
import BookClass from 'components/ClassBooking/BookClass';

library.add(
  fab,
  faCalendarAlt,
  faClock,
  faEuroSign,
  faUsers,
  faMapMarkerAlt,
  faCheckCircle,
  faInfoCircle,
  faUtensils,
  faSeedling,
  faCarrot,
  faMapMarker,
  faHamburger,
  faCalendar,
  faCookie,
  faStar,
  faFish,
  faEgg,
  faLeaf,
);

const App = ({ auth, loadMe }) => {
  useEffect(() => {
    loadMe();
  }, [loadMe]);

  useEffect(() => {
    if (window.location.hash === '#_=_') window.location.hash = '';

    const cookieJwt = Cookies.get('x-auth-cookie');
    if (cookieJwt) {
      Cookies.remove('x-auth-cookie');
    }
  }, []);

  useEffect(() => {
    if (!auth.appLoaded && !auth.isLoading && auth.token && !auth.isAuthenticated) {
      loadMe();
    }
  }, [auth.isAuthenticated, auth.token, loadMe, auth.isLoading, auth.appLoaded]);

  return (
    <>
      {auth.appLoaded ? (
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/your-bookings" component={YourBookings} />
          <Route path="/notfound" component={NotFound} />
          <Route path="/comingsoon" component={ComingSoon} />
          <Route path="/landing" component={Landing} />
          <Route path="/aboutus" component={AboutUs} />
          <Route path="/howcookinityworks" component={HowCookinityWorks} />
          <Route path="/hostmanagement" component={HostManagement} exact />
          <Route path="/hostmanagement/create-class" component={CreateClass} exact />
          <Route path="/hostmanagement/booked-classes" component={BookedClasses} exact />
          <Route path="/classes/:classId" component={ClassDetail} exact />
          <Route path="/classes/:classId/booking" component={BookClass} exact />
          <Route
            path="/classes/:classId/booking/create-feedback/:orderId"
            component={FeedbackUser}
            exact
          />
          <Route
            path="/hostmanagement/booked-classes/:orderId/create-feedback"
            component={FeedbackHost}
            exact
          />
          <Route path="/hostmanagement/edit-class/:classId" component={EditClass} exact />

          <Route
            path="/hostmanagement/edit-class/:classId/times"
            component={TimeManagements}
            exact
          />
          <Route exact path="/:username" component={Profile} />
          <Route exact path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      ) : (
        <Loader />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { loadMe }))(App);
