import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import "./assets/scss/theme.scss";
import useAuth from './hooks/useAuth';
import axios from './api/axios';

// Login page
import Login from './components/Authentication/Login';

// Profile Page
import Profile from '../src/components/Common/Profile'

// Registration Pages
import ExecutiveRegister from './components/Authentication/ExecutiveRegister'
import DoctorRegister from './components/Authentication/DoctorRegister';
import LabRegister from './components/Authentication/LabRegister';
import PatientRegister from './components/Authentication/PatientRegister';

import Home from './components/Common/Home';
import DoctorSpecialties from './components/DoctorSpecialties';
import SelectDoctor from './components/SelectDoctor';

import LabTests from './components/LabTests';
import DoctorAppointmentConfirmation from './components/Patient/DoctorAppointmentConfirmation';
import DoctorAppointmentPaymentConfirmation from './components/Patient/DoctorAppointmentPaymentConfirmation';

// Dashboards
import DashboardDoctor from './components/Doctor/DashboardDoctor';
import DashboardLab from './components/Lab/DashboardLab';
import DashboardPatient from './components/Patient/DashboardPatient';
import DashboardExecutive from './components/Executive/DashboardExecutive';

// Error 404,401
import Error404 from './components/Common/Error404';
import Error401 from './components/Common/Error401';

//Chat
import Chat from '../src/components/Common/Chat'
// Chat Test
// import ChatTest from './components/Common/ChatTest';

// Sitemap
import SiteMap from './components/Common/SiteMap';
import SelectLab from './components/SelectLab';
import LabAppointmentConfirmation from './components/Patient/LabAppointmentConfirmation';
const ACCESS_TOKEN_VERIFICATION = '/token/verify/'


function App() {
  const { auth, setAuth } = useAuth();
  const [lastVisitedPage, setLastVisitedPage] = useState(
    sessionStorage.getItem('lastVisitedPage') || '/'
  );
  const handlePageChange = (newPage) => {
    setLastVisitedPage(newPage);
    sessionStorage.setItem('lastVisitedPage', newPage);
  };

  const verifyToken = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(ACCESS_TOKEN_VERIFICATION, {
        token: accessToken,
      });
  
      if (response.status >= 200 && response.status < 300) {
        // Token verification successful, you can process the response data here
        const data = response;
        // console.log('Token verification successful:', data);
  
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      } else {
        // Handle non-successful response here, e.g., show an error message
        // console.error('Token verification failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during token verification:', error.message);
    }
  };

  useEffect(() => {
    let accessToken;
    try{
      accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const email = localStorage.getItem('email');
      const rolesJSON = localStorage.getItem('roles');
      const username = localStorage.getItem('username');

      console.log('rolesJSON: ', rolesJSON);

      if (accessToken) {
        const roles = JSON.parse(rolesJSON);
        setAuth({
          accessToken: accessToken,
          refreshToken: refreshToken,
          email: email,
          roles: roles,
          username: username,
        });
      }
    } catch (error){
      console.log(error);
    }
    if (accessToken) {
      console.log('Auth after setAuth: ', auth)
      verifyToken(); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <>
      <Routes>
        {/* Login */}
        <Route path="login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          {/* Public pages */}
          {/* Account registration */}
          <Route path='executive-register' element={<ExecutiveRegister />} />
          <Route path='doctor-register' element={<DoctorRegister />} />
          <Route path='lab-register' element={<LabRegister />} />
          <Route path='register' element={<PatientRegister />} />

          {/* Landing page */}
          <Route path='/' element={<Home />} />

          {/* Profile Page */}
          <Route element={<RequireAuth allowedRoles={['is_patient', 'is_doctor', 'is_lab', 'is_executive']}/>}>
            <Route path='profile' element={<Profile/>} />
          </Route>
          
          <Route path='chat' element={<Chat/>} />

          {/* Patient specific pages */}
          <Route element={<RequireAuth allowedRoles={['is_patient']}/>}>
            <Route path='dashboard-patient' element={<DashboardPatient/>} />
            <Route path='doctor-at-specialization' element={<DoctorSpecialties/>} />
            <Route path='lab-at-test' element={<LabTests/>} />
             
            <Route path='doctor-at-specialization/:specialization_title' element={<SelectDoctor/>} />
            <Route path='lab-at-test/:test_title' element={<SelectLab/>} />
            <Route path='doctor-at-specialization/doctor-appointment-confirmation' element={<DoctorAppointmentConfirmation/>} />
            <Route path='lab-at-test/lab-appointment-confirmation' element={<LabAppointmentConfirmation/>} />
            <Route path='payment-confirmation/' element={<DoctorAppointmentPaymentConfirmation/>} />
          </Route>

          {/* Doctor specific pages */}
          <Route element={<RequireAuth allowedRoles={['is_doctor']}/>}>
            <Route path='dashboard-doctor' element={<DashboardDoctor/>} />
          </Route>
          
          {/* Lab specific pages */}
          <Route element={<RequireAuth allowedRoles={['is_lab']}/>}>
            <Route path='dashboard-lab' element={<DashboardLab/>} />
          </Route>

          {/* Executive specific pages */}
          <Route element={<RequireAuth allowedRoles={['is_executive']}/>}>
            <Route path='dashboard-executive' element={<DashboardExecutive/>} />
          </Route>


          <Route path='lab-tests' element={<LabTests/>} />

          {/* Error 404,401 */}
          <Route path='*' element={<Error404/>} />
          <Route path='unauthorized' element={<Error401/>} />

          {/* Sitemap */}
          <Route path='sitemap' element={<SiteMap />} />

          {/* used while testing*/}
          {/* Chat Test */}
          {/* <Route path='chat-test' element={<ChatTest />} /> */}
          
          <Route path='doctor-specialties/1/select-doctor/doctor-appointment-confirmation' element={<DoctorAppointmentConfirmation/>} />
          <Route path='doctor-specialties/1/select-doctor/doctor-appointment-confirmation/payment-confirmation' element={<DoctorAppointmentPaymentConfirmation/>} />


        </Route>
      </Routes>
    </>
  );
}

export default App;