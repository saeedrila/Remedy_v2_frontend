import React from 'react';
import UserRegister from './UserRegister';

// API Endpoint
const REGISTER_URL = '/account-signup'

const PatientRegister = () => {
  return (
    <UserRegister
      accountType="patient"
      registerUrl={REGISTER_URL}
    />
  );
};

export default PatientRegister;