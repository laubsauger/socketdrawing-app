import React, { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useSocket } from "../../../hooks/useSocket";
import { Button, Form, InputGroup } from "react-bootstrap";

type Props = {
  id: string
  label?: string,
  messageField: string,
  textArea?: boolean,
  onSubmitSuccess?: (text: string|null) => void,
  singleUse?: boolean,
  autoFocus?: boolean,
  shouldSubmit?: boolean,
  hasSubmit?: boolean,
};

const CtrlText = (props: Props) => {
  const ref = useRef<HTMLInputElement|null>(null)
  const { label, messageField, textArea, autoFocus, shouldSubmit, hasSubmit, onSubmitSuccess } = props;
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const socket = useSocket();

  const handleChangeText = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    console.log('change', ev.target.value)
    setText(ev.target.value);

    if (!hasSubmit) {
      sendText(ev.target.value)
    }
  }, []);

  const sendText = (text: string) => {
    socket.emit('OSC_CTRL_MESSAGE', {
      message: messageField,
      id: props.id,
      text: text.trim(),
    });
  }

  const doSubmit = () => {
    sendText(text)
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // @ts-ignore
      if (ref.current && !ref.current?.contains(event.target)) {
        // if clicked outside of input, remove focus
        (ref.current as HTMLInputElement).blur();
      }
    };

    // attach the listeners on component mount
    document.addEventListener("mousedown", handleClickOutside);
    // @ts-ignore
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      // remove the listeners on component cleanup
      document.removeEventListener("mousedown", handleClickOutside);
      // @ts-ignore
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className={`CtrlText p-2 pb-0 mt-0 mb-0`}>
      <Form onSubmit={handleSubmit}>
        <Form.Group className={`d-flex ${textArea ? 'flex-column' : ''}`} controlId="formTextPrompt">
          {textArea
            ? (
              <div className="w-100">
                <Form.Control
                  //@ts-ignore
                  ref={ref}
                  as="textarea"
                  rows={8}
                  placeholder={label}
                  required={true}
                  onChange={handleChangeText}
                  aria-label={label}
                  autoFocus={autoFocus}
                  disabled={props.singleUse ? sent && props.singleUse : (!hasSubmit ? false : sent)}
                  className={sent ? 'border-success bg-black' : ''}
                />
              </div>
            )
            : (
              <>
                {!sent || !hasSubmit
                  ? <InputGroup className="d-flex align-items-center">
                      <Form.Control
                        ref={ref}
                        maxLength={20}
                        type="text"
                        value={text}
                        placeholder={label}
                        required={true}
                        onChange={handleChangeText}
                        aria-label={label}
                        autoFocus={autoFocus}
                        disabled={props.singleUse ? sent && props.singleUse : (!hasSubmit ? false : sent)}
                        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      />
                    </InputGroup>
                  : null
                }
              </>
            )
          }
          {!sent && hasSubmit
            ? (
              <div>
                  <div className={`${textArea ? 'mt-2' : '' }`} style={ textArea ? {} : { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
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
                {textArea && hasSubmit ? <div className="mt-3 mb-0 w-100 text-success">Prompt sent! Sit back, relax and wait for others to submit theirs.</div> : null}
              </>
            )
          }
        </Form.Group>
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