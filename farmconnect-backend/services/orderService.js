const createError = require("http-errors");
const prisma = require("../config/prisma");

const getUserOrders = async (userId, userRole, filters = {}) => {
  const { status, role } = filters;
  
  let where = {};
  
  // Filter by user role and requested role
  if (userRole === "FARMER" || role === "seller") {
    where.listing = { farmerId: userId };
  } else if (userRole === "BUYER" || role === "buyer") {
    where.buyerId = userId;
  } else {
    // For other roles, show both buyer and seller orders
    where.OR = [
      { buyerId: userId },
      { listing: { farmerId: userId } },
    ];
  }
  
  if (status) {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          isVerified: true,
        },
      },
      listing: {
        include: {
          farmer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
              isVerified: true,
            },
          },
        },
      },
    },
  });

  return orders;
};

const getOrderById = async (orderId, userId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          phoneNumber: true,
          isVerified: true,
        },
      },
      listing: {
        include: {
          farmer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
              phoneNumber: true,
              isVerified: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw createError(404, "Order not found");
  }

  // Check if user has access to this order
  const hasAccess = order.buyerId === userId || order.listing.farmerId === userId;
  if (!hasAccess) {
    throw createError(403, "Access denied");
  }

  return order;
};

const createOrder = async (buyerId, orderData) => {
  const { listingId, quantityOrdered, deliveryAddress, requestedDeliveryDate } = orderData;

  // Check if listing exists and is active
  const listing = await prisma.productListing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw createError(404, "Product listing not found");
  }

  if (listing.status !== "ACTIVE") {
    throw createError(400, "Product listing is not available for purchase");
  }

  if (listing.farmerId === buyerId) {
    throw createError(400, "You cannot order your own products");
  }

  if (quantityOrdered > listing.quantityAvailable) {
    throw createError(400, "Requested quantity exceeds available stock");
  }

  const totalAmount = quantityOrdered * listing.pricePerUnit;

  const order = await prisma.order.create({
    data: {
      buyerId,
      listingId,
      quantityOrdered,
      totalAmount,
      deliveryAddress,
      requestedDeliveryDate: requestedDeliveryDate ? new Date(requestedDeliveryDate) : null,
    },
    include: {
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          isVerified: true,
        },
      },
      listing: {
        include: {
          farmer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
              isVerified: true,
            },
          },
        },
      },
    },
  });

  return order;
};

const updateOrderStatus = async (orderId, userId, newStatus) => {
  // Get the order with listing information
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      listing: true,
    },
  });

  if (!order) {
    throw createError(404, "Order not found");
  }

  // Only the farmer (seller) can update order status
  if (order.listing.farmerId !== userId) {
    throw createError(403, "Only the seller can update order status");
  }

  // Validate status transition
  const validTransitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!validTransitions[order.status].includes(newStatus)) {
    throw createError(400, `Cannot change status from ${order.status} to ${newStatus}`);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: {
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          isVerified: true,
        },
      },
      listing: {
        include: {
          farmer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
              isVerified: true,
            },
          },
        },
      },
    },
  });

  return updatedOrder;
};

module.exports = {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
};
