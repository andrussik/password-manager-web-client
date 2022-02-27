import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import './style.scss';

const PasswordField = (props: any) => {
  const [hide, setHide] = useState(true);

  const onSetHide = () => setHide(!hide);

  return (
    <InputGroup>
      <Form.Control {...props} type={hide ? 'password' : 'text'}></Form.Control>
      <InputGroup.Text className='eye' onClick={onSetHide}>
        {hide ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
      </InputGroup.Text>
    </InputGroup>
  );
};

export default PasswordField;
