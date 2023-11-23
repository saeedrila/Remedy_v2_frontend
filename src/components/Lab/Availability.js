import React, { useState, useEffect } from 'react'
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import {
  Button,
  Row,
  Col,
  Card,
  Table,
} from 'react-bootstrap'
import {
  CardTitle,
  CardBody,
} from 'reactstrap'
import { format, addDays } from 'date-fns';

// API Endpoint
const LAB_AVAILABILITY_GET_URL = 'lab-availability-get-url'
const LAB_AVAILABILITY_TOGGLE_URL = 'lab-availability-get-url'


function Availability({ triggerFetch }) {
  document.title = 'Doctor Dashboard || Availability'
  const [slotsAvailable, setSlotsAvailable] = useState({
    dayZeroOfflineSlots: {},
    dayZeroOnlineSlots: {},
    dayOneOfflineSlots: {},
    dayOneOnlineSlots: {},
    dayTwoOfflineSlots: {},
    dayTwoOnlineSlots: {},
    dayThreeOfflineSlots: {},
    dayThreeOnlineSlots: {},
  });


  const getSlotsAvailable = async () => {
    try {
      const response = await axios.get(LAB_AVAILABILITY_GET_URL);
      
      setSlotsAvailable({
        dayZeroOfflineSlots: response.data[0].slots_details_offline,
        dayZeroOnlineSlots: response.data[0].slots_details_online,

        dayOneOfflineSlots: response.data[1].slots_details_offline,
        dayOneOnlineSlots: response.data[1].slots_details_online,

        dayTwoOfflineSlots: response.data[2].slots_details_offline,
        dayTwoOnlineSlots: response.data[2].slots_details_online,

        dayThreeOfflineSlots: response.data[3].slots_details_offline,
        dayThreeOnlineSlots: response.data[3].slots_details_online,
      });
      // console.log('Response.data: ', response.data)
      // console.log('Get slots available Try completed')
      // console.log('slotsAvailable updated:', slotsAvailable);
      // console.log('Day zero offline slots:', slotsAvailable.dayZeroOfflineSlots);
    } catch(error) {
      console.log('Get slots available Catch completed')
    }
  }

  const toggleAvailability = async (status, slot_id, date, line, time) => {
    console.log('Status: ', status, 'Slot_id: ', slot_id, 'Date: ', date, 'Time: ', time, 'Line: ', line);
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.patch(LAB_AVAILABILITY_TOGGLE_URL, {
        status: status,
        slot_id: slot_id,
        date: date,
        line: line,
        time: time,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const successMessage = `Date: ${date}, Time: ${time}, Successfully updated to: ${status === 'True' ? 'Available for booking' : 'Not available'}`;
      toast.success(successMessage);
      getSlotsAvailable();
    } catch(error) {
      toast.error(error);
    }
  }

  useEffect(() => {
    getSlotsAvailable();
    // console.log('slotsAvailable updated from useEffect:', slotsAvailable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerFetch])

  // Today's date
  const currentDate = new Date();
  const formattedTodaysDate = format(currentDate, 'yyyy-MM-dd');
  // Tomorrow's date
  const tomorrowDate = addDays(currentDate, 1);
  const formattedTomorrowDate = format(tomorrowDate, 'yyyy-MM-dd');
  // Day after tomorrow's date
  const dayAfterTomorrowDate = addDays(currentDate, 2);
  const formattedDayAfterTomorrowDate = format(dayAfterTomorrowDate, 'yyyy-MM-dd');
  // Second day after tomorrow's date
  const secondDayAfterTomorrowDate = addDays(currentDate, 3);
  const formattedSecondDayAfterTomorrowDate = format(secondDayAfterTomorrowDate, 'yyyy-MM-dd');



  return (
    <>
      {/* DayZero */}
      <Row>
        <Col sm={6}>
          <Card>
            <CardTitle className='text-center'>
            Today: {formattedTodaysDate} (Offline)
            </CardTitle>
            <CardBody>
              <Table className="table mb-0">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(slotsAvailable.dayZeroOfflineSlots).map((slotKey) => {
                    const slot = slotsAvailable.dayZeroOfflineSlots[slotKey];
                    return (
                      <tr key={slotKey}>
                        <td>{slot.time}</td>
                        <td>{slot.status === 'notAvailable' 
                          ? 'Not available to public' 
                          : slot.status === 'available' 
                            ? 'Available to public'
                            : 'Booked'}
                        </td>
                        <td>
                          {slot.status === 'notAvailable' ? (
                            <Button 
                              className='btn-success' 
                              onClick={() => 
                                toggleAvailability("True", slotKey, formattedTodaysDate, 
                                  'offline', slot.time)
                              }
                            >
                              Approve Now
                            </Button>
                          ) : (slot.status === 'available' ? (
                            <Button 
                              className='btn-danger' 
                              onClick={() => 
                              toggleAvailability("False", slotKey, formattedTodaysDate, 
                                'offline', slot.time)
                              }
                            >
                              Block
                            </Button>
                          ) : (<Button disabled> Reserved </Button>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      

      {/* DayOne */}
      
        
        <Col sm={6}>
          <Card>
            <CardTitle className='text-center'>
              Tomorrow: {formattedTomorrowDate} (Offline)
            </CardTitle>
            <CardBody>
              <Table className="table mb-0">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(slotsAvailable.dayOneOfflineSlots).map((slotKey) => {
                    const slot = slotsAvailable.dayOneOfflineSlots[slotKey];
                    return (
                      <tr key={slotKey}>
                        <td>{slot.time}</td>
                        <td>{slot.status === 'notAvailable' ? 'Not available to public' : slot.status === 'available' ? 'Available to public': 'Booked'}</td>
                        <td>
                          {slot.status === 'notAvailable' ? (
                            <Button className='btn-success' onClick={() => toggleAvailability("True", slotKey, formattedTomorrowDate, 'offline', slot.time)}>
                              Approve Now
                            </Button>
                          ) : (slot.status === 'available' ? (
                            <Button className='btn-danger' onClick={() => toggleAvailability("False", slotKey, formattedTomorrowDate, 'offline', slot.time)}>
                              Block
                            </Button>
                          ) : (<Button disabled> Reserved </Button>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      

      {/* DayTwo */}
      
        
        <Col sm={6}>
          <Card>
            <CardTitle className='text-center'>
            Day after Tomorrow: {formattedDayAfterTomorrowDate} (Offline)
            </CardTitle>
            <CardBody>
              <Table className="table mb-0">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(slotsAvailable.dayTwoOfflineSlots).map((slotKey) => {
                    const slot = slotsAvailable.dayTwoOfflineSlots[slotKey];
                    return (
                      <tr key={slotKey}>
                        <td>{slot.time}</td>
                        <td>{slot.status === 'notAvailable' ? 'Not available to public' : slot.status === 'available' ? 'Available to public': 'Booked'}</td>
                        <td>
                          {slot.status === 'notAvailable' ? (
                            <Button 
                              className='btn-success' 
                              onClick={() => 
                                toggleAvailability("True", slotKey, formattedDayAfterTomorrowDate, 
                                  'offline', slot.time)
                              }
                            >
                              Approve Now
                            </Button>
                          ) : (slot.status === 'available' ? (
                            <Button 
                              className='btn-danger' 
                              onClick={() => 
                                toggleAvailability("False", slotKey, formattedDayAfterTomorrowDate, 
                                  'offline', slot.time)
                              }
                            >
                              Block
                            </Button>
                          ) : (<Button disabled> Reserved </Button>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      

      {/* DayThree */}
        <Col sm={6}>
          <Card>
            <CardTitle className='text-center'>
              2nd day after Tomorrow: {formattedSecondDayAfterTomorrowDate} (Offline)
            </CardTitle>
            <CardBody>
              <Table className="table mb-0">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(slotsAvailable.dayThreeOfflineSlots).map((slotKey) => {
                    const slot = slotsAvailable.dayThreeOfflineSlots[slotKey];
                    return (
                      <tr key={slotKey}>
                        <td>{slot.time}</td>
                        <td>{slot.status === 'notAvailable' ? 'Not available to public' : slot.status === 'available' ? 'Available to public': 'Booked'}</td>
                        <td>
                          {slot.status === 'notAvailable' ? (
                            <Button className='btn-success' onClick={() => toggleAvailability("True", slotKey, formattedSecondDayAfterTomorrowDate, 'offline', slot.time)}>
                              Approve Now
                            </Button>
                          ) : (slot.status === 'available' ? (
                            <Button className='btn-danger' onClick={() => toggleAvailability("False", slotKey, formattedSecondDayAfterTomorrowDate, 'offline', slot.time)}>
                              Block
                            </Button>
                          ) : (<Button disabled> Reserved </Button>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Availability