# Remedy
### An integrated software solution for superspeciality clinics to connect between patients, doctors, and labs.

## Modules
### Module 1: Authentication
The authentication module deals with the admin, patient, doctor, and lab’s account creation, password reset, login, and logout.
### Module 2: Patients
The Patients module contains their pages, functionalities, and other basic data models.
### Module 3: Doctors and Labs
This module deals with Doctors, and Laboratories. Contains their pages, functionalities, and other basic data models.
### Module 4: Executives
The executives module deals with the management of the system, and approval of doctors and laboratories.
### Module 5: Appointments
The appointments module deals with management of appointments. It also supplies real-time information on time-slot availability
### Module 6: Payments
The payments module deals with the processing of payments for appointments. It stores required information related to payments as well.
### Module 7: Reports
The reports module deals with the generation of reports, especially creating lab reports, prescriptions, other relevant data storage as well.
### Module 8: Video call
This module deals with all video call related APIs, settings, keys, etc.
### Module 9: Chat
This module deals with all chat related APIs, settings, keys, etc.

Versioning:
I am planning to use semantic versioning for the application backend as well as for the frontend. The structure is as follows:
<major>.<minor>.<patch>
Major: Major changes in the code which is incompatible with previous code.
Minor: Adding new features or changes
Patch: Bug fixes, 'b' represents backend and 'f' represent forntend
The versioning is mainly for developmental purpose. Since the versioning starting from 1.x.x, the urls starts with 'api'.

1.0.0:
Working code (Not all features are tested)

1.0.1f:
* Issue with multiple toast on doctor's and lab's dashboard solved.
* If there are no chats, it shows 'There are no conversation to show on the chat page.
* Executives can initiate chat with Staff, Doctors, and Labs.
* Doctor document upload modal setup. Maxium 10MB, 1 file could be uploaded.
* 10MB size limit for profile pic upload.

1.0.2
* Executive's staff page's document download issue solved.

1.0.3
* Doctors and Labs can initiate chat with patient on any-day.
* Doctor and Labs account: When new document is selected, old selected file will be discarded.

1.0.4
* Changes made according to bugs raised by project partner in boarding week.
* Executive, Doctor, and Lab will be automatically redirected to their respective dashboard on logging in.
* Minor changes in the footer, login page, and Profile page.

1.0.5
* Patients now can cancel appointments. The amount will be refunded to the source.

1.0.6
* Chat message duplication issue solved.

1.0.7
* Executives cannot block themselves from the platform. No executives can block superuser from platform
* Demo doctor, lab, admin(executive) creadentials were added to the login page




## Prerequisites:
I am using VSCode for my development and its integrated terminal. Any IDE and command prompt is enough.
I have enabled 'autosave features'. So, 'save' won't be mentioned in the follwing instructions.


# React
Created a new react app using:
```
npx create-react-app frontend
```
Create .env file and add details

From frontend directory, install react-redux, redux, react router dom, react-bootstrap reactstrap, bootstrap. I have installed reactstrap and react-bootstrap. This is not necessory. I have started with reactstrap, at one point of time, I felt it was limiting and installed react-bootstrap. 

```
npm install react-redux redux react-router-dom reactstrap react-bootstrap bootstrap
```

Install SASS related dependencies, formik and yup for form state management
```
npm install sass-loader node-sass css-loader style-loader postcss-loader formik yup
```

Install react-table, axios to send http request to backend and collect data, date fns for getting date related data, react toastify for pop-up messages, razorpay package, .env to load keys directly from .env file, formik for form validation, react scrollbar, Pusher for chat, react drop-zone, JWT Decode for decoding accessToken, moment for time related actions.
```
npm install react-table axios date-fns react-toastify razorpay dotenv dotenv-webpack formik react-perfect-scrollbar pusher-js react-dropzone jwt-decode moment
```



Thanks to:

Attributions:
Profile icon:
<a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a>

Doctor prescription:
<a href="https://storyset.com/health">Health illustrations by Storyset</a>

Lab test selection:
<a href="https://storyset.com/analysis">Analysis illustrations by Storyset</a>

Doctor :
<a href="https://storyset.com/work">Work illustrations by Storyset</a>

Lab test:
<a href="https://storyset.com/analysis">Analysis illustrations by Storyset</a>

Online Doctor:
<a href="https://storyset.com/work">Work illustrations by Storyset</a>

Green successful tick:
<a href="https://www.flaticon.com/free-icons/correct" title="correct icons">Correct icons created by kliwir art - Flaticon</a>

Linkedin logo:
<a href="https://www.flaticon.com/free-icons/linkedin" title="linkedin icons">Linkedin icons created by riajulislam - Flaticon</a>

Github logo:
<a href="https://www.flaticon.com/free-icons/github" title="github icons">Github icons created by riajulislam - Flaticon</a>

Blood Test icon:
<a href="https://www.flaticon.com/free-icons/check" title="check icons">Check icons created by Freepik - Flaticon</a>