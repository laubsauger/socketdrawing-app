import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import { observer } from 'mobx-react-lite';
// import { useStores } from '../../../hooks/useStores';
import './styles.scss';

type Props = {

}

const SessionInfo = (props:Props) => {
  // const { userStore } = useStores();

  return (
    <Container className="SessionInfo pointer-events-none">
      <Row>
        <Col>
          <div>Session Info...</div>
        </Col>
      </Row>
    </Container>
  )
};

export default observer(SessionInfo);