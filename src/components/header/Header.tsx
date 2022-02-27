import { Container, Navbar } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import Paths from "../../routes/Paths"
import './style.scss'

const Header = () => {
  return (
    <Navbar variant="dark">
      <Container className='page-content-container'>
        <NavLink to={Paths.Home}>
          <Navbar.Brand>
            Password manager
          </Navbar.Brand>
        </NavLink>
      </Container>
    </Navbar>
  )
}

export default Header