import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useSocket } from "../../../hooks/useSocket";
import { Button, Form, InputGroup } from "react-bootstrap";

type Props = {
  label: string,
  messageField: string,
  textArea?: boolean,
  onSubmitSuccess?: (text: string|null) => void,
  singleUse?: boolean,
  autoFocus?: boolean,
  shouldSubmit?: boolean,
};

const CtrlText = (props: Props) => {
  const { label, messageField, textArea, autoFocus, shouldSubmit, onSubmitSuccess } = props;
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const socket = useSocket();

  const handleChangeText = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    console.log('change', ev.target.value)
    setText(ev.target.value);
  }, []);

  const doSubmit = () => {
    socket.emit('OSC_CTRL_MESSAGE', {
      message: messageField,
      text: text,
    });

    setSent(true);
    onSubmitSuccess && onSubmitSuccess(text)
  }

  useEffect(() => {
    if (shouldSubmit && !sent) {
      doSubmit()
    }
  }, [shouldSubmit]);

  const handleSubmit = useCallback((ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    doSubmit()
  }, [socket, text]);

  return (
    <div className={`CtrlText p-2 mt-0 mb-0`}>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="d-flex flex-column" controlId="formTextPrompt">
          {textArea
            ? (
              <div className="w-100">
                <Form.Control
                  as="textarea"
                  rows={6}
                  placeholder={label}
                  required={true}
                  onChange={handleChangeText}
                  aria-label={label}
                  autoFocus={autoFocus}
                  disabled={props.singleUse ? sent && props.singleUse : sent}
                  className={sent ? 'border-success bg-black' : ''}
                />
              </div>
            )
            : (
              <>
                {!sent
                  ? <InputGroup className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        placeholder={label}
                        required={true}
                        onChange={handleChangeText}
                        aria-label={label}
                        autoFocus={autoFocus}
                        disabled={props.singleUse ? sent && props.singleUse : sent}
                      />
                    </InputGroup>
                  : null
                }
              </>
            )
          }
          {!sent
            ? (
              <div>
                  <div className="mt-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={!text || (props.singleUse ? sent && props.singleUse : sent)}
                    >
                      Submit
                    </Button>
                  </div>
              </div>
            )
            :
            (
              <>
                {textArea ? <div className="mt-2 mb-0 w-100 text-success">Sent!</div> : null}
              </>
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

      {sent
        ? <div className="d-flex justify-content-between align-items-center">
          {
            props.singleUse
              ? <>
                <div>
                  <strong>{text}</strong>
                </div>
                <div>
                  <Button size="sm" variant="outline-secondary" onClick={() => setSent(false)}>Change</Button>
                </div>
              </>
              : null
          }
        </div>
        : null
      }
    </div>
  )
};

export default observer(CtrlText);