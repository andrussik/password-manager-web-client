import { useContext, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { UserContext } from '../../UserContext';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';
import { GiZebraShield } from 'react-icons/gi';
import { GiMonkey } from 'react-icons/gi';
import { GiCheckedShield } from 'react-icons/gi';
import './style.scss';
import { UserGroup } from '../../models/UserGroup';
import { HomeContext } from '../../views/home/HomeContext';

export enum NavMenuKeys {
  MY_VAULT = 'my-vault',
  CREATE_NEW_GROUP = 'create-new-group',
  GROUP_VAULT = 'group-vault-',
}

const NavMenu = () => {
  const { user, logOut } = useContext(UserContext);
  const { setEditingSecret, setSelectedUserGroup, activeKey, setActiveKey } = useContext(HomeContext);
  const [groupsCollapsed, setGroupsCollapsed] = useState(true);

  const userGroups = user?.groups?.sort((x, y) => x.name.toLowerCase().localeCompare(y.name.toLowerCase()));

  const onGroupsClick = () => setGroupsCollapsed(!groupsCollapsed);

  const onUserGroupSelect = (userGroup: UserGroup) => {
    if (activeKey !== NavMenuKeys.GROUP_VAULT + userGroup.id) {
      setActiveKey(NavMenuKeys.GROUP_VAULT + userGroup.id);
      setSelectedUserGroup(userGroup);
      setEditingSecret(undefined);
    }
  };

  return (
    <Nav variant='pills' className='nav-menu flex-column'>
      <Nav.Link active={activeKey === NavMenuKeys.MY_VAULT} onClick={_ => setActiveKey(NavMenuKeys.MY_VAULT)}>
        <GiZebraShield />
        <span className='mx-2'>My vault</span>
      </Nav.Link>

      <Nav.Link className='groups-link' onClick={onGroupsClick}>
        <GiMonkey />
        <span className='mx-2'>Groups</span>
        {groupsCollapsed ? <RiArrowDownSFill /> : <RiArrowUpSFill />}
      </Nav.Link>

      {!groupsCollapsed && (
        <div>
          <Nav.Link active={activeKey === NavMenuKeys.CREATE_NEW_GROUP} onClick={_ => setActiveKey(NavMenuKeys.CREATE_NEW_GROUP)}>
            <span className='ps-4'>+ Create new group</span>
          </Nav.Link>
          {userGroups?.map(userGroup => (
            <Nav.Link
              key={userGroup.id}
              active={activeKey === NavMenuKeys.GROUP_VAULT + userGroup.id}
              onClick={_ => onUserGroupSelect(userGroup)}
            >
              <span className='ps-4'>
                <GiCheckedShield /> {userGroup.name}
              </span>
            </Nav.Link>
          ))}
        </div>
      )}

      <Nav.Link onClick={logOut}>Log Out</Nav.Link>
    </Nav>
  );
};

export default NavMenu;
