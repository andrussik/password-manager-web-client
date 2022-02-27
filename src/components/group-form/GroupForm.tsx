import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { Container, FloatingLabel, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { saveGroup } from '../../api/GroupApi';
import { Group } from '../../models/Group';
import { UserContext } from '../../UserContext';
import { HomeContext } from '../../views/home/HomeContext';
import './style.scss';

const GroupForm = () => {
  const { control, handleSubmit } = useForm<Group>();
  const { editingGroup, setEditingGroup } = useContext(HomeContext);
  const { addUserGroup } = useContext(UserContext);

  const { mutateAsync } = useMutation(saveGroup.name, saveGroup, {
    onSuccess: data => {
      const message = editingGroup?.id?.length! > 0 ? 'Successfully updated group!' : 'Successfully saved new group!';
      toast.success(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      addUserGroup(data);
      setEditingGroup({id: data.id, name: data.name} as Group)
    },
  });

  const onSubmit = handleSubmit(async data => {
    const group = {
      id: data.id,
      name: data.name
    } as Group

    await mutateAsync(group);
  });

  return <Container>
    <h2 className='my-4'>Create new group</h2>
    <Form onSubmit={onSubmit}>
      <Form.Group className='mb-3'>
        <FloatingLabel label="Group name">
          <Controller
            name='name'
            control={control}
            defaultValue=''
            render={({ field }) => <Form.Control {...field} type='text' placeholder="Group name" />}
          />
        </FloatingLabel>
      </Form.Group>

      <Button variant='outline-primary' type='submit'>
        Save
      </Button>
    </Form>
  </Container>
};

export default GroupForm;
