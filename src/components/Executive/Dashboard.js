import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
} from 'react-bootstrap'
import {
  CardBody,
  CardTitle,
  CardText,
  Progress
} from 'reactstrap'
import axiosPrivate from '../../api/axios'

// API endpoint
const FETCH_DASHBOARD_DATA = '/fetch-executive-dashboard-data'


function Dashboard({ triggerFetch }) {
  const [executiveDashboardData, setExecutiveDashboardData] = useState('')

  const fetchExecutiveDashboardData = async ()=>{
    try{
      const response = await axiosPrivate.get(FETCH_DASHBOARD_DATA);
      setExecutiveDashboardData(response.data)
      // console.log('Dashboard console', response.data)
    } catch (error){
      console.error('Error fetching data', error)
    }
  }
  useEffect(()=> {
    fetchExecutiveDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerFetch])

  return (
    <>
      <Container>
        <Row>
          <Col lg={6}>
            <Card>
              <Row className="no-gutters align-items-center">
                <Col md={10}>
                  <CardBody>
                    <CardTitle>Total appointments catered</CardTitle>
                    <CardText>
                      {executiveDashboardData.total_appointments_catered}
                    </CardText>
                  </CardBody>
                </Col>
                <Col md={2}>
                <i className="bx bx-notepad fa-4x"></i>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <Row className="no-gutters align-items-center">
                <Col md={10}>
                  <CardBody>
                    <CardTitle>Revenue in last week</CardTitle>
                    <CardText>
                    ₹ {executiveDashboardData.total_platform_fee_last_week}
                    </CardText>
                  </CardBody>
                </Col>
                <Col md={2}>
                <i className="bx bx-wallet fa-4x"></i>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col mg={6}>
            <Card>
              <CardBody>
                <CardTitle className="mt-0">Today's Appointments</CardTitle>
                <Row className='justify-content-center align-items-center'>
                  <Col sm={3} className='text-center'>
                    <i className="bx bx-notepad fa-4x"></i>
                  </Col>
                </Row>
                <CardText>
                  <Container>
                  <Row>
                    <Col sm={6} className='text-center'>
                    <p>
                      Total:
                    </p>
                    </Col>
                    <Col sm={6} className='text-center'>
                      Completion:
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6} className='text-center fs-4'>
                    <p>
                    {executiveDashboardData.total_appointments_today}
                    </p>
                    </Col>
                    <Col sm={6} className='text-center fs-4'>
                    {executiveDashboardData.total_appointments_today_completed}/
                    {executiveDashboardData.total_appointments_today}
                    </Col>
                  </Row>
                  </Container>

                </CardText>
              </CardBody>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <p>Overall</p>
                  <div >
                    <Progress
                      value={executiveDashboardData.total_appointment_today_completed_perc}
                      color="primary"
                      style={{ width: '100%' }}
                      animated
                    ></Progress>
                  </div>
                </li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Dashboard