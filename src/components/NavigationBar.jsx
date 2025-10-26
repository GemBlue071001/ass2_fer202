import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NavigationBar = () => {

    return (
        <>
            <Navbar bg="light" data-bs-theme="light" className='mx-3'>
                <Nav className="me-auto">
                    <Navbar.Brand as={Link} to="/Home">
                        Home
                    </Navbar.Brand>
                    <Nav.Link as={Link} to="/AllLesson">
                        All Lesson
                    </Nav.Link>
                    <Nav.Link as={Link} to="/CompletedLesson">
                        Completed Lesson
                    </Nav.Link>
                    
                </Nav>
            </Navbar>
        </>
    )
}

export default NavigationBar