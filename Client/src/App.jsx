import {Routes, Route, Navigate} from "react-router-dom";
import Chat from "./Pages/chat";
import Register from "./Pages/register";
import Login from "./Pages/login";
import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from "react-bootstrap";
import NavBar from "./Components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import { ChatContextProvider } from "./Context/ChatContext"; 

function App() {
  const {user} = useContext(AuthContext);
  return (
    <>
    <ChatContextProvider user={user}>
    <NavBar></NavBar>
    <Container>
      <Routes>
        <Route path="/" element={ user? <Chat/> : <Login/>} />
        <Route path="/register" element={user? <Chat/> :<Register/>} />
        <Route path="/login" element={user? <Chat/> : <Login/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
    </ChatContextProvider>
    </>
  )
}

export default App;
