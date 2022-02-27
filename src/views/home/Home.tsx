import { useContext } from 'react';
import { Col, Container, Row, Tab } from 'react-bootstrap';
import './style.scss';
import SecretForm from '../../components/secret-form/SecretForm';
import HomeProvider, { HomeContext } from './HomeContext';
import Secrets from '../../components/secrets/Secrets';
import NavMenu, { NavMenuKeys } from '../../components/nav-menu/NavMenu';
import GroupForm from '../../components/group-form/GroupForm';
import GroupSecrets from '../../components/secrets/GroupSecrets';

const HomeComponent = () => {
  const { editingSecret, activeKey } = useContext(HomeContext);

  return (
    <div className='home my-5'>
      <Container className='page-content-container'>
        <Tab.Container defaultActiveKey={NavMenuKeys.MY_VAULT}>
          <Row>
            <Col md={3} className='content-col'>
              <NavMenu />
            </Col>
            <Col className='content-col'>
              <Tab.Content>
                <Tab.Pane active={activeKey === NavMenuKeys.MY_VAULT}>
                  <Row>
                    <Col md={5} className='pe-0'>
                      <Secrets />
                    </Col>
                    <Col className='pt-5 content-col'>{editingSecret != null ? <SecretForm /> : <h1>WELCOME!</h1>}</Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>

              <Tab.Content>
                <Tab.Pane active={activeKey === NavMenuKeys.CREATE_NEW_GROUP}>
                  <GroupForm />
                </Tab.Pane>
              </Tab.Content>

              <Tab.Content>
                <Tab.Pane active={activeKey?.startsWith(NavMenuKeys.GROUP_VAULT)}>
                  <Row>
                    <Col md={5} className='pe-0'>
                      <GroupSecrets />
                    </Col>
                    <Col className='pt-5 content-col'>{editingSecret != null ? <SecretForm /> : <h1>WELCOME!</h1>}</Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

const Home = () => (
  <HomeProvider>
    <HomeComponent />
  </HomeProvider>
);

export default Home;
