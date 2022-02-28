import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '../../api/AccountApi';
import { LoginFormData } from '../../models/forms/LoginFormData';
import { LoginDto } from '../../models/api/LoginDto';
import Paths from '../../routes/Paths';
import { getPasswordHash } from '../../utils/crypto-utils';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';
import './style.scss';
import PasswordField from '../../components/password-field/PasswordField';
import { API_URL } from '../../utils/config';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setAuthenticated } = useContext(UserContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ reValidateMode: 'onSubmit' });

  const { mutateAsync } = useMutation(login.name, login, {
    onSuccess: (data, loginData) => {
      setAuthenticated(data, loginData.masterPassword);
      navigate(Paths.Home);
    },
  });

  const onSubmit = handleSubmit(async data => {
    const masterPasswordHash = getPasswordHash(data.masterPassword);
    const loginDto = { email: data.email, masterPassword: masterPasswordHash } as LoginDto;
    await mutateAsync(loginDto);
  });

  const onRegisterClick = () => navigate(Paths.Register);

  if (isAuthenticated) return <Navigate to={Paths.Home} />;

  return (
    <div className='login'>
      <Container className='vh-100 d-flex flex-column'>
        <Row className='justify-content-md-center align-items-center h-50 my-auto mx-5'>
          <Col>
            <Form onSubmit={onSubmit}>
              <Form.Group className='mb-3'>
                <Form.Label>Email Address</Form.Label>
                <Controller
                  name='email'
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <Form.Control {...field} type='email' ref={null} isInvalid={!!errors?.email}></Form.Control>
                  )}
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Master Password</Form.Label>
                <Controller
                  name='masterPassword'
                  control={control}
                  defaultValue=''
                  render={({ field }) => <PasswordField {...field} ref={null} />}
                />
              </Form.Group>

              <div>
                <Button variant='outline-primary' type='submit'>
                  Log In
                </Button>
                <Button className='ms-3' variant='outline-primary' type='button' onClick={onRegisterClick}>
                  Register
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
