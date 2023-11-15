import { React, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  Card,
  Col,
  Row,
} from 'react-bootstrap';
import axios from '../api/axios'

// Components
import Header from './Common/Header'
import Footer from './Common/Footer'
// Picture
import pic2 from '../assets/images/medical/blood-test-logo.svg'

// API Endpoints
const GET_ALL_LAB_TESTS ='/get-all-lab-tests'

function LabTests() {
  const [labTests, setLabTests] = useState([]);
  const navigate = useNavigate();

  const fetchDoctorSpecializationData = async () => {
    try {
      const response = await axios.get(GET_ALL_LAB_TESTS, {
      })
      const updatedTests = response.data.map(item => ({
        ...item,
        img: pic2
      }));
      setLabTests(updatedTests)
      console.log('Doctors specializations: ', updatedTests)
    } catch(error) {
      console.error('Error fetching data', error)
    }
  }
  useEffect(() => {
    fetchDoctorSpecializationData();
  }, []);


  return (
    <>
      {/* Header section */}
      <Header />

      <Container>
        <div className="big-card-container">
          <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center mt-3">
            {labTests.map((data, idx) => (
              <Col key={idx}>
                <Card className="border" 
                  onClick={() => {
                    const title = data.test_title.replace(/ /g, '-');
                    navigate(`/lab-at-test/${title}`)
                  }}
                >
                  <Card.Img variant="top" src={data.img} />
                  <Card.Body>
                    <Card.Title className="justify-content-center" >{data.test_title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      {/* Footer section */}
      <Footer />
    </>
  )
}

export default LabTests