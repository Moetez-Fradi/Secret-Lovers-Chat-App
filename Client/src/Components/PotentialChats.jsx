import { useContext } from "react";
import { chatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";

const PotentialChats = () => {
    const {user} = useContext(AuthContext);
    const { potentialChats, createChat, isChatLoading, onlineUsers } = useContext(chatContext);

    if (isChatLoading) {
        return <p>Loading potential chats...</p>;
    }
    // console.log(" pchats ",potentialChats);
    return (<>
        <div className="all-users">
            {
                potentialChats ? potentialChats.map((u, index)=> {
                    return <div className="single-user" key={index} onClick={() => createChat(user?._id, u?._id)}>
                        {u.username}
                        {onlineUsers.some((online) => online.userId === u._id)? <span className="user-online"></span> : null}
                    </div>
                }) : null
            }
        </div>
    </>);
}
 
export default PotentialChats;