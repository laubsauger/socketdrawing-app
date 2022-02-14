import React from 'react';
import {Col, Container, Row} from "react-bootstrap";

const Footer = () => (
  <Container>
    <Row>
      <div className="d-flex text-muted position-fixed bottom-0 mb-3 justify-content-center small">
        Powered by <a href='https://github.com/laubsauger/socketosc' target="_blank" rel="nofollow noopener noreferrer" className="mx-1">socketosc</a>
      </div>
    </Row>
  </Container>
);

export default Footer;