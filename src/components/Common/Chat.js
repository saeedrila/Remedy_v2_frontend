import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
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

// Message API endpoint
// const MESSAGE_API = 'http://127.0.0.1:8000/api/chat'
const GET_MY_INBOX_URL = '/my-messages/'
const SEND_MESSAGE_URL = '/send-messages'
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


  const [chatBoxUsername, setChatBoxUsername] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState('');
  const [otherPersonId, setOtherPersonId] = useState('');

  const getInbox = async() => {
    try{
      const response = await axios.get(
        GET_MY_INBOX_URL + user_id,
        {headers:{'Content-Type': 'application/json'}},
        {withCredentials: true}
      );
      setInbox(response.data)
      console.log('Response.data: ', response.data)
    } catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    getInbox();
  }, [])

  useEffect(() => {
    // Load the first message in the inbox when the component mounts
    if (inbox.length > 0) {
      const firstMessage = inbox[0];
      userChatOpen(
        0,
        firstMessage.sender.id,
        firstMessage.reciever.id,
        getUsername(
          firstMessage.sender.id !== user_id
            ? firstMessage.sender
            : firstMessage.reciever
        ),
        firstMessage.sender.id !== user_id
          ? firstMessage.sender.id
          : firstMessage.reciever.id
      );
    }
  }, [inbox]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollRef.current) {
      const container = scrollRef.current._container;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  

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

  const sendMessage = async (e) =>{
    e.preventDefault();
    const formData = new FormData()
    formData.append("sender", user_id);
    formData.append("reciever", otherPersonId);
    formData.append("message", newMessage);
    formData.append("is_read", false);
    try{
      const response = await axios.post(SEND_MESSAGE_URL, formData);
      console.log('Message sent:', response.data);
      setMessages(prevMessages => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (error){
      console.log(error);
    }
  }

  const getProfilePicUrl = (user) => (
    user.profile_pic_url !== null ? `${AWS_PUBLIC_URL}/${user.profile_pic_url}` : AWS_GENERIC_PROFILE
  );
  const getUsername = (user) => (user.username !== "" ? user.username : user.email);
  
  //Use For Chat Box
  const userChatOpen = (idx, messageSenderId, messageRecieverId, username, otherPersonInChatId) => {
    getDetailedMessages(messageSenderId, messageRecieverId);
    setCurrentRoomId(idx);
    setChatBoxUsername(username);
    setOtherPersonId(otherPersonInChatId);
  };

  return (
    <>
      {/* Header section */}
      <Header />

      <div className="page-content">
        <Container>
          <Row>
            <Col lg="12">
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
                                          idx, 
                                          message.sender.id,
                                          message.reciever.id,
                                          getUsername(message.sender.id !== user_id ? message.sender : message.reciever),
                                          message.sender.id !== user_id ? message.sender.id : message.reciever.id
                                        );
                                      }}
                                    >
                                      <div className="d-flex mb-1">
                                        <div className={message.sender.id !== user_id ? "avatar-xs align-self-center me-3" : "align-self-center me-3"}>
                                          <img
                                            src={getProfilePicUrl(message.sender.id !== user_id ? message.sender : message.reciever)}
                                            className="rounded-circle avatar-xs"
                                            alt=""
                                          />
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                          <h5 className="text-truncate font-size-14 mb-1">
                                            {getUsername(message.sender.id !== user_id ? message.sender : message.reciever)}
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
                <div className="w-100 user-chat">
                  <Card>
                    <div className="p-4 border-bottom ">
                      <Row>
                        <Col md="4" xs="9">
                          <h5 className="font-size-15 mb-1">
                            {chatBoxUsername}
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
                              const isNotMyMessage = message.reciever.id !== user_id;
                              const messageClass = isNotMyMessage ? 'right' : '';
                              return (
                                <li key={index}className={`${messageClass}`}>
                                  <div className="conversation-list">
                                    <div className="ctext-wrap">
                                      <div className="conversation-name">
                                      {message.sender.username || message.sender.email}
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
                        <form onSubmit={sendMessage}>
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
              </div>
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
