import React from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import {
  Card,
  Col,
  Row,
  Button,
} from 'react-bootstrap';
import { Container } from 'reactstrap';
import axios from '../../api/axios';

import pic2 from '../../assets/images/medical/blood-test-logo.svg'
import Header from '../Common/Header';
import Footer from '../Common/Footer';



//API Endpoint
const RAZORPAY_ORDER_CREATE = '/razorpay/order/create'
const RAZORPAY_ORDER_COMPLETE = '/razorpay/order/complete'

function LabAppointmentConfirmation() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const lab_email = queryParams.get('email');
  const date = queryParams.get('date');
  const line = queryParams.get('line');
  const time_slot = queryParams.get('time');
  const fee = 500
  
  const complete_order = (paymentID, orderID, signature)=>{
    axios({
      method: 'post',
      url: RAZORPAY_ORDER_COMPLETE,
      data: {
        "payment_id": paymentID,
        "order_id": orderID,
        "signature": signature,
        "amount": fee
      },
    })
    .then((response)=>{
      console.log(response.data);
    })
    .catch((error)=>{
        console.log(error.response.data);
    })
}

  const handleProceedToPaymentClick = () => {
    axios({
      method: 'post',
      url: RAZORPAY_ORDER_CREATE,
      data: {
        amount: fee,
        currency: "INR",
        lab_email: lab_email,
        date: date,
        line: line,
        time_slot: time_slot,
      },
    }
  )
  .then((response)=>{
    // get order id
    const order_id = response.data.id
    
    // handle payment
    const options = {
      key: 'rzp_test_mQAMplAzeJefDh',
      name: "Remedy",
      description: "Test Transaction",
      order_id: order_id,
      handler: function (response) {
        //complete order
        complete_order(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature
        )
        // Navigate from here.
        const url = `/payment-confirmation/?orderId=${order_id}`
        navigate(url)
      },
      prefill: {
        name: "Customer",
        email: "customer@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      console.log(response.error);
    });
    rzp1.open();
  })
  .catch((error)=>{
    console.log(error);
    })
  }


  return (
    <>
      {/* Header section */}
      <Header />
      <Container>
        <div className="big-card-container">
          <Row xs={1} sm={2} md={3} className="g-4 justify-content-center mt-3">
            <Col>
              <Card className="border">
                <Card.Img variant="top" src={pic2} />
                <Card.Body>
                  <Card.Title className="justify-content-center" >Lab: {lab_email}</Card.Title>
                  <Card.Title className="justify-content-center" >₹ {fee}</Card.Title>
                  <Card.Title className="justify-content-center" >Date: {date}</Card.Title>
                  <Card.Title className="justify-content-center" >Mode: {line}</Card.Title>
                  <Card.Title className="justify-content-center" >Time: {time_slot}</Card.Title>
                  <Button variant="success" 
                    className="mt-3" 
                    onClick={() => 
                    handleProceedToPaymentClick()}>
                      Proceed to payment
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Footer section */}
      <Footer />
    </>
  )
}

export default LabAppointmentConfirmation