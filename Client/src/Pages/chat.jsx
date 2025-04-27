import { useContext, useState } from "react";
import { chatContext } from "../Context/ChatContext.jsx";
import { Container, Stack } from "react-bootstrap";
import { UserChats } from "../Components/UserChats.jsx";
import { AuthContext } from "../Context/AuthContext.jsx";
import PotentialChats from "../Components/PotentialChats.jsx";
import ChatBox from "../Components/ChatBox.jsx";

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { 
        userChats, 
        isChatLoading, 
        currentChat, 
        updateCurrentChat 
    } = useContext(chatContext);

    return (
        <Container>
            {/* Show PotentialChats only when no chat is selected */}
            {!currentChat && <PotentialChats>yes</PotentialChats>}
            
            {userChats?.length < 1 ? null : (
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    {/* Show user chats only when no active chat */}
                    {!currentChat && (
                        <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                            {isChatLoading ? (
                                <p>Loading memories...</p>
                            ) : (
                                userChats?.map((chat, index) => (
                                    <div key={index} onClick={() => updateCurrentChat(chat)}>
                                        <UserChats chat={chat} user={user} />
                                    </div>
                                ))
                            )}
                        </Stack>
                    )}
                    {/* Show ChatBox when there's an active chat */}
                    {currentChat && (
                        <ChatBox closeChat={() => updateCurrentChat(null)} />
                    )}
                </Stack>
            )}
        </Container>
    );
};

export default Chat;