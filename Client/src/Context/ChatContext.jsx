import { createContext, useCallback, useEffect, useState } from "react";
import {getRequest, baseUrl, postRequest} from "../Utils/Services.jsx"
import {io} from "socket.io-client"
import { userFindRecipient } from "../hooks/findRecepient.js";
import { useRef } from "react";

export const chatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatError, setChatError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messagesLoadin, setMessagesLoading] = useState(false);
    const [messages, setMessages] = useState(null);
    const [messagesError, setMessagesError] = useState(false);
    const [sendMessageError, setSendMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notif, setNotif] = useState([])
    const [allUsers, setAllUsers] = useState([]);

    // console.log("user._id", user?._id);

    const currentChatRef = useRef(currentChat);
    useEffect(() => {
    currentChatRef.current = currentChat;
    }, [currentChat]);
    
    useEffect(() => {
        if (socket) socket.disconnect();
        const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
            transports: ["websocket"],       
            cors: { origin: "http://localhost:5173" },
        });
        setSocket(newSocket);
    
        newSocket.on("onlineUsers", (res) => {
            setOnlineUsers(res);
        });
    
        newSocket.on("getMessage", (res) => {
            const currentChatId = currentChatRef.current?._id;
            if (currentChatId !== res.chatId) return;
            setMessages((prev) => [...prev, res]);
          });

        newSocket.on("getNotification", (res) => {
            // Use the ref instead of direct currentChat
            const currentChat = currentChatRef.current;
            const isInCurrent = currentChat?.members.some(member => member === res.senderId);
            
            if (isInCurrent) {
              setNotif(prev => [{ ...res, isRead: true }, ...prev]);
            } else {
              setNotif(prev => [res, ...prev]);
            }
          });
    
        return () => {
            newSocket.disconnect();
        };
    }, []); 

    // useEffect(() => {
    //     if (socket) socket.disconnect();
    
    //     const newSocket = new io("http://localhost:3000");
    //     setSocket(newSocket);
    
    //     return () => {
    //         newSocket.disconnect();
    //     };
    // }, [user]);
    
    useEffect(() => {
        if (!socket || !user?._id) return;
        socket.emit("addNewUser", user._id);
    }, [socket, user?._id]);
    
    useEffect(() => {
        if (!socket || !newMessage) return;
        const recipientId = currentChat?.members.find(id => id !== user?._id);
        if (!recipientId) return;
        socket.emit("sendMessage", { ...newMessage, recipientId });
    }, [newMessage, socket, currentChat, user?._id]);
    

    useEffect(()=> {
        const getUsers =async ()=> {
            let isChatUsed = false;
            const response = await getRequest(`${baseUrl}/users`);
            if (response.error){
                return console.log("Error fetching users", response);
            }
            // console.log("response:", response)
            const pChats = response.filter((u)=> {
                // console.log(u._id);
                if(u._id===user?._id) return false;

                if(userChats){
                    isChatUsed = userChats?.some((chat) => {
                        // console.log(chat);
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    });
                }
                return !isChatUsed;
            });
            // console.log("phcts", pChats)
            setPotentialChats(pChats);
            setAllUsers(response);
        }
        getUsers();
    }, [userChats, user])

    useEffect(() => {
        const getUserChat = async()=>{
            if(user?._id){
                setChatError(null);
                setIsChatLoading(true);
                const response = await getRequest(`${baseUrl}/chat/${user._id}`);
                setIsChatLoading(false);
                // console.log(response);
                if(response.error) {
                    return setChatError(response);
                }
                setUserChats(response);
           }
        }
        getUserChat();
    }, [user, notif]);

    useEffect(()=>{
        const getChatMessages = (async()=>{
            setMessagesError(null)
            setMessagesLoading(true);
            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
            setMessagesLoading(false);

            if(response.error){
                return setMessagesError(error);
            }
            setMessages(response);
        })
        getChatMessages();

    }, [currentChat]);

    // useEffect(() => {
    //     if (!socket) return;
    //     const handler = (res) => {
    //       const isInCurrent = currentChat?.members.some(m => m === res.senderId);
    //       if (isInCurrent) {
    //         setNotif(prev => [{ ...res, isRead: true }, ...prev]);
    //       } else {
    //         setNotif(prev => [res, ...prev]);
    //       }
    //     };
    //     socket.on("getNotification", handler);
    //     return () => {
    //       socket.off("getNotification", handler);
    //     };
    //   }, [socket, currentChat]);

    const updateCurrentChat = useCallback((chat)=>{
        setCurrentChat(chat);
    }, [])

    const createChat = useCallback(async(first, second)=> {
        const response = await postRequest(`${baseUrl}/chat`, {
            first, second
        });
        if(response.error){
            return console.log(response.error);
        }

        setUserChats((prev) => [...prev, response]);
    },[setUserChats]);

    const sendMessage = useCallback(async(messageText, sender, currentChatId, setTextMessage) => {
        if(!messageText) return console.log("type something positive!");
        const response = await postRequest(`${baseUrl}/messages`,{
            chatId:currentChatId,
            senderId:sender,
            text:messageText
        });
        if(response.error){
            return setSendMessageError(response.error);
        };

        setNewMessage(response);
        setMessages((prev)=>[...prev, response]);
        setTextMessage("");
        
    });

    const markAllNotificationsAsRead = useCallback((notifications)=>{
        const updatedNotifications = notifications.map((n)=> ({...n, isRead: true}));
        setNotif(updatedNotifications);
    }, []);

    const markNotificationAsRead = useCallback((n, userChats, user, notifications)=>{
        const desiredChat = userChats.find((chat) => {
            const chatMembers = [user._id, n.senderId];
            const isDesired = chat?.members.every((member) => {
                return chatMembers.includes(member)
            });
            return isDesired;
        });
        const mNotif = notifications.map((el) => {
            if (n.senderId === el.senderId) return {...el, isRead: true};
            else return el;
        })
        setNotif(mNotif);
        updateCurrentChat(desiredChat);
    }, []);

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications,notifications)=>{
        const mNotif = notifications.map((el) => {
            let notification;
            thisUserNotifications.forEach(n => {
                if (n.senderId === el.senderId) notification = {...n, isRead: true};
                else notification = el;
            });
            return notification;
        })
        setNotif(mNotif);
    }, []);

    return <chatContext.Provider value={
       {userChats, isChatLoading, chatError,potentialChats, createChat,
        updateCurrentChat, currentChat,
        messagesLoadin, messages, messagesError,
        sendMessage,
        onlineUsers, allUsers,
        notif, markAllNotificationsAsRead, markNotificationAsRead, markThisUserNotificationsAsRead}
    }>
        {children}
    </chatContext.Provider>
}