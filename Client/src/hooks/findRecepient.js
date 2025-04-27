import { useState, useEffect } from "react";
import chatModel from "../../../Server/Models/chatModel";
import { getRequest, baseUrl } from "../Utils/Services";


export const userFindRecipient = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const recipientId = chat?.members.find(id => id !== user?._id);

    useEffect(() => {
        const fetchRecipient = async () => {
            if (!recipientId) return;
            
            setIsLoading(true);
            try {
                const response = await getRequest(`${baseUrl}/users/${recipientId}`);
                if (response.error) {
                    setError(response.error);
                } else {
                    setRecipientUser(response);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipient();
    }, [recipientId]); 

    return { recipientUser, isLoading, error };
};