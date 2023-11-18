import React from 'react';
import UserRegister from './UserRegister';

// API Endpoint
const REGISTER_URL = '/account-signup'

const ExecutiveRegister = () => {
  return (
    <UserRegister
      accountType="executive"
      registerUrl={REGISTER_URL}
    />
  );
};

export default ExecutiveRegister;