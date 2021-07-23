import React, { useState } from 'react';
import LayoutNarrow from 'components/Layout/LayoutNarrow';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const AboutUs = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleMsgChange = (e) => {
    setMessage(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendMessage = async () => {
    try {
      const res = await axios.post('/api/send', { name, message, email });
      if (res.data.status === 'success') {
        console.log('Email has been sent');
        setName(res.data.name);
        setMessage(res.data.message);
        setEmail(res.data.email);
        setShow(false);
      } else if (res.data.status === 'fail') {
        console.log('Failure');
        setShow(false);
      }
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
    }
  };

  return (
    <LayoutNarrow>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-0 p-2 p-md-3">
              <div className="row justify-content-center ">
                <div className="col-12">
                  <div className="card border-0 p-md-5">
                    <div className="card-header text-center p-0 pb-5">
                      <h2>You have a question?</h2>
                      <p>Do not hesitate to contact us!</p>
                    </div>
                    <div className="card-body p-0">
                      <form>
                        <div className="form-group">
                          <label htmlFor="name">Your Name</label>
                          <div className="input-group mb-4">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <span className="fa fa-user"></span>
                              </span>
                            </div>
                            <input
                              className="form-control"
                              id="name"
                              placeholder="Enter your name"
                              type="text"
                              required
                              onChange={handleNameChange}
                              value={name}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Your Email</label>
                          <div className="input-group mb-4">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <span className="fa fa-envelope"></span>
                              </span>
                            </div>
                            <input
                              className="form-control"
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              required
                              onChange={handleEmailChange}
                              value={email}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="message">Your message</label>{' '}
                          <textarea
                            className="form-control"
                            placeholder="Enter your message..."
                            id="message"
                            required
                            onChange={handleMsgChange}
                            value={message}
                          ></textarea>
                        </div>
                        <div>
                          <Button
                            className="btn btn-block rounded btn-secondary"
                            onClick={handleShow}
                          >
                            Send message
                          </Button>
                          <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                              <Modal.Title>Send Message</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>We are happy to help you!</Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                              <Button variant="primary" onClick={sendMessage}>
                                Send
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutNarrow>
  );
};

export default AboutUs;
