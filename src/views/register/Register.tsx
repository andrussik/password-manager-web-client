import { AxiosError } from 'axios';
import { useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../../api/AccountApi';
import { RegisterFormData } from '../../models/forms/RegisterFormData';
import { RegisterDto } from '../../models/api/RegisterDto';
import Paths from '../../routes/Paths';
import { getPasswordHash } from '../../utils/crypto-utils';
import { UserContext } from '../../UserContext';
import './style.scss';
import PasswordField from '../../components/password-field/PasswordField';
import FetchSpinner from '../../components/fetch-spinner/FetchSpinner';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(UserContext);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ reValidateMode: 'onSubmit' });

  const { mutateAsync, isLoading } = useMutation(register.name, register, {
    onSuccess: _ => {
      toast.success('Registration successful! You can now log in.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate(Paths.Home);
    },
    onError: (error: AxiosError) => {
      console.log(error);
    },
  });

  const onSubmit = handleSubmit(async data => {
    const masterPasswordHash = getPasswordHash(data.masterPassword);
    const registerDto = { email: data.email, name: data.name, masterPassword: masterPasswordHash } as RegisterDto;
    await mutateAsync(registerDto);
  });

  const onCancel = () => navigate(Paths.Home);

  if (isAuthenticated) return <Navigate to={Paths.Home} />;

  return (
    <div className='register'>
      {isLoading && <FetchSpinner />}
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
                  rules={{ required: 'Email is required' }}
                  render={({ field }) => (
                    <Form.Control {...field} ref={null} type='email' isInvalid={!!errors?.email}></Form.Control>
                  )}
                />
                <Form.Control.Feedback type='invalid'>{errors?.email?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Name</Form.Label>
                <Controller
                  name='name'
                  control={control}
                  defaultValue=''
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <Form.Control {...field} ref={null} type='text' isInvalid={!!errors?.name}></Form.Control>
                  )}
                />
                <Form.Control.Feedback type='invalid'>{errors?.name?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Master Password</Form.Label>
                <Controller
                  name='masterPassword'
                  control={control}
                  defaultValue=''
                  rules={{
                    required: 'Password is required',
                    minLength: { value: 8, message: 'minimum length is 8' },
                  }}
                  render={({ field }) => (
                    <PasswordField
                      {...field}
                      ref={null}
                      isInvalid={!!errors?.masterPassword}
                      errorMessage={errors?.masterPassword?.message}
                    />
                  )}
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Confirm Master Password</Form.Label>
                <Controller
                  name='confirmMasterPassword'
                  control={control}
                  defaultValue=''
                  rules={{
                    validate: value => value === watch('masterPassword') || "Passwords don't match",
                  }}
                  render={({ field }) => (
                    <PasswordField
                      {...field}
                      ref={null}
                      isInvalid={!!errors?.confirmMasterPassword}
                      errorMessage={errors?.confirmMasterPassword?.message}
                    />
                  )}
                />
              </Form.Group>

              <div>
                <Button variant='outline-primary' type='submit'>
                  Register
                </Button>
                <Button className='ms-3' variant='outline-secondary' type='button' onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
