import { Alert, Button, Row, Form, Col, Stack } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
    const {user} = useContext(AuthContext);
    const {logout, loginUser, isLoginLoading, loginError, loginInfo, updateLoginInfo} = useContext(AuthContext);
    return ( 
      <Form onSubmit={loginUser}>
        <Row className="align-items-center" style={{ 
          minHeight: 'calc(100vh - 76px)',
          padding: '2rem 0' 
        }}>
          <Col xs={12} md={8} lg={6} xl={5} className="mx-auto">
            <Stack gap={4} style={{
              padding: '2.5rem 2rem',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 24px rgba(107, 33, 91, 0.05)'
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                color: '#6a1b5a',
                fontSize: '1.8rem',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                Next Chapter
              </h2>
  
              <Form.Control 
                onChange={(e) => updateLoginInfo(
                    {...loginInfo, username:e.target.value}
                )}
                className="form-input"
                type="text" 
                placeholder="The name I whisper" 
              />
  
              <Form.Control
                onChange={(e) => updateLoginInfo(
                    {...loginInfo, password:e.target.value}
                )}              
                className="form-input"
                type="password"
                placeholder="Our shared secret"
              />
  
              <Button 
                variant="custom"
                type="submit"
                style={{
                  backgroundColor: '#6a1b5a',
                  color: 'white',
                  padding: '0.75rem',
                  marginTop: '1rem',
                  ':hover': {
                    backgroundColor: '#9c275e',
                    transform: 'translateY(-1px)'
                  }
                }}
              >{
                isLoginLoading? "Joining the dream..." : "Continue Together →"
              }
              </Button>
  
              {
                  loginError?.error && <Alert 
                variant="subtle"
                style={{
                  backgroundColor: '#f9f6f8',
                  color: '#9c275e',
                  fontSize: '0.9rem'
                }}
              >
              Login Error:  {loginError?.message}
              </Alert>
              }
            </Stack>
          </Col>
        </Row>
      </Form>
    );
  }
 
export default Login;