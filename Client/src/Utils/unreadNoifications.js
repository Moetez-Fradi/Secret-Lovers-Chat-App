export const unreadNoifications = (notif, user) => {
    const unread = notif.filter((n) => !n.isRead && n.senderId !== user._id);
    return unread;
};

