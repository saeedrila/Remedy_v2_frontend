import React from 'react';
import UserRegister from './UserRegister';

// API Endpoint
const REGISTER_URL = '/account-signup'

const LabRegister = () => {
  return (
    <UserRegister
      accountType="lab"
      registerUrl={REGISTER_URL}
    />
  );
};

export default LabRegister;

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   // if button enabled with JS hack
//   const v1 = EMAIL_REGEX.test(email);
//   const v2 = PWD_REGEX.test(pwd);
//   const v3 = PWD_REGEX.test(matchPwd);
//   if (!v3 || !v2) {
//     toast.error("Passwords are not the same");
//     return;
//   }
//   try {
//     await axios.post(registerUrl, {
//       email: email,
//       password: pwd,
//       account_type: accountType,
//     });
//     // console.log(response.data);
//     // console.log(response.accessToken);
//     setEmail('');
//     setPwd('');
//     setMatchPwd('');
//     navigate('/login');
//   } catch (error) {
//     if (error.response) {
//       console.log('Error: ', error);
//       const { data } = error.response;
//       if (data.error) {
//         toast.error(data.error);
//       } else {
//         toast.error('An unexpected error occurred');
//       }
//     } else {
//       toast.error('No Server Response');
//     }
//   }
// }