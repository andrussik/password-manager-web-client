import { Container, Form, FloatingLabel, Button } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { removeSecret, saveSecret } from '../../api/SecretApi';
import { Secret } from '../../models/Secret';
import { DecryptedSecret } from '../../models/DecryptedSecret';
import { encryptData } from '../../utils/crypto-utils';
import forge from 'node-forge';
import './style.scss';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { HomeContext } from '../../views/home/HomeContext';
import FloatingPasswordField from '../password-field/FloatingPasswordField';

const SecretForm = () => {
  const { addSecret: addUserSecret, removeSecret: removeUserSecret } = useContext(UserContext);
  const { editingSecret, setEditingSecret,  } = useContext(HomeContext);

  const { control, handleSubmit, reset } = useForm<DecryptedSecret>({ reValidateMode: 'onSubmit' });

  const { mutateAsync } = useMutation(saveSecret.name, saveSecret, {
    onSuccess: data => {
      const message = editingSecret!.id?.length > 0 ? 'Successfully updated secret!' : 'Successfully saved new secret!';
      toast.success(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      addUserSecret(data);
      setEditingSecret({ ...editingSecret!, id: data.id });
    },
  });

  const { mutateAsync: deleteMutationAsync } = useMutation(removeSecret.name, removeSecret, {
    onSuccess: (_, id) => {
      toast.success('Successfully deleted secret!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      removeUserSecret(id);
      setEditingSecret(undefined);
    },
  });

  const onSubmit = handleSubmit(async data => {
    const secret = {
      id: data?.id,
      userId: editingSecret?.userId,
      groupId: editingSecret?.groupId,
      name: encryptData(
        data.name,
        forge.util.decode64(sessionStorage.getItem('key')!),
        forge.util.decode64(sessionStorage.getItem('iv')!)
      ),
      username: encryptData(
        data.username,
        forge.util.decode64(sessionStorage.getItem('key')!),
        forge.util.decode64(sessionStorage.getItem('iv')!)
      ),
      password: encryptData(
        data.password,
        forge.util.decode64(sessionStorage.getItem('key')!),
        forge.util.decode64(sessionStorage.getItem('iv')!)
      ),
    } as Secret;

    await mutateAsync(secret);
  });

  const onDelete = async () => await deleteMutationAsync(editingSecret!.id);

  useEffect(() => {
    reset(editingSecret);
  }, [editingSecret]);

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Form.Group className='mb-5'>
          <FloatingLabel label="Secret's name">
            <Controller
              name='name'
              control={control}
              defaultValue=''
              render={({ field }) => <Form.Control {...field} ref={null} type='text' placeholder="Secret's name" />}
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className='mb-3'>
          <FloatingLabel label='Username'>
            <Controller
              name='username'
              control={control}
              defaultValue={editingSecret?.username ?? ''}
              render={({ field }) => <Form.Control {...field} ref={null} type='text' placeholder='Username' />}
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Controller
            name='password'
            control={control}
            defaultValue={editingSecret?.password ?? ''}
            render={({ field }) => <FloatingPasswordField {...field} ref={null} />}
          />
        </Form.Group>

        <div className='mt-4'>
          <Button variant='outline-primary' type='submit'>
            Save
          </Button>

          {editingSecret?.id != null && (
            <Button variant='outline-danger' type='button' className='ms-3' onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      </Form>
    </Container>
  );
};

export default SecretForm;
