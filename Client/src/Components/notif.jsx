import { useState } from "react";
import { chatContext } from "../Context/ChatContext.jsx";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";
import { unreadNoifications } from "../Utils/unreadNoifications.js";
import moment from "moment";

const Notif = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {notif, allUsers, userChats} = useContext(chatContext);
  const {user} = useContext(AuthContext);
  const {markAllNotificationsAsRead, markNotificationAsRead} = useContext(chatContext);

  const unread = unreadNoifications(notif, user);

  const modifiedNotif = notif.map((n) => {
    const user = allUsers.find((u) => u._id === n.senderId);
    return {...n, senderName: user?.username};
  });

  return (
    <div className="notifications position-relative d-inline-block">
      <div
        className="notifications-icon p-2"
        style={{ cursor: "pointer" }}
        onClick={() => setIsOpen((o) => !o)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-fill" viewBox="0 0 16 16">
          <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15"/>
        </svg>
        {unread?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unread?.length}</span>
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="notifications-box position-absolute bg-white shadow rounded-2"
          style={{
            top: "100%",
            right: 0,
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          <div className="notifications-header d-flex justify-content-between align-items-center p-2 border-bottom sticky-top bg-white">
            <h6 className="mb-0">Notifications</h6>
            <button
              className="btn btn-sm btn-link p-0"
              onClick={() => {markAllNotificationsAsRead(notif); setIsOpen(false)}}
            >
              Mark all as read
            </button>
          </div>
          
          <div className="notifications-list">
            {modifiedNotif?.length === 0 ? (
              <div className="notification p-2">No notifications</div>
            ) : (
              modifiedNotif?.map((n, index) => (
                <div 
                  key={index} 
                  className={n.isRead ? "notification p-2" : "notification not-read p-2"} 
                  onClick={() => {
                    markNotificationAsRead(n, userChats, user, notif); 
                    setIsOpen(false);
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <span>{n.senderName} sent you a message</span>
                  </div>
                  <div className="notification-time text-muted small">
                    {moment(n.date).calendar()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notif;