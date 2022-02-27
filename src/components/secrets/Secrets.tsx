import { useContext } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { BiKey } from 'react-icons/bi';
import LinkButton from '../link-button/LinkButton';
import { DecryptedSecret } from '../../models/DecryptedSecret';
import { UserContext } from '../../UserContext';
import { HomeContext } from '../../views/home/HomeContext';
import './style.scss';

const Secrets = () => {
  const { setEditingSecret } = useContext(HomeContext);
  const { user, getDecryptedUserSecrets } = useContext(UserContext);

  const userSecrets =
    getDecryptedUserSecrets()?.sort((x, y) => x.name.toLowerCase().localeCompare(y.name.toLowerCase())) ?? [];

  const onAddNewSecret = () =>
    setEditingSecret({ name: '', username: '', password: '', userId: user!.id } as DecryptedSecret);

  const onSecretClick = (secret: DecryptedSecret) => setEditingSecret(secret);

  return (
    <div className='secrets'>
      <div className='ps-2 pt-2'>
        <h2>My vault</h2>
        <div className='mb-2'>
          <LinkButton onClick={onAddNewSecret}>+ Add new secret</LinkButton>
        </div>
      </div>
      {userSecrets === undefined ? (
        <div className='mt-5' style={{ textAlign: 'center' }}>
          <Spinner animation='border' />
        </div>
      ) : (
        <Table hover>
          <tbody>
            {userSecrets?.map((secret, i) => (
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
    </div>
  );
};

export default Secrets;
