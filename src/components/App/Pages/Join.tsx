import React from 'react';
import { observer } from 'mobx-react-lite';
import {Button, Card, Col, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

const LinkButton = (props:any) => {
  const { path, label, variant, disabled } = props;

  return (
    <Link to={path} className="text-decoration-none">
      <div className="d-grid gap-2 mt-3">
        <Button variant={variant}>{label}</Button>
      </div>
    </Link>
  );
}

const Join: React.FC = (props) => {
  return (
    <Col className="mt-5 offset-lg-2 col-lg-8 col-md-12">
      {/*<Card>*/}
      {/*  <Card.Body>*/}
      {/*    <div>Session is (active/inactive)</div>*/}
      {/*    <div>Show stats of current session</div>*/}
      {/*    <div>Show Join button (random free slot) - disable if no free slot</div>*/}
      {/*    <div>Show Slot Join button - disable if not available</div>*/}
      {/*  </Card.Body>*/}
      {/*</Card>*/}

      <div className="mt-4 text-center">Take a randomly selected slot</div>
      <LinkButton path={'/session'} label={'Join'} variant={'info'}/>

      {/*<div className="mt-5 text-center">or, take control of a specific slot</div>*/}
      {/*<div className="d-grid gap-2 mt-3">*/}
        {/*<LinkButton path={'/session?slot=1'} label={<>Slot: <strong>1</strong></>} variant={'outline-info'}/>*/}
        {/*<LinkButton path={'/session?slot=2'} label={<>Slot: <strong>2</strong></>} variant={'outline-info'} disabled={true}/>*/}
        {/*<Button variant="outline-secondary" size="sm" disabled={true}>Slot: <strong>2</strong></Button>*/}
        {/*<Button variant="outline-info" size="sm">Slot: <strong>3</strong></Button>*/}
        {/*<Button variant="outline-info" size="sm">Slot: <strong>4</strong></Button>*/}
        {/*<Button variant="outline-info" size="sm">Slot: <strong>5</strong></Button>*/}
      {/*</div>*/}
    </Col>
  )
};

export default observer(Join);