import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Container,
} from 'react-bootstrap'
import {
  CardBody,
  CardTitle,
} from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";

const FETCH_LAB_APPOINTMENTS = '/fetch-lab-appointments'
const FETCH_REPORT = '/patch-report'
const PATCH_REPORT = '/patch-report'
const INITIATE_CHAT_ON_APPOINTMENT = '/initiate-chat-on-appointment'



function Appointments({ triggerFetch }) {
  const navigate = useNavigate();
  const [labAppointmentList, setLabAppointmentList] = useState([]);

  // Report modal
  const [reportModalShow, setReportModalShow] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // Today's date
  const dayZeroDate = format(new Date(), 'yyyy-MM-dd');

  const fetchLabAppointmentList = async ()=>{
    try{
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(FETCH_LAB_APPOINTMENTS, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLabAppointmentList(response.data)
    } catch (error){
      toast.error('Error fetching data');
      console.error('Error fetching data', error)
    }
  }

  useEffect(()=> {
    fetchLabAppointmentList();
  }, [triggerFetch])

  const handleReportModalSubmit = async () =>{
    try{
      const accessToken = localStorage.getItem('accessToken');
      const data = {
        appointment_id: selectedAppointmentId,
        report: reportDetails,
      }
      const response = await axios.patch(PATCH_REPORT, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      console.log('Report submission successful', response.data);
      setReportModalShow(false);
      fetchLabAppointmentList();
      setReportDetails('')
      toast.success('Report submitted');
    } catch (error){
      toast.error('Error while submitting');
      console.error('Error:', error.data);
    }
  }

  const fetchReport = async (appointmentId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(FETCH_REPORT, {
        params: { appointment_id: appointmentId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        if (response.data.report === null) {
          setReportDetails('');
        } else {
          setReportDetails(response.data.report);
        }
      } else {
        console.error('Error:', response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setReportModalShow(true);
  };

  const redirectToChat = async (appointmentId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(INITIATE_CHAT_ON_APPOINTMENT, {
        appointmentId: appointmentId,}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        navigate('/chat');
      } else {
        toast.error('Error initiating chat. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Profile Edit Modal */}
      <Modal
        show={reportModalShow}
        onHide={() => setReportModalShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <div>
              <p>Appointment ID: {selectedAppointmentId}</p>
            </div>
            <textarea 
              className="container-fluid full-width" 
              rows="10" 
              placeholder="Enter your text here..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
            >
            </textarea>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setReportModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleReportModalSubmit()}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <CardTitle className="h2">Appointments </CardTitle>
              {labAppointmentList.length > 0?
              <div className="table-responsive">
                <Table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Sl. No.</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Patient email</th>
                      <th>Appointment ID</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labAppointmentList.map((appointment, index)=>(
                      <tr key={appointment.appointment_id}>
                        <th scope="row">{index + 1}</th>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.slot_type}</td>
                        <td>{appointment.patient_email}</td>
                        <td>{appointment.appointment_id}</td>
                        <td>{appointment.status}</td>
                        <td>
                          <Button onClick={()=>{
                            console.log('Appointment ID: ',appointment.appointment_id)
                            setSelectedAppointmentId(appointment.appointment_id);
                            fetchReport(appointment.appointment_id);
                            }}
                            disabled={appointment.date !== dayZeroDate}
                            >
                            Report
                          </Button>{' '}
                          <Button onClick={()=>{
                            console.log('Appointment ID: ',appointment.appointment_id)
                            redirectToChat(appointment.appointment_id);
                            }}
                            disabled={appointment.date !== dayZeroDate}
                            >
                            Chat
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              :<h3>Sorry, there are no appointments to show</h3>
              }
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Appointments