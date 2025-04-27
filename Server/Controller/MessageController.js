import messageModel from "../Models/messageModel.js"

export const createMessage = async (req, res) => {
    const {chatId, senderId, text} = req.body;

    const message = new messageModel({
        chatId, senderId, text
    });
    try {

        const response = await message.save();
        res.status(200).json(response);

    } catch(error) {
        res.status(500).json(error);
    }
};

export const getMessage = async (req, res) => {
    const {chatId} = req.params;
    try {

        const messages = await messageModel.find({chatId});
        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json(error);
    }
}