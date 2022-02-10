import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import { observer } from 'mobx-react-lite';
// import { useStores } from '../../../hooks/useStores';
import './styles.scss';
import {useSocket} from "../../../hooks/useSocket";

type Props = {

}

const SessionInfo = (props:Props) => {
  // const { userStore } = useStores();
  const socket = useSocket();

  return (
    <Container className="SessionInfo pointer-events-none">
      <Row>
        <Col>
          <div className="text-muted font-monospace small">
            Session Info...
          </div>
        </Col>
      </Row>
    </Container>
  )
};

export default observer(SessionInfo);