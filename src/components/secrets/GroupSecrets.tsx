import { useContext, useState } from 'react';
import { FloatingLabel, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { BiEdit, BiKey } from 'react-icons/bi';
import LinkButton from '../link-button/LinkButton';
import { DecryptedSecret } from '../../models/DecryptedSecret';
import { UserContext } from '../../UserContext';
import { HomeContext } from '../../views/home/HomeContext';
import './style.scss';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { Group } from '../../models/Group';
import { useMutation } from 'react-query';
import { removeGroup, saveGroup, updateGroupName } from '../../api/GroupApi';
import { NavMenuKeys } from '../nav-menu/NavMenu';

const Secrets = () => {
  const [showEditGroup, setShowEditGroup] = useState(false);
  const { selectedUserGroup, setSelectedUserGroup, setEditingSecret, setActiveKey } = useContext(HomeContext);
  const { getDecryptedGroupSecrets, addUserGroup, removeUserGroup } = useContext(UserContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Group>();

  const { mutateAsync } = useMutation(updateGroupName.name, updateGroupName, {
    onSuccess: (_, group) => {
      const message = 'Successfully updated group!';
      toast.success(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      addUserGroup({ ...selectedUserGroup!, name: group.name });
      setSelectedUserGroup({ ...selectedUserGroup!, name: group.name });
      setShowEditGroup(false);
    },
  });

  const { mutateAsync: mutateRemoveGroupAsync } = useMutation(removeGroup.name, removeGroup, {
    onSuccess: _ => {
      const message = 'Successfully deleted group!';
      toast.success(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      removeUserGroup(selectedUserGroup!.id);
      setSelectedUserGroup(undefined);
      setShowEditGroup(false);
      setActiveKey(NavMenuKeys.MY_VAULT);
    },
  });

  const onSubmit = handleSubmit(async data => {
    const group = {
      id: selectedUserGroup!.groupId,
      name: data.name,
    } as Group;

    await mutateAsync(group);
  });

  const groupSecrets =
    getDecryptedGroupSecrets(selectedUserGroup?.groupId)?.sort((x, y) =>
      x.name.toLowerCase().localeCompare(y.name.toLowerCase())
    ) ?? [];

  const onDeleteGroup = async () => await mutateRemoveGroupAsync(selectedUserGroup!.groupId);

  const onAddNewSecret = () =>
    setEditingSecret({
      name: '',
      username: '',
      password: '',
      description: '',
      groupId: selectedUserGroup?.groupId,
    } as DecryptedSecret);

  const onSecretClick = (secret: DecryptedSecret) => setEditingSecret(secret);

  return (
    <div className='secrets'>
      <div className='ps-2 pt-2'>
        <div className='header'>
          <h2>{selectedUserGroup?.name}</h2>
          <BiEdit onClick={() => setShowEditGroup(true)} />
        </div>
        <div className='mb-2'>
          <LinkButton onClick={onAddNewSecret}>+ Add new secret</LinkButton>
        </div>
      </div>
      {groupSecrets === undefined ? (
        <div className='mt-5' style={{ textAlign: 'center' }}>
          <Spinner animation='border' />
        </div>
      ) : (
        <Table hover>
          <tbody>
            {groupSecrets?.map((secret, i) => (
              <tr key={i} onClick={() => onSecretClick(secret)}>
                <td width='20%' className='key-col'>
                  <BiKey className='secret-icon' />
                </td>
                <td className='name-col'>
                  <div className='name'>{secret.name}</div>
                  <div className='username'>{secret.username}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showEditGroup} onHide={() => setShowEditGroup(false)}>
        <Form onSubmit={onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className='mb-3'>
              <FloatingLabel label='Group name'>
                <Controller
                  name='name'
                  control={control}
                  defaultValue={selectedUserGroup?.name}
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <Form.Control {...field} type='text' placeholder='Group name' isInvalid={!!errors?.name} />
                  )}
                />
                <Form.Control.Feedback type='invalid'>{errors?.name?.message}</Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='outline-primary' type='submit'>
              Save
            </Button>
            <Button variant='outline-danger' type='button' className='ms-3' onClick={onDeleteGroup}>
              Delete group
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Secrets;
