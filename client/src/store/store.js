import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authentication/authReducer';
import registerReducer from './features/registration/registerReducer';
import userReducer from './features/user/userReducer';
import usersReducer from './features/users/usersReducer';

export default configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
    user: userReducer,
    users: usersReducer,
  },
});
