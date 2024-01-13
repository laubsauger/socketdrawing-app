import React, {useCallback, useState} from 'react';
import { observer } from 'mobx-react-lite';

import { useSocket } from "../../../hooks/useSocket";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";

type Props = {
  label: string,
  messageField: string,
  textArea?: boolean,
  onSubmitSuccess?: () => void,
  singleUse?: boolean,
};

const CtrlText = (props:Props) => {
  const { label, messageField, textArea, onSubmitSuccess } = props;
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
      message: messageField,
      text: text,
    });

    setSent(true);
    onSubmitSuccess && onSubmitSuccess()
  }, [ socket, text ]);

  return (
    <div className={`CtrlText p-3`}>
      { !sent ?
        <Form onSubmit={handleSubmit}>
          <Form.Group className="d-flex" controlId="formTextPrompt">
            { textArea
              ? (
                <div className="w-100">
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder={label}
                    required={true}
                    onChange={handleChangeText}
                    aria-label={label}
                  />
                  <div className="mt-3">
                    <Button variant="primary" type="submit" disabled={!text}>
                      Submit
                    </Button>
                  </div>
                </div>
              )
              : (
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder={label}
                    required={true}
                    onChange={handleChangeText}
                    aria-label={label}
                  />
                  <Button variant="primary" type="submit" disabled={!text}>
                    Submit
                  </Button>
                </InputGroup>
              )
            }
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
          {
            props.singleUse
              ? <>
                  <div>
                    Name: <strong>{text}</strong>
                  </div>
                  <div>
                    <Button size="sm" variant="outline-primary" onClick={() => setSent(false)}>Change</Button>
                  </div>
                </>
              : <>
                  <div>Sent!</div>
                  <Button variant="outline-primary" onClick={() => setSent(false)}>Send another one</Button>
                </>
          }
        </div>
      }
    </div>
  )
};

export default observer(CtrlText);