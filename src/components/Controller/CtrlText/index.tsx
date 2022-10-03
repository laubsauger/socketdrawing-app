import React, {useCallback, useState} from 'react';
import { observer } from 'mobx-react-lite';

import { useSocket } from "../../../hooks/useSocket";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";

type Props = {
  label: string,
};

const CtrlText = (props:Props) => {
  const { label } = props;
  const [ text, setText ] = useState('');
  const [ sent, setSent ] = useState(false);
  const socket = useSocket();

  const handleChangeText = useCallback((ev) => {
    console.log('change', ev.target.value)
    setText(ev.target.value);
  }, []);


  const handleSubmit = useCallback((ev) => {
    ev.preventDefault();

    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'textPrompt',
      text: text,
    });

    setSent(true);
  }, [ socket, text ]);

  return (
    <div className={`CtrlText p-3 bg-black`}>
      { !sent ?
        <Form onSubmit={handleSubmit}>
          <Form.Group className="d-flex" controlId="formTextPrompt">
            {/*<Form.Label>Text prompt *</Form.Label>*/}
            <InputGroup>
              <Form.Control type="text"
                            placeholder={label}
                            required={true}
                            onChange={handleChangeText}
                            aria-label={label}
              />

              <Button variant="primary" type="submit" disabled={!text}>
                Submit
              </Button>
            </InputGroup>
          </Form.Group>

          {/*<Form.Group className="mb-3" controlId="formImage">*/}
          {/*  <Form.Label>Image URL (optional)</Form.Label>*/}
          {/*  <Form.Control type="url" pattern="https://.*" placeholder="Link to a .JPG or .PNG image" onChange={handleChangeImage}/>*/}
          {/*</Form.Group>*/}

          {/*<Form.Group className="mb-3" controlId="formUsername">*/}
          {/*  <Form.Label>Name (optional)</Form.Label>*/}
          {/*  <Form.Control type="text" placeholder="Your name" onChange={handleChangeName}/>*/}
          {/*</Form.Group>*/}

          {/*<Form.Group className="mb-3" controlId="formBasicEmail">*/}
          {/*  <Form.Label>Email (optional)</Form.Label>*/}
          {/*  <Form.Control type="email" placeholder="Your email" onChange={handleChangeEmail}/>*/}
          {/*</Form.Group>*/}
        </Form>
        :
        <div className="d-flex justify-content-around align-items-center">
          <div>Sent!</div>
          <Button variant="outline-primary" onClick={() => setSent(false)}>Send another one</Button>
        </div>
      }
    </div>
  )
};

export default observer(CtrlText);