import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { Container, FloatingLabel, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postGroup } from '../../api/GroupApi';
import { Group } from '../../models/Group';
import { UserContext } from '../../UserContext';
import { HomeContext } from '../../views/home/HomeContext';
import { NavMenuKeys } from '../nav-menu/NavMenu';
import './style.scss';

const GroupForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Group>();
  const { setEditingGroup, setSelectedUserGroup, setActiveKey } = useContext(HomeContext);
  const { addUserGroup } = useContext(UserContext);

  const { mutateAsync } = useMutation(postGroup.name, postGroup, {
    onSuccess: data => {
      toast.success('Successfully saved new group!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      addUserGroup(data);
      setSelectedUserGroup(data);
      setEditingGroup(undefined);
      setActiveKey(NavMenuKeys.GROUP_VAULT + data.id);
      reset();
    },
  });

  const onSubmit = handleSubmit(async data => {
    const group = {
      id: data.id,
      name: data.name,
    } as Group;

    await mutateAsync(group);
  });

  return (
    <Container>
      <h2 className='my-4'>Create new group</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group className='mb-3'>
          <FloatingLabel label='Group name'>
            <Controller
              name='name'
              control={control}
              defaultValue=''
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <Form.Control {...field} type='text' placeholder='Group name' isInvalid={!!errors?.name} />
              )}
            />
            <Form.Control.Feedback type='invalid'>{errors?.name?.message}</Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>

        <Button variant='outline-primary' type='submit'>
          Save
        </Button>
      </Form>
    </Container>
  );
};

export default GroupForm;
