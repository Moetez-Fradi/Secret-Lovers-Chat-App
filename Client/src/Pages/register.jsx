import { Alert, Button, Row, Form, Col, Stack } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Register = () => {
    const {user} = useContext(AuthContext);
    const {registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading} = useContext(AuthContext);
    // console.log(registerInfo);
    return ( 
      <Form onSubmit={registerUser}>
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
                onChange={(e) => updateRegisterInfo(
                    {...registerInfo, username:e.target.value}
                )}
                className="form-input"
                type="text" 
                placeholder="The name I whisper" 
                value={registerInfo.username}
              />
  
              <Form.Control
                onChange={(e) => updateRegisterInfo(
                    {...registerInfo, email:e.target.value}
                )}
                className="form-input"
                type="email"
                placeholder="Where my thoughts arrive"
                value={registerInfo.email}
              />

              <Form.Select
                onChange={(e) => updateRegisterInfo(
                  { ...registerInfo, gender: e.target.value }
                )}
                className="form-input"
                value={registerInfo.gender}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Select>
  
              <Form.Control
                onChange={(e) => updateRegisterInfo(
                    {...registerInfo, password:e.target.value}
                )}
                className="form-input"
                type="password"
                placeholder="Our shared secret"
                value={registerInfo.password}
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
                isRegisterLoading? "Creating dreams..." : "Write Together →"
              }
              </Button>
                {
                  registerError?.error && <Alert 
                variant="subtle"
                style={{
                  backgroundColor: '#f9f6f8',
                  color: '#9c275e',
                  fontSize: '0.9rem'
                }}
              >
              Registeration Error:  {registerError?.message}
              </Alert>
                }
            </Stack>
          </Col>
        </Row>
      </Form>
    );
  }
export default Register;