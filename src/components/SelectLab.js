import  React, { useState } from 'react';
import { 
  Container,
  Card,
  Col,
  Row,
  Button,
  Nav,
} from 'react-bootstrap';
import { format, addDays } from 'date-fns';

import Header from './Common/Header'
import Footer from './Common/Footer'

import pic1 from '../assets/images/medical/blood-test-logo.svg'
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';

// Get list of labs for the selected test
const LABS_OF_SELECTED_TEST_PER_DAY = '/fetch-per-day-availability-of-lab/'


function SelectLab() {
  const { test_title } = useParams();

  // Today's date
  const currentDate = new Date();
  const dayZeroDate = format(currentDate, 'yyyy-MM-dd');
  // Tomorrow's date
  const tomorrowDate = addDays(currentDate, 1);
  const dayOneDate = format(tomorrowDate, 'yyyy-MM-dd');
  // Day after tomorrow's date
  const dayAfterTomorrowDate = addDays(currentDate, 2);
  const dayTwoDate = format(dayAfterTomorrowDate, 'yyyy-MM-dd');
  // Second day after tomorrow's date
  const secondDayAfterTomorrowDate = addDays(currentDate, 3);
  const dayThreeDate = format(secondDayAfterTomorrowDate, 'yyyy-MM-dd');

  const [selectedLines, setSelectedLines] = useState([]);
  const [daySelection, setDaySelection] = useState(dayZeroDate);
  const [currentDayData, setCurrentDayData] =useState([]);
  const [proceedButtonData, setProceedButtonData] = useState([]);

  const navigate = useNavigate();


  const fetchDayDetails = async (requiredDate) => {
    try {
      console.log('Entered fetchDayDetails')
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(LABS_OF_SELECTED_TEST_PER_DAY, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          title: test_title,
          date: requiredDate,
        },
      });
      const updatedSpecializations = response.data.map(item => ({
        ...item,
        img: pic1
      }));
      console.log('Day data: ',updatedSpecializations)

      if (requiredDate === dayZeroDate) {
        setCurrentDayData(updatedSpecializations)
      } else if (requiredDate === dayOneDate) {
        setCurrentDayData(updatedSpecializations)
      } else if (requiredDate === dayTwoDate) {
        setCurrentDayData(updatedSpecializations)
      } else {
        setCurrentDayData(updatedSpecializations)
      }
      // console.log('Date: ', requiredDate)
      // console.log('Labs list of selected ID: ', updatedSpecializations)

      changeProceedButtonData();
    } catch (error){
      console.error('Error fetching data', error)
    }
  }


  const changeProceedButtonData = () =>{
    setProceedButtonData(Array(currentDayData.length).fill({
      email: null,
      date: null,
      line: null,
      time: null,
    }));
  }



  const handleProceedClick = (proceedDataEmail, proceedDataDate, proceedDataLine, proceedDataTime) => {
    const url = `/lab-at-test/lab-appointment-confirmation?email=${proceedDataEmail}&date=${proceedDataDate}&line=${proceedDataLine}&time=${proceedDataTime}`;
    navigate(url);
  };

  const handleTimingClick = (selectedTime, selectedDate, selectedLine, selectedEmail, cardIndex) => {
    console.log(`Selected Email: ${selectedEmail} Date: ${selectedDate}, Line: ${selectedLine}, Time: ${selectedTime}`);
    const newProceedButtonData = [...proceedButtonData];
    newProceedButtonData[cardIndex] = {
      email: selectedEmail,
      date: selectedDate,
      line: selectedLine,
      time: selectedTime,
    };
    setProceedButtonData(newProceedButtonData);
  };
  
  console.log('Rendering component');

  return (
    <>
      {/* Header section */}
      <Header />

      <Container className="text-center">
        <Button 
          variant={daySelection === dayZeroDate?'success':'secondary'} 
          className='m-2'
          onClick={()=> {
            setDaySelection(dayZeroDate);
            fetchDayDetails(dayZeroDate);
          }}
        >
          {dayZeroDate}
        </Button>
        <Button 
          variant={daySelection === dayOneDate?'success':'secondary'} 
          className='m-2'
          onClick={()=> {
            setDaySelection(dayOneDate);
            fetchDayDetails(dayOneDate);
          }}
        >
          {dayOneDate}
        </Button>
        <Button 
          variant={daySelection === dayTwoDate?'success':'secondary'} 
          className='m-2'
          onClick={()=> {
            setDaySelection(dayTwoDate);
            fetchDayDetails(dayTwoDate);
          }}
        >
          {dayTwoDate}
        </Button>
        <Button 
          variant={daySelection ===dayThreeDate?'success':'secondary'}  
          className='m-2'
          onClick={()=> {
            setDaySelection(dayThreeDate);
            fetchDayDetails(dayThreeDate);
          }}
        >
          {dayThreeDate}
        </Button>
      </Container>

      <Container>
        <div className="big-card-container">
          <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center mt-1">
            {currentDayData.some((lab) => {
              const hasOnlineSessions = lab.online && lab.online.length > 0;
              const hasOfflineSessions = lab.offline && lab.offline.length > 0;
              return hasOnlineSessions || hasOfflineSessions;
            }) ? (
              currentDayData.map((lab, cardIndex) => {
                const hasOnlineSessions = lab.online && lab.online.length > 0;
                const hasOfflineSessions = lab.offline && lab.offline.length > 0;

                // Check if either 'online' or 'offline' has sessions to display the card
                if (hasOnlineSessions || hasOfflineSessions) {
                  return (
                    <Col key={lab.email}>
                      <Card className="border">
                        <Card.Img variant="top" src={lab.img} />
                        <Card.Body>
                          <Card.Title className="justify-content-center">{lab.email}</Card.Title>
                          <Nav variant="tabs">
                            <Nav.Item>
                              <Nav.Link
                                onClick={() => {
                                  const updatedSelectedLines = [...selectedLines];
                                  updatedSelectedLines[cardIndex] = 'offline';
                                  setSelectedLines(updatedSelectedLines);
                                }}            
                                active={selectedLines[cardIndex] === 'offline'}
                                className={selectedLines[cardIndex] === 'offline' ? 'selected' : ''}
                              >
                                At Lab
                              </Nav.Link>
                            </Nav.Item>
                            {/* <Nav.Item>
                              <Nav.Link
                                onClick={() => {
                                  const updatedSelectedLines = [...selectedLines];
                                  updatedSelectedLines[cardIndex] = 'online';
                                  setSelectedLines(updatedSelectedLines);
                                }}
                                active={selectedLines[cardIndex] === 'online'}
                                className={selectedLines[cardIndex] === 'online' ? 'selected' : ''}
                              >
                                Online
                              </Nav.Link>
                            </Nav.Item> */}
                          </Nav>
                          <div className="mt-3">
                            {lab[selectedLines[cardIndex]] && lab[selectedLines[cardIndex]].length > 0 ? (
                              lab[selectedLines[cardIndex]].map((session, index) => (
                                <div key={index}>
                                  {session.timings.map((timing, timeIndex) => (
                                    <Button 
                                      key={timeIndex} 
                                      className='m-1'
                                      onClick={() => handleTimingClick(timing, daySelection, selectedLines[cardIndex], lab.email, cardIndex)}
                                    >
                                      {timing}
                                    </Button>
                                  ))}
                                </div>
                              ))
                            ) : (
                              <p>Press 'At Lab' to update appointment availability</p>
                            )}
                            {proceedButtonData[cardIndex]?.time ? (
                              <Button
                                variant="success"
                                className="mt-3"
                                onClick={() => handleProceedClick(
                                  proceedButtonData[cardIndex]?.email, 
                                  proceedButtonData[cardIndex]?.date,
                                  proceedButtonData[cardIndex]?.line,
                                  proceedButtonData[cardIndex]?.time,
                                )}
                              >
                                Proceed with: {proceedButtonData[cardIndex]?.time}
                              </Button>
                            ) : null}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                } else {
                  return null;
                }
              })
            ):(
              <div>
                There are no labs available for the day.
              </div>
            )}
          </Row>
        </div>
      </Container>

      {/* Footer section */}
      <Footer />
    </>
  )
}

export default SelectLab