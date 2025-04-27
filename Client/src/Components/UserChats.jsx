import { Stack } from "react-bootstrap";
import { userFindRecipient } from "../hooks/findRecepient.js";
import assassin from "../../assets/assassin.svg";
import girl from "../../assets/girl.svg";
import batman from "../../assets/batman.svg";
import { useContext } from "react";
import { chatContext } from "../Context/ChatContext.jsx";
import { unreadNoifications } from "../Utils/unreadNoifications.js";
import { useFetchLastMessage } from "../hooks/fetchLastMessage.js";
import moment from "moment";

export const UserChats = ({ chat, user }) => {
    const { recipientUser, isLoading } = userFindRecipient(chat, user);
    const { onlineUsers, notif, markThisUserNotificationsAsRead } = useContext(chatContext);
    const { lastMessage } = useFetchLastMessage(chat);

    const unread = unreadNoifications(notif, user);
    const thisUserNotifications = unread?.filter(
        n => n.senderId === recipientUser?._id
    );

    if (isLoading) {
        return <div>Loading recipient...</div>;
    }

    const substring = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <Stack 
            role="button" 
            direction="horizontal" 
            gap={3} 
            className="user-card align-items-center p-2 justify-content-between"
            onClick={() => {
                if (thisUserNotifications?.length > 0) {
                    markThisUserNotificationsAsRead(thisUserNotifications, notif);
                }
            }}
        >
            {/* LEFT SIDE */}
            <div className="d-flex align-items-center">
                <div className="me-2">
                    {recipientUser?.gender === "male" ? (
                        <img src={batman} height="45px" alt="profile" />
                    ) : recipientUser?.gender === "female" ? (
                        <img src={girl} height="45px" alt="profile" />
                    ) : (
                        <img src={assassin} height="45px" alt="profile" />
                    )}
                </div>
                <div className="text-content">
                    <div className="fw-bold">
                        {recipientUser?.username || "Unknown User"}
                    </div>
                    <div className="text-muted small">
                        {lastMessage?.text 
                            ? <span>{substring(lastMessage.text, 17)}</span> 
                            : "Start a conversation!"}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="d-flex flex-column align-items-end justify-content-between" style={{ minHeight: "45px" }}>
                <div className="text-muted small">
                    {lastMessage?.createdAt ? moment(lastMessage.createdAt).calendar() : ''}
                </div>
                <div className="position-relative">
                    {thisUserNotifications?.length > 0 && (
                        <span className="badge bg-danger rounded-pill">
                            {thisUserNotifications.length > 9 ? '+9' : thisUserNotifications.length}
                        </span>
                    )}
                    {onlineUsers.some(user => user.userId === recipientUser?._id) && (
                        <span 
                            className="position-absolute translate-middle p-1 bg-success border border-light rounded-circle"
                            style={{ top: "0", right: "-10px" }}
                        ></span>
                    )}
                </div>
            </div>
        </Stack>
    );
};
