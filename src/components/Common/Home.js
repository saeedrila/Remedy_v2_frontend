import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col,
  Card, 
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'

import Footer from './Footer'
import Header from './Header'

import pic1 from '../../assets/images/medical/medical-prescription-logo.svg'
import pic2 from '../../assets/images/medical/blood-test-logo.svg'

// API Endpoints
const DOCTOR_SPECIALIZATION_FOR_HOME ='/doctor-specialization-for-home'
const LAB_TESTS_FOR_HOME ='/lab-tests-for-home'

function Home() {
  document.title = 'Remedy Home'
  const navigate = useNavigate();
  const [specializationDetails, setSpecializationDetails] = useState([]);
  const [testDetails, setTestDetails] = useState([]);

  const fetchDoctorSpecializationData = async () => {
    try {
      const response = await axios.get(DOCTOR_SPECIALIZATION_FOR_HOME, {
      })
      const updatedSpecializations = response.data.map(item => ({
        ...item,
        img: pic1
      }));
      setSpecializationDetails(updatedSpecializations)
      // console.log('Specialization: ',updatedSpecializations);
    } catch(error) {
      console.error('Error fetching data', error)
    }
  }
  const fetchLabTestData = async () => {
    try {
      const response = await axios.get(LAB_TESTS_FOR_HOME, {
      })
      const updatedTests = response.data.map(item => ({
        ...item,
        img: pic2
      }));
      setTestDetails(updatedTests)
      // console.log('Tests : ',updatedTests);
    } catch(error) {
      console.error('Error fetching data', error)
    }
  }

  useEffect(() => {
    fetchDoctorSpecializationData();
    fetchLabTestData();
  }, []);

  

  return (
    <>
      {/* Header section */}
      <Header />

      {/* Top big cards */}
      <Container>
        <div className="big-card-container">
          <Row xs={1} md={3} lg={4} className="g-4 justify-content-center mt-3">
            <Col>
              <Link to="/doctor-at-specialization">
                <Card>
                  <Card.Img variant="top" src={pic1} />
                  <Card.Body>
                    <Card.Title className="justify-content-center hand-cursor" >Book a consultation with Doctor now</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col>
              <Link to="/lab-tests">
                <Card>
                  <Card.Img variant="top" src={pic2} />
                  <Card.Body>
                    <Card.Title className="justify-content-center hand-cursor" >Book a Laboratory appointment now</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        </div>
      </Container>
      
      {/* Doctor specialties selection */}
      <div className="small-cards mt-3">
        <Container>
          <Row>
            <Col className='mt-3'>
              <div className="card-title">Quick selection: </div>
            </Col>
            <Col className='text-end mt-3'>
              <Link to="/doctor-at-specialization" className="card-title">All specialties &gt;</Link>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="big-card-container">
                <Row xs={2} sm={3} md={4} lg={5} className="g-4 justify-content-center mt-3">
                  {specializationDetails.map((data, idx) => (
                    <Col key={idx}>
                      <Card className="border text-center hand-cursor"
                        onClick={() => {
                          const title = data.specialization_title.replace(/ /g, '-');
                          navigate(`/lab-at-test/${title}`)
                        }}
                      >
                        <Card.Img variant="top" src={data.img} />
                        <Card.Body>
                          <Card.Title>{data.specialization_title}</Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Lab tests selection */}
      <div className="small-cards mt-3">
        <Container>
          <Row>
            <Col className='mt-3'>
              <div className="card-title">Quick selection: </div>
            </Col>
            <Col className='text-end mt-3'>
              <Link to="/lab-tests" className="card-title">All lab tests &gt;</Link>
            </Col>
          </Row>
          <Row>
            <Col>
            <div className="big-card-container">
                <Row xs={2} sm={3} md={4} lg={5} className="g-4 justify-content-center mt-3">
                  {testDetails.map((data, idx) => (
                    <Col key={idx}>
                      <Card className="border text-center hand-cursor"
                        onClick={() => {
                          const title = data.test_title.replace(/ /g, '-');
                          navigate(`/doctor-at-specialization/${title}`)
                        }}
                      >
                        <Card.Img variant="top" src={data.img} />
                        <Card.Body>
                          <Card.Title>{data.test_title}</Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* Footer section */}
      <Footer />
    </>
  )
}

export default Home