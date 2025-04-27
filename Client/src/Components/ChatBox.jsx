import { useContext, useEffect, useRef, useState } from "react";
import { userFindRecipient } from "../hooks/findRecepient";
import { chatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
const ChatBox = () => {
    const {currentChat, messages, messagesLoadin, sendMessage} = useContext(chatContext);
    const {user} = useContext(AuthContext);
    const {recipientUser} = userFindRecipient(currentChat, user);
    const [textMessage, setTextMessage] = useState("");
    const scroll = useRef();

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth"});
    }, [messages, currentChat]);

    if (!recipientUser){
        return <p style={{textAlign:"center",width: "100%" }}>No Conversation Selected Yet.</p>
    }

    if (messagesLoadin){
        return <p style={{textAlign:"center",width: "100%" }}>Loading Chat...</p>
    }

    return ( <Stack gap={4} className="chat-box">
        <div className="chat-header">
            <strong>{recipientUser?.username}</strong>
        </div>
        <Stack className="messages" gap={3}>{messages? messages.map((message,index)=>{
            return <Stack key={index} className={`${message?.senderId === user?._id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
                <span>{message.text}</span>
                <span className="message-footer">{moment(message.createdAt).calendar()}</span>
                <div ref={scroll} />
            </Stack>
        }): null}</Stack>
        <Stack gap={3} className="chat-input flex-grow-0" direction="horizontal" style={{ position: "relative" }}>
            <InputEmoji value={textMessage} onChange = {setTextMessage} borderColor="rgba(72,112,223,0.2)"/>
            <button onClick={()=>sendMessage(textMessage, user, currentChat._id,sendMessage)} className="send-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-heart" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.965 12.695a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2m-.8 3.108.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125M8 5.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
</svg>
            </button>
        </Stack>
    </Stack> );
}
 
export default ChatBox;