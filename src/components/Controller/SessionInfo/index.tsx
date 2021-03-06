import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import { observer } from 'mobx-react-lite';
import { useStores } from "../../../hooks/useStores";
import './styles.scss';
import config from "../../../config";

const SessionInfo = () => {
  const { socketStore } = useStores();

  return (
    <Container className="SessionInfo pointer-events-none mt-5 position-fixed">
      <Row>
        <Col>
          <div className="mt-3 text-muted font-monospace small opacity-50">
            { socketStore.connectionState.connecting && <div>Connecting to {config.socketServer}...</div> }
            { socketStore.connectionState.connected && <div className="text-success">Connected to {config.socketServer}</div> }
            { socketStore.connectionState.failed && <div className="text-danger">Failed to connect: {socketStore.connectionState.failReason}</div> }
            { socketStore.connectionState.joining && <div>Joining "{config.socketRoom}"...</div> }
            { socketStore.connectionState.joined &&
                <React.Fragment>
                  <div className="text-success">
                    <div>Room: "{config.socketRoom}"</div>
                    <div>Online: {socketStore.roomState.numCurrentUsers}/{socketStore.roomState.numMaxUsers}</div>
                    <div>Slot: {socketStore.roomState.currentSlot}</div>
                  </div>
                </React.Fragment>
            }
            { socketStore.connectionState.rejected && <div className="text-warning">Join Request rejected: "{socketStore.connectionState.rejectReason}"</div> }
          </div>
        </Col>
      </Row>
    </Container>
  )
};

export default observer(SessionInfo);