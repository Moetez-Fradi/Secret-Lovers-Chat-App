import { useContext, useEffect, useState } from "react";
import { chatContext } from "../Context/ChatContext";
import { getRequest } from "../Utils/Services";
import { baseUrl } from "../Utils/Services";

export const useFetchLastMessage = (chat) => {
    const { newMessage, notif } = useContext(chatContext);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            const res = await getRequest(`${baseUrl}/messages/${chat?._id}`);
            if (res.error) {
                return console.log(res.error);
            }
            const lastMsg = res[res.length - 1];
            setLastMessage(lastMsg);
        };
        if (chat?._id) {
            getMessages();
        }
    }, [chat?._id, newMessage, notif]);

    return { lastMessage };
}
