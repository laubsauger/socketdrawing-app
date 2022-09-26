import React from 'react';
import {Col, Container, Row} from "react-bootstrap";

const Footer = () => (
  <Container>
    <Row>
      <Col>
        <div className="mt-3 small text-muted d-flex justify-content-center">
          <div>
            Made by <a href='https://github.com/laubsauger' target="_blank" rel="nofollow noopener noreferrer">laubsauger</a> | Powered by <a href='https://github.com/laubsauger/socketosc' target="_blank" rel="nofollow noopener noreferrer">socketosc</a>
          </div>
        </div>
      </Col>
    </Row>
  </Container>
);

export default Footer;