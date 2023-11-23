import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import axios from "../../api/axios";
import moment from 'moment';

import Header from "./Header";
import Footer from "./Footer";

// Socket message API endpoint
const MESSAGE_API = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_WS_MESSAGE_API_PROD
  : process.env.REACT_APP_WS_MESSAGE_API_DEV;
const GET_MY_INBOX_URL = '/my-messages/'
const GET_DETAILED_MESSAGES = '/get-messages/'
const AWS_PUBLIC_URL = 'https://remedy-development.s3.ap-south-1.amazonaws.com'
const AWS_GENERIC_PROFILE = 'https://remedy-development.s3.ap-south-1.amazonaws.com/media/profile_pic/avatar-1.png'

function Chat() {
  const scrollRef = useRef(null);
  const [inbox, setInbox] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Getting user_id from accessToken
  const accessToken = localStorage.getItem('accessToken');
  const decoded = jwtDecode(accessToken)
  const user_id = decoded.user_id

  const [myProfile, setMyProfile] = useState({});
  const [secondPersonProfile, setSecondPersonProfile] = useState({});

  // Web socket related
  const [websocket, setWebsocket] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState('');


  const getInbox = async() => {
    try{
      const response = await axios.get(
        GET_MY_INBOX_URL + user_id,
        {headers:{'Content-Type': 'application/json'}},
        {withCredentials: true}
      );
      setInbox(response.data)
      console.log('Inbox data: ', response.data)
    } catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    getInbox();
  }, [])

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollRef.current) {
      const container = scrollRef.current._container;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const establishConnection = (roomId) =>{
    const client = new W3CWebSocket(`${MESSAGE_API}${roomId}/`);
    console.log("WebSocketComponent mounted");

    client.onopen = () => {
      console.log("WebSocket Client Connected");
      setWebsocket(client); // Update the WebSocket instance in state
    };

    client.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log("WebSocket Client Message received: ", dataFromServer);
    
      if (dataFromServer) {
        // Check if the message with the same ID already exists
        const isMessageExists = messages.some(
          (messages) => messages.id === dataFromServer.id
        );
    
        if (!isMessageExists) {
          setMessages((messages) => [
            ...messages,
            {
              id: dataFromServer.id, // Assuming each message has a unique identifier
              message: dataFromServer.message,
              sender_profile: dataFromServer.sender === myProfile.id
                ? myProfile
                : secondPersonProfile,
              receiver_profile: dataFromServer.sender === myProfile.id
                ? secondPersonProfile
                : myProfile,
            },
          ]);
        }
      }
      console.log('Message after WS receiving: ', messages)
    };    
  }

  // Cleanup the WebSocket connection on component unmount
  useEffect(() => {
    return () => {
      if (websocket && websocket.readyState === websocket.OPEN) {
        websocket.close();
      }
    };
  }, [currentRoomId]);

  const sendMessageOnWS = (e) => {
    e.preventDefault();
    console.log("WebSocket Message sent");
    if (
      websocket &&
      websocket.readyState === websocket.OPEN &&
      newMessage.trim() !== ""
    ) {
      // Ensure the sender's profile is set correctly
      const senderProfile = myProfile || {}; // Fallback to an empty object if myProfile is not set
  
      websocket.send(
        JSON.stringify({
          type: "message",
          text: newMessage,
          sender: senderProfile.id,
          reciever: secondPersonProfile.id,
        })
      );
      setNewMessage("");
    }
  };
  
  

  const getDetailedMessages = async (messageSenderId, messageRecieverId) =>{
    try{
      const response = await axios.get(
        GET_DETAILED_MESSAGES + messageSenderId + '/' + messageRecieverId,
        {headers:{'Content-Type': 'application/json'}},
        {withCredentials: true}
      )
      console.log('Detailed message data: ', response.data)
      setMessages(response.data)
    } catch (error){
      console.log(error);
    }
  }


  const getProfilePicUrl = (user) => (
    user.profile_pic_url !== null ? `${AWS_PUBLIC_URL}/${user.profile_pic_url}` : AWS_GENERIC_PROFILE
  );
  const getUsername = (user) => (user.username !== "" ? user.username : user.email);
  
  //Use For Chat Box
  const userChatOpen = (roomId, messageSender, messageReciever) => {
    setCurrentRoomId(roomId);
    getDetailedMessages(messageSender.id, messageReciever.id);
    establishConnection(roomId);
    if (user_id === messageSender.id) {
      setMyProfile(messageSender);
      setSecondPersonProfile(messageReciever);
    } else {
      setMyProfile(messageReciever);
      setSecondPersonProfile(messageSender);
    }
  };

  return (
    <>
      {/* Header section */}
      <Header />

      <div className="page-content">
        <Container>
          <Row>
            <Col lg="12">
            {inbox.length > 0?
              <div className="d-lg-flex">
                
                <div className="chat-leftsidebar me-lg-4">
                  <div>
                    <div className="chat-leftsidebar-nav">
                      <TabContent className="py-4">
                        <TabPane>
                          <div>
                            <h5 className="font-size-14 mb-3">Recent Chats</h5>
                            <ul className="list-unstyled chat-list" id="recent-list">
                              <PerfectScrollbar 
                                style={{ height: "410px" }}
                              >
                                {inbox.map((message, idx) => (
                                  <li
                                    key={idx}
                                    className={
                                      currentRoomId === idx
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    <Link
                                      to="#"
                                      onClick={() => {
                                        userChatOpen(
                                          message.room,
                                          message.sender_profile,
                                          message.reciever_profile,
                                        );
                                      }}
                                    >
                                      <div className="d-flex mb-1">
                                        <div className={message.sender_profile.id !== user_id ? "avatar-xs align-self-center me-3" : "align-self-center me-3"}>
                                          <img
                                            src={secondPersonProfile ? getProfilePicUrl(message.sender_profile?.id !== user_id ? message.sender_profile : message.reciever_profile) : ''}
                                            className="rounded-circle avatar-xs"
                                            alt=""
                                          />
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                          <h5 className="text-truncate font-size-14 mb-1">
                                            {getUsername(message.sender_profile.id !== user_id ? message.sender_profile : message.reciever_profile)}
                                          </h5>
                                          <p className="text-truncate mb-0">
                                            {message.message}
                                          </p>
                                        </div>
                                        <div className="font-size-11">
                                          {moment.utc(message.date).local().startOf('seconds').fromNow()}
                                        </div>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </PerfectScrollbar>
                            </ul>
                          </div>
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                </div>
                { currentRoomId ? 
                <div className="w-100 user-chat">
                  <Card>
                    <div className="p-4 border-bottom ">
                      <Row>
                        <Col md={4} xs={9} className="d-flex align-items-center">
                          <div className="avatar-xs me-3">
                            <img
                              src={getProfilePicUrl(secondPersonProfile)}
                              className="rounded-circle avatar-xs"
                              alt=""
                            />
                          </div>
                          <h5 className="font-size-15 mb-1">
                            {getUsername(secondPersonProfile)}
                          </h5>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <div className="chat-conversation p-3">
                        <ul className="list-unstyled">
                          <PerfectScrollbar 
                            ref={scrollRef}
                            style={{ height: "300px" }}
                          >
                            {messages.map((message, index) => {
                              const isMyMessage = message.sender_profile.id === user_id;
                              const messageClass = isMyMessage ? 'right' : '';
                              return (
                                <li key={index}className={`${messageClass}`}>
                                  <div className="conversation-list">
                                    <div className="ctext-wrap">
                                      <div className="conversation-name">
                                      { getUsername(message.sender_profile.id === user_id ? myProfile: secondPersonProfile) }
                                      </div>
                                      <p>{message.message}</p>
                                      <p className="chat-time mb-0">
                                        <i className="bx bx-time-five align-middle me-1"></i> 
                                        {moment.utc(message.date).local().startOf('seconds').fromNow()}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </PerfectScrollbar>
                        </ul>
                      </div>
                      <div className="p-3 chat-input-section">
                        <form onSubmit={sendMessageOnWS}>
                          <Row>
                            <Col>
                              <div className="position-relative">
                                <input
                                  type="text"
                                  className="form-control chat-input"
                                  placeholder="Enter Message..."
                                  value={newMessage}
                                  onChange={e => setNewMessage(e.target.value)}
                                />
                              </div>
                            </Col>
                            <Col className="col-auto">
                              <Button
                                type="submit"
                                color="primary"
                                className="btn btn-primary btn-rounded chat-send w-md "
                              >
                                <span className="d-none d-sm-inline-block me-2">
                                  Send
                                </span>{" "}
                                <i className="mdi mdi-send" />
                              </Button>
                            </Col>
                          </Row>
                        </form>
                      </div>
                    </div>
                  </Card>
                </div>
                :<div>
                  Select a chat
                </div>
                }
              </div>
              :<h3>There are no conversation to show</h3> 
              }
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer section */}
      <Footer />
    </>
  );
}

export default Chat;
