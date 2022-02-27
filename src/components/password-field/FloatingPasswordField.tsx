import { useState } from 'react';
import { FloatingLabel, Form, InputGroup } from 'react-bootstrap';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import './style.scss';

const FloatingPasswordField = (props: any) => {
  const [hide, setHide] = useState(true);

  const onSetHide = () => setHide(!hide);

  return (
    <InputGroup>
      <FloatingLabel label='Password' className='flex-grow-1'>
        <Form.Control {...props} type={hide ? 'password' : 'text'} placeholder='Password'></Form.Control>
      </FloatingLabel>
      <InputGroup.Text className='eye' onClick={onSetHide}>
        {hide ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
      </InputGroup.Text>
    </InputGroup>
  );
};

export default FloatingPasswordField;
