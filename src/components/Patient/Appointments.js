import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Modal,
  Container,
  Button,
} from 'react-bootstrap'
import {
  CardBody,
  CardTitle,
} from 'reactstrap'
import { toast } from 'react-toastify';
import axios from "../../api/axios";

const FETCH_PATIENT_APPOINTMENTS = '/fetch-patient-appointments'
const FETCH_PATIENT_PRESCRIPTION = '/fetch-patient-prescription'
const DELETE_CANCEL_APPOINTMENT = '/delete-cancel-an-appointment'

function Appointments({ triggerFetch }) {
  const [patientAppointmentList, setPatientAppointmentList] = useState([]);
  const [prescriptionModalShow, setPrescriptionModalShow] = useState(false);
  const [cancelAppointmentModalShow, setCancelAppointmentModalShow] = useState(false);
  const [prescriptionDetails, setPrescriptionDetails] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  

  const fetchPatientAppointmentDetails = async ()=> {
    try{
      const response = await axios.get(FETCH_PATIENT_APPOINTMENTS);
      setPatientAppointmentList(response.data);
      console.log('Patient Appointment List: ', response.data);
    } catch (error){
      console.error('Error fetching data', error)
    }
  }

  const fetchPrescription = async (appointmentId) => {
    try {
      const response = await axios.get(FETCH_PATIENT_PRESCRIPTION, {
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

  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.delete(DELETE_CANCEL_APPOINTMENT, {
        params: { appointment_id: appointmentId },
      });
      if (response.status === 200) {
        toast.success('Appointment has been cancelled');
        console.info('Success:', response.data);
      } else {
        toast.error('Appointment could not be cancelled');
        console.error('Error:', response.data);
      }
    } catch (error){
      toast.error('Network error happened while cancelling');
      console.error('Error:', error);
    }
    setCancelAppointmentModalShow(false);
    fetchPatientAppointmentDetails();
  }



  useEffect(()=> {
    fetchPatientAppointmentDetails();
  }, [triggerFetch])



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
        </Modal.Footer>
      </Modal>

      {/* Appointment Cancel Warning Modal */}
      <Modal
        show={cancelAppointmentModalShow}
        onHide={() => setCancelAppointmentModalShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <div>
              <p>Appointment ID: {selectedAppointmentId}</p>
            </div>
            <div>
              <p>Are you sure you wanted to cancel the appointment? This action will be permanent. 
                Any appointment fee paid will be refunded to the source withing 2-5 working days.</p>
            </div>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => {
              setPrescriptionModalShow(false)
              cancelAppointment(selectedAppointmentId);
              }}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <CardTitle className="h2">Appointments </CardTitle>
              <div className="table-responsive">
                <Table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Sl. No.</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Doctor/Lab</th>
                      <th>Appointment ID</th>
                      <th>Status</th>
                      <th>Prescription</th>
                      <th>Cancellation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientAppointmentList.map((appointment, index)=>(
                      <tr key={appointment.appointment_id}>
                      <th scope="row">{index + 1}</th>
                      <td>{appointment.time} on {appointment.date}</td>
                      <td>{appointment.slot_type}</td>
                      <td>{appointment.email}</td>
                      <td>{appointment.appointment_id}</td>
                      <td>{appointment.status}</td>
                      <td>
                        <Button
                          disabled={appointment.status !== 'Completed'}
                          onClick={()=>{
                            fetchPrescription(appointment.appointment_id);
                            setSelectedAppointmentId(appointment.appointment_id);
                          }}
                        >
                          Open
                        </Button>
                      </td>
                      <td>
                        <Button
                          disabled={appointment.status !== 'Booked'}
                          onClick={()=>{
                            setSelectedAppointmentId(appointment.appointment_id);
                            setCancelAppointmentModalShow(true);
                          }}
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Appointments