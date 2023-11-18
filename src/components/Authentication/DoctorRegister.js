import React from 'react';
import UserRegister from './UserRegister';

// API Endpoint
const REGISTER_URL = '/account-signup'

const DoctorRegister = () => {
  return (
    <UserRegister
      accountType="doctor"
      registerUrl={REGISTER_URL}
    />
  );
};

export default DoctorRegister;