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
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";

const FETCH_DOCTOR_APPOINTMENTS = '/fetch-doctor-appointments'
const FETCH_PRESCRIPTOIN = '/patch-prescription'
const PATCH_PRESCRIPTION = '/patch-prescription'
const INITIATE_CHAT_ON_APPOINTMENT = '/initiate-chat-on-appointment'



function Appointments({ triggerFetch }) {
  const navigate = useNavigate();
  const [doctorAppointmentList, setDoctorAppointmentList] = useState([]);

  // Prescription modal
  const [prescriptionModalShow, setPrescriptionModalShow] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [prescriptionDetails, setPrescriptionDetails] = useState('');

  // Today's date
  const dayZeroDate = format(new Date(), 'yyyy-MM-dd');

  const fetchDoctorAppointmentList = async ()=>{
    try{
      const response = await axios.get(FETCH_DOCTOR_APPOINTMENTS);
      setDoctorAppointmentList(response.data);
    } catch (error){
      toast.error('Error fetching data');
      console.error('Error fetching data', error)
    }
  }

  useEffect(()=> {
    fetchDoctorAppointmentList();
  }, [triggerFetch])

  const handlePrescriptionModalSubmit = async () =>{
    try{
      const data = {
        appointment_id: selectedAppointmentId,
        prescription: prescriptionDetails,
      }
      await axios.patch(PATCH_PRESCRIPTION, data);
      // console.log('Prescription submission successful');
      setPrescriptionModalShow(false);
      fetchDoctorAppointmentList();
      setPrescriptionDetails('')
      toast.success('Prescription submitted');
    } catch (error){
      toast.error('Error while submitting');
      // console.error('Error:', error.data);
    }
  }

  const fetchPrescription = async (appointmentId) => {
    try {
      const response = await axios.get(FETCH_PRESCRIPTOIN, {
        params: { appointment_id: appointmentId },
      });
      if (response.status === 200) {
        if (response.data.prescription === null) {
          setPrescriptionDetails('');
        } else {
          setPrescriptionDetails(response.data.prescription);
        }
      } else {
        console.error('Error:', response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setPrescriptionModalShow(true);
  };

  const redirectToChat = async (appointmentId) => {
    try {
      const response = await axios.post(INITIATE_CHAT_ON_APPOINTMENT, {
        appointmentId: appointmentId,}
      );
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
      {/* Profile Edit Modal */}
      <Modal
        show={prescriptionModalShow}
        onHide={() => setPrescriptionModalShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Prescription</Modal.Title>
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
              value={prescriptionDetails}
              onChange={(e) => setPrescriptionDetails(e.target.value)}
            >
            </textarea>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPrescriptionModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handlePrescriptionModalSubmit()}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <CardTitle className="h2">Appointments </CardTitle>
              {doctorAppointmentList.length > 0?
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
                    {doctorAppointmentList.map((appointment, index)=>(
                      <tr key={appointment.appointment_id}>
                        <th scope="row">{index + 1}</th>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.slot_type}</td>
                        <td>{appointment.patient_email}</td>
                        <td>{appointment.appointment_id}</td>
                        <td>{appointment.status}</td>
                        <td>
                          <Button gap={3} onClick={()=>{
                            console.log('Appointment ID: ',appointment.appointment_id)
                            setSelectedAppointmentId(appointment.appointment_id);
                            fetchPrescription(appointment.appointment_id);
                            }}
                            disabled={appointment.date !== dayZeroDate}
                            >
                            Prescribe
                          </Button>{' '}
                          <Button onClick={()=>{
                            console.log('Appointment ID: ',appointment.appointment_id)
                            redirectToChat(appointment.appointment_id);
                            }}
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