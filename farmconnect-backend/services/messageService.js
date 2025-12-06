const createError = require("http-errors");
const prisma = require("../config/prisma");

const getMessages = async (userId, filters = {}) => {
  const { conversationWith, orderId } = filters;
  
  let where = {
    OR: [
      { senderId: userId },
      { receiverId: userId },
    ],
  };

  if (conversationWith) {
    where.OR = [
      { senderId: userId, receiverId: conversationWith },
      { senderId: conversationWith, receiverId: userId },
    ];
  }

  if (orderId) {
    where.orderId = orderId;
  }

  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          role: true,
        },
      },
      receiver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          role: true,
        },
      },
      order: {
        select: {
          id: true,
          status: true,
          listing: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  return messages;
};

const sendMessage = async (senderId, messageData) => {
  const { receiverId, content, orderId, attachments } = messageData;

  // Check if receiver exists
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!receiver) {
    throw createError(404, "Receiver not found");
  }

  if (senderId === receiverId) {
    throw createError(400, "Cannot send message to yourself");
  }

  // If orderId is provided, verify the sender has access to the order
  if (orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        listing: true,
      },
    });

    if (!order) {
      throw createError(404, "Order not found");
    }

    const hasAccess = order.buyerId === senderId || order.listing.farmerId === senderId;
    if (!hasAccess) {
      throw createError(403, "Access denied to this order");
    }
  }

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      content,
      orderId,
      attachments,
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          role: true,
        },
      },
      receiver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          role: true,
        },
      },
      order: {
        select: {
          id: true,
          status: true,
          listing: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  return message;
};

const markAsRead = async (messageId, userId) => {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw createError(404, "Message not found");
  }

  // Only the receiver can mark a message as read
  if (message.receiverId !== userId) {
    throw createError(403, "You can only mark your own messages as read");
  }

  await prisma.message.update({
    where: { id: messageId },
    data: { isRead: true },
  });
};

module.exports = {
  getMessages,
  sendMessage,
  markAsRead,
};
