import chatModel from "../Models/chatModel.js";

export const createChat = async (req, res) => {
    const { first, second } = req.body;

    try {
        const chat = await chatModel.findOne({
            members: { $all: [second, first] }
        });

        if (chat) {
            return res.status(200).json(chat);
        }

        const newChat = new chatModel({
            members: [first, second]
        });

        const response = await newChat.save();
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json("Error creating chat");
    }
};

export const getUserChats = async (req, res) => {
    const userId = req.params.userId;
    try {
        const chat = await chatModel.find({
            members: { $in: [userId] }
        });

        if (!chat) {
            return res.status(404).json("Chat not found");
        }

        res.status(200).json(chat);

    } catch (error) {
        res.status(500).json("Error fetching user chat");
    }
};

export const findChat = async (req, res) => {
    const { first, second } = req.params; 

    try {
        const chat = await chatModel.findOne({
            members: { $all: [second, first] }
        });

        if (!chat) {
            return res.status(404).json("Chat not found");
        }

        res.status(200).json(chat);

    } catch (error) {
        res.status(500).json("Error finding chat");
    }
};
