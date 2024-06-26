import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Card,
  Table,
  Modal,
  Button,
} from 'react-bootstrap'
import {
  CardBody,
  CardTitle,
} from 'reactstrap'
import axios from '../../api/axios'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

// API Endpoint
const ACCOUNT_APPROVAL_URL = 'account-approval'
const INITIATE_CHAT_BY_EXECUTIVE = '/initiate-chat-by-executive'



function Staff({ triggerFetch }) {
  const navigate = useNavigate();
  document.title = 'Executive Dashboard || Staff approval'
  const [listOfAccounts, setListOfAccounts] = useState([])
  const [actionModal, setActionModal] = useState(false);
  const [approvalSate, setApprovalState] = useState('')

  const getAccountForApproval = async () => {
    try {
      const response = await axios.get(ACCOUNT_APPROVAL_URL);
      setListOfAccounts(response.data);
      console.log('Staff list loaded');
      console.log('Staff list: ', response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const accountApprove = async (status, account_id) => {
    try {
      const response = await axios.patch(ACCOUNT_APPROVAL_URL, {
        id: account_id,
        status: status,
      });
      toast.success(response.data.detail);
      getAccountForApproval();
    } catch (error) {
      if (error.response.status === 403) {
        toast.error(error.response.data.detail);
      } else {
        console.log('Error submitting data', error);
        toast.error('Error submitting data');
      }
    }
  };

  useEffect(() => {
    // Fetch initial data when the component mounts
    getAccountForApproval();
  }, [triggerFetch]);

  const redirectToChat = async (staffId) => {
    try {
      const response = await axios.post(INITIATE_CHAT_BY_EXECUTIVE, {
        staffId: staffId,}
      );
      if (response.status === 200 || response.status === 201) {
        navigate('/chat');
      } else {
        toast.error('Error initiating chat. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error);
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
      {/* Modal */}
      <Modal 
        show={actionModal} 
        onHide={()=>setActionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Caution</Modal.Title>
        </Modal.Header>
        <Modal.Body>Blocking an active staff will result in cancellation of all upcoming appointments.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setActionModal(false)}>
            Close
          </Button>
          <Button 
            variant="danger" 
            onClick={() => {
              setActionModal(false);
              accountApprove("False", approvalSate);
            }}
          >
            Block
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <CardTitle className="h2">Prescriptions </CardTitle>
              <div className="table-responsive">
                <Table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Sl. No.</th>
                      <th>ID</th>
                      <th>Account type</th>
                      <th>Email</th>
                      <th>Document</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listOfAccounts.map((account, index) => (
                      <tr key={account.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{account.id}</td>
                        <td>{account.is_doctor ? 'Doctor' : account.is_lab ? 'Lab' : account.is_executive ? 'Executive' : 'Other'}</td>
                        <td>{account.email}</td>
                        <td>
                            {account.document_url 
                              ?(<a href={ account.document_url } target="_blank">Document</a>)
                              :(<span>N/A</span>)}<br/>
                        </td>
                        <td>{account.is_active ? 'Approved' : 'Not Approved'}</td>
                        <td>
                          {account.is_active ?
                          <Button 
                            variant='danger' 
                            onClick={() => {
                              setApprovalState(account.id);
                              setActionModal(true);
                            }}
                          >
                          Block
                          </Button>
                          :<Button 
                          gap={3}
                          variant='success' 
                          onClick={() => accountApprove("True", account.id)}
                          >
                          Approve Now
                          </Button>
                          }
                          <Button onClick={()=>{
                              console.log('Staff ID: ',account.id)
                              redirectToChat(account.id);
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
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Staff