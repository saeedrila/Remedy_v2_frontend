import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Card,
  Table,
} from 'react-bootstrap'
import {
  CardBody,
  CardTitle,
} from 'reactstrap'
import axios from '../../api/axios'

const FETCH_PAYMENTS = '/fetch-lab-payments'

function Payments({ triggerFetch }) {
  const [labPaymentList, setLabPaymentList] = useState([])
    // Fetch payments list
    const fetchLabPaymentList = async ()=>{
      try{
        const response = await axios.get(FETCH_PAYMENTS);
        setLabPaymentList(response.data)
        console.log('Payments API called')
      } catch (error){
        console.error('Error fetching data', error)
      }
    }
    useEffect(()=> {
      fetchLabPaymentList();
    }, [triggerFetch])


  return (
    <>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <CardTitle className="h2">Payment </CardTitle>
              {labPaymentList.length > 0? 
              <div className="table-responsive">
                <Table className="table mb-0">
                  <thead>
                  <tr>
                      <th>Sl. No.</th>
                      <th>Appointment ID</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Platform fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labPaymentList.map((payment, index)=>(
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{payment.appointment}</td>
                      <td>{payment.date}</td>
                      <td>₹{payment.staff_payment}</td>
                      <td>₹{payment.platform_fee}</td>
                    </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              :<h2>No Payment data to show</h2>
              }
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Payments