import { useContext } from "react";
import { Container, Navbar, Nav, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Notif from "./notif";

// NavBar Component
const NavBar = () => {
    const {user, logout} = useContext(AuthContext);
    return (
      <Navbar style={{ 
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 12px rgba(107, 33, 91, 0.08)',
        padding: '0.75rem 0',
        position: 'relative'
      }}>
        <Container>
          {/* Brand Name (Left-Aligned) */}
          <Navbar.Brand>
            <Link 
              to="/" 
              style={{
                textDecoration: 'none',
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.4rem',
                color: '#6a1b5a',
                letterSpacing: '0.3px',
              }}>
              Lunar Love
            </Link>
          </Navbar.Brand>
      
          {/* Centered Logged-in Message */}
          {user && (
            <div style={{ 
              position: 'absolute', 
              left: '50%', 
              transform: 'translateX(-50%)',
              fontSize: "9pt",
              color: '#6a1b5a',
            }}>
              Logged in As {user?.username}
            </div>
          )}
      
          {/* Right-Aligned Logout Button */}
          {user ? (
            <Nav style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
            }}>
            <Notif />
              <Link 
                onClick={() => logout()}
                to="/login" 
                className="nav-link"
                style={{
                  color: '#6a1b5a',
                  fontSize: '0.95rem',
                }}
              >
                Put us on Pause
              </Link>
            </Nav>
          ) : (
            <Nav>
              <Stack direction="horizontal" gap={3}>
                <Link to="/login" className="nav-link" style={{ color: '#6a1b5a', fontSize: '0.95rem' }}>
                  Continue
                </Link>
                <Link to="/register" className="nav-link" style={{ color: '#6a1b5a', fontSize: '0.95rem' }}>
                  Begin
                </Link>
              </Stack>
            </Nav>
          )}
        </Container>
      </Navbar>      
    );
  }
export default NavBar;