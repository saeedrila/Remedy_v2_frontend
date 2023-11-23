import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from 'react-bootstrap'
import {
  CardBody,
  Table,
} from 'reactstrap';
import axios from '../../api/axios';
import Dropzone from "react-dropzone";
import { toast } from 'react-toastify';

// API Endpoints
const GET_ACCOUNT_DETAILS = '/get-lab-account-details'
const UPDATE_ACCOUNT_DETAILS = '/get-lab-account-details'
const LAB_SPECIFIC_TEST ='/get-lab-specific-test'
const LAB_TEST_ADD ='/get-all-lab-tests'
const UPLOAD_DOCUMENT = '/upload-document'

function AccountLab({ triggerFetch }) {
  const [accountDetails, setAccountDetails] = useState([]);
  const [testDetails, setTestDetails] = useState([]);
  const [labSpecificTest, setLabSpecificTest] = useState([]);
  const [newTest, setNewTest] = useState('');
  const [newCost, setNewCost] = useState('');

  // Test and Account Edit modals
  const [changeTestModalShow, setChangeTestModalShow] = useState(false)
  const [accountEditModalShow, setAccountEditModalShow] = useState(false)

  // Document upload related
  const [documentUploadModalShow, setDocumentUploadModalShow] = useState(false);
  const [selectedFiles, setselectedFiles] = useState([]);
  
  const fetchAccountData = async () => {
    try {
      const response = await axios.get(GET_ACCOUNT_DETAILS)
      setAccountDetails(response.data)
      console.log('Account details: ', response.data)
    } catch(error) {
      console.error('Error fetching data', error)
    }
  }
  const fetchLabTestData = async () => {
    try {
      const response = await axios.get(LAB_TEST_ADD);
      setTestDetails(response.data)
      // console.log('Lab Tests: ', response.data)
    } catch(error) {
      console.error('Error fetching data', error)
    }
  }
  const fetchLabSpecificTest = async () => {
    try {
      const response = await axios.get(LAB_SPECIFIC_TEST);
      setLabSpecificTest(response.data)
      // console.log('Lab Tests: ', response.data)
    } catch(error) {
      console.error('Error fetching data', error)
    }
  }
  useEffect(() => {
    fetchAccountData();
    fetchLabTestData();
    fetchLabSpecificTest();
  }, [triggerFetch]);

  // Form data storage
  const [formData, setFormData] = useState({
    fee_per_test: accountDetails.fee_per_test || '',
    experience: accountDetails.experience || '',
    description: accountDetails.description || '',
  })
  // Handle form input data
  const handleInputChangeAccountEdit = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAccountEditSubmit = async () => {
    const updatedData = {};
    for (const[key, value] of Object.entries(formData)) {
      if (value !== '') {
        updatedData[key] = value;
      }
    }
    try {
      await axios.patch(UPDATE_ACCOUNT_DETAILS, updatedData);
      fetchAccountData();
      toast.success('Successfully updated');
      setFormData({
        username: '',
        mobile: '',
        gender: '',
        age: '',
        blood_group: '',
        address: '',
      });
    } catch (error) {
      if (error.response){
        toast.error('Error');
      }
    }
    console.log('Updated data:', updatedData)
    setAccountEditModalShow(false)
  }

  // Test edit modal
  const handleInputChangeTestEdit = (e, fieldName) => {
    const inputValue = e.target.value;
    if (fieldName === 'newTest') {
      setNewTest(inputValue);
    } else if (fieldName === 'newCost') {
      const numericValue = parseInt(inputValue, 10);
      if (!isNaN(numericValue) && numericValue >= 0) {
        setNewCost(numericValue);
      }
    }
  };

  const handleTestEditSubmit = async () => {
    try {
      const response = await axios.post(LAB_TEST_ADD, {
        new_title: newTest,
        new_cost: newCost,
      });
      fetchLabTestData();
      fetchLabSpecificTest();
      if (response.status === 201) {
        setNewTest('');
        setNewCost('');
        setChangeTestModalShow(false);
        toast.success('Successfully created a new test');
      } else if (response.status === 200) {
        setNewTest('');
        setNewCost('');
        setChangeTestModalShow(false);
        toast.success('Test already present');
      } else {
        toast.error('Error creating a new test');
      }
    } catch (error) {
      // Handle network or request-related errors
      console.error('Error:', error);
      // Display an error message to the user
      toast.error('Error creating a new test');
    }
  };

  function handleAcceptedFiles(files) {
    if (files.length > 1) {
      toast.error("Only one file can be uploaded at a time. Please select only one file.");
      return;
    }
    const file = files[0];
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSizeInBytes) {
      toast.error("File size exceeds the maximum allowed (10MB). Please choose a smaller file.");
      return;
    }

    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setselectedFiles(files)
  }
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  const handleDocumentSubmit = async () => {
    try {
      if (selectedFiles.length === 0) {
        return;
      }
      const formData = new FormData();
      formData.append('document', selectedFiles[0]);
  
      const response = await axios.post(UPLOAD_DOCUMENT, formData, {
      });
  
      console.log('Response data: ', response.data)
      setDocumentUploadModalShow(false);
      toast.success('Document uploaded successfully');
      fetchAccountData();
    } catch (error) {
      console.error('Error uploading Document:', error);
      toast.error('An error occurred while uploading document');
    }
  };




  return (
    <>
      {/* Document upload modal */}
      <Modal
        show={documentUploadModalShow}
        onHide={() => setDocumentUploadModalShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Container>
          <Row>
            <Col>
              <Dropzone
                onDrop={acceptedFiles => {
                  handleAcceptedFiles(acceptedFiles)
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="dropzone">
                    <div
                      className="dz-message needsclick mt-2"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <div className="mb-3">
                        <i className="display-4 text-muted bx bxs-cloud-upload" />
                      </div>
                      <h4>Drop files here or click to upload.</h4>
                    </div>
                  </div>
                )}
              </Dropzone>
            </Col>
          </Row>
        </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDocumentUploadModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDocumentSubmit}>Upload</Button>
        </Modal.Footer>
      </Modal>

      {/* Test Edit Modal */}
      <Modal
        show={changeTestModalShow}
        onHide={() => setChangeTestModalShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>Common Tests: </Col>
              <Col>
                {testDetails.length > 0 ? (
                  <ul>
                    {testDetails.map((test, index) => (
                      <li key={index}>{test.test_title}</li>
                    ))}
                  </ul>
                ) : (
                  'No information uploaded'
                )}
              </Col>
            </Row>
            <Row>
              <Col>Add new test to account:</Col>
              <Col>
                <Form.Control 
                  type="text" 
                  placeholder={"Enter test"} 
                  value={newTest}
                  name="newTest"
                  onChange={(e) => handleInputChangeTestEdit(e, 'newTest')}
                />
              </Col>
            </Row>
            <Row>
              <Col>Cost:</Col>
              <Col>
                <Form.Control 
                  type="number"
                  placeholder={"Enter cost"} 
                  value={newCost}
                  name="newCost"
                  onChange={(e) => handleInputChangeTestEdit(e, 'newCost')}
                />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setChangeTestModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleTestEditSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Account Edit Modal */}
      <Modal
        show={accountEditModalShow}
        onHide={() => setAccountEditModalShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Container>
          <Row>
            <Col>Experience</Col>
            <Col>
              <Form.Control 
                type="number" 
                placeholder={accountDetails.experience || "Enter years of experience"}
                pattern="^[0-9]{1,2}$"
                value={formData.experience}
                name="experience"
                onChange={handleInputChangeAccountEdit}
              />
            </Col>
          </Row>
          <Row>
            <Col>Description</Col>
            <Col>
              <Form.Control 
                as="textarea" 
                rows={3}
                placeholder={accountDetails.description || "Description"}
                value={formData.description}
                name="description"
                onChange={handleInputChangeAccountEdit}
              />
            </Col>
          </Row>
        </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAccountEditModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAccountEditSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>


      <div className='small-cards mt-3'>
        <Container>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="table-responsive mt-3">
                    <Table className="table mb-0">
                      <tbody>
                        <tr>
                          <th scope="row">Test</th>
                          <td>{labSpecificTest.length > 0 ? (
                            <ul>
                              {labSpecificTest.map((test, index) => (
                                <li key={index}>
                                  {test.test_title}{' (₹ '}
                                  {test.fee_per_session}{')'}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            'No information uploaded'
                          )}
                          <Button className='m-2' onClick={() => setChangeTestModalShow(true)}>Edit test</Button></td>
                        </tr>
                        <tr>
                          <th scope="row">Document</th>
                          <td>
                            {accountDetails.document_url 
                              ?(<a href={ accountDetails.document_url} target="_blank"  rel="noopener noreferrer" download="document">Document</a>)
                              :(<span>No document uploaded</span>)}<br/>
                          <Button className='m-2' onClick={() => setDocumentUploadModalShow(true)}>Upload Document</Button></td>
                        </tr>
                        <tr>
                          <th scope="row">Experience in years</th>
                          <td>{accountDetails.experience || 'No information uploaded'}</td>
                        </tr>
                        <tr>
                          <th scope="row">Description</th>
                          <td>{accountDetails.description || 'No information uploaded'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
                <Button className='m-4'onClick={() => setAccountEditModalShow(true)}>
                  Edit
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default AccountLab