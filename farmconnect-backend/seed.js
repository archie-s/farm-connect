const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Hash password for all users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create users
  const farmer1 = await prisma.user.create({
    data: {
      email: "farmer1@farmconnect.co.ke",
      password: hashedPassword,
      firstName: "John",
      lastName: "Mwangi",
      phoneNumber: "+254712345678",
      role: "FARMER",
      location: "Nakuru, Kenya",
      isVerified: true,
    },
  });

  const farmer2 = await prisma.user.create({
    data: {
      email: "farmer2@farmconnect.co.ke",
      password: hashedPassword,
      firstName: "Mary",
      lastName: "Wanjiku",
      phoneNumber: "+254723456789",
      role: "FARMER",
      location: "Kiambu, Kenya",
      isVerified: true,
    },
  });

  const buyer1 = await prisma.user.create({
    data: {
      email: "buyer1@farmconnect.co.ke",
      password: hashedPassword,
      firstName: "David",
      lastName: "Ochieng",
      phoneNumber: "+254734567890",
      role: "BUYER",
      location: "Nairobi, Kenya",
      isVerified: true,
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      email: "buyer2@farmconnect.co.ke",
      password: hashedPassword,
      firstName: "Grace",
      lastName: "Akinyi",
      phoneNumber: "+254745678901",
      role: "BUYER",
      location: "Mombasa, Kenya",
      isVerified: true,
    },
  });

  const mfi1 = await prisma.user.create({
    data: {
      email: "mfi1@farmconnect.co.ke",
      password: hashedPassword,
      firstName: "Samuel",
      lastName: "Kipchoge",
      phoneNumber: "+254756789012",
      role: "MFI",
      location: "Eldoret, Kenya",
      isVerified: true,
    },
  });

  const extensionOfficer = await prisma.user.create({
    data: {
      email: "extension@farmconnect.co.ke",
      password: hashedPassword,
      firstName: "Peter",
      lastName: "Kamau",
      phoneNumber: "+254767890123",
      role: "EXTENSION_OFFICER",
      location: "Nyeri, Kenya",
      isVerified: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@farmconnect.co.ke",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      phoneNumber: "+254778901234",
      role: "ADMIN",
      location: "Nairobi, Kenya",
      isVerified: true,
    },
  });

  console.log("✅ Users created successfully");

  // Create product listings
  const listing1 = await prisma.productListing.create({
    data: {
      title: "Fresh Tomatoes",
      description: "High quality tomatoes, freshly harvested from organic farm",
      category: "Vegetables",
      pricePerUnit: 50.0,
      unitType: "kg",
      quantityAvailable: 500,
      location: "Nakuru, Kenya",
      status: "ACTIVE",
      harvestDate: new Date("2024-10-01"),
      expiryDate: new Date("2024-10-15"),
      farmerId: farmer1.id,
      images: [
        "https://images.unsplash.com/photo-1546470427-e5ac5d3b7b5b",
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea"
      ],
      qualityCertifications: ["Organic", "GAP Certified"],
    },
  });

  const listing2 = await prisma.productListing.create({
    data: {
      title: "Sweet Potatoes",
      description: "Nutritious orange-fleshed sweet potatoes, perfect for healthy meals",
      category: "Root Vegetables",
      pricePerUnit: 35.0,
      unitType: "kg",
      quantityAvailable: 300,
      location: "Kiambu, Kenya",
      status: "ACTIVE",
      harvestDate: new Date("2024-09-28"),
      expiryDate: new Date("2024-11-28"),
      farmerId: farmer2.id,
      images: [
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90"
      ],
    },
  });

  const listing3 = await prisma.productListing.create({
    data: {
      title: "Green Beans",
      description: "Fresh green beans, hand-picked and ready for market",
      category: "Vegetables",
      pricePerUnit: 80.0,
      unitType: "kg",
      quantityAvailable: 150,
      location: "Nakuru, Kenya",
      status: "ACTIVE",
      harvestDate: new Date("2024-10-05"),
      expiryDate: new Date("2024-10-12"),
      farmerId: farmer1.id,
      images: [
        "https://images.unsplash.com/photo-1553621042-f6e147245754"
      ],
    },
  });

  const listing4 = await prisma.productListing.create({
    data: {
      title: "Maize (Corn)",
      description: "Dried maize kernels, suitable for animal feed or human consumption",
      category: "Grains",
      pricePerUnit: 40.0,
      unitType: "kg",
      quantityAvailable: 1000,
      location: "Kiambu, Kenya",
      status: "ACTIVE",
      harvestDate: new Date("2024-09-15"),
      farmerId: farmer2.id,
      images: [
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076"
      ],
    },
  });

  console.log("✅ Product listings created successfully");

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      buyerId: buyer1.id,
      listingId: listing1.id,
      quantityOrdered: 50,
      totalAmount: 2500.0,
      status: "CONFIRMED",
      deliveryAddress: "123 Market Street, Nairobi",
      requestedDeliveryDate: new Date("2024-10-12"),
    },
  });

  const order2 = await prisma.order.create({
    data: {
      buyerId: buyer2.id,
      listingId: listing2.id,
      quantityOrdered: 100,
      totalAmount: 3500.0,
      status: "PENDING",
      deliveryAddress: "456 Coast Road, Mombasa",
      requestedDeliveryDate: new Date("2024-10-14"),
    },
  });

  const order3 = await prisma.order.create({
    data: {
      buyerId: buyer1.id,
      listingId: listing3.id,
      quantityOrdered: 25,
      totalAmount: 2000.0,
      status: "SHIPPED",
      deliveryAddress: "789 Business District, Nairobi",
      requestedDeliveryDate: new Date("2024-10-10"),
    },
  });

  console.log("✅ Orders created successfully");

  // Create messages
  await prisma.message.create({
    data: {
      senderId: buyer1.id,
      receiverId: farmer1.id,
      orderId: order1.id,
      content: "Hello! I'm interested in your tomatoes. Are they still available?",
    },
  });

  await prisma.message.create({
    data: {
      senderId: farmer1.id,
      receiverId: buyer1.id,
      orderId: order1.id,
      content: "Yes, they are still available! The tomatoes are fresh and of high quality.",
    },
  });

  await prisma.message.create({
    data: {
      senderId: buyer1.id,
      receiverId: farmer1.id,
      orderId: order1.id,
      content: "Great! I would like to place an order for 50kg. When can you deliver?",
    },
  });

  await prisma.message.create({
    data: {
      senderId: buyer2.id,
      receiverId: farmer2.id,
      content: "Hi Mary, I saw your sweet potatoes listing. Do you have bulk pricing for 100kg+?",
    },
  });

  console.log("✅ Messages created successfully");

  // Create loan applications
  await prisma.loanApplication.create({
    data: {
      farmerId: farmer1.id,
      mfiId: mfi1.id,
      requestedAmount: 100000.0,
      loanPurpose: "Purchase seeds and fertilizer for next planting season",
      repaymentPeriodMonths: 12,
      interestRate: 12.5,
      status: "APPROVED",
      submittedAt: new Date("2024-09-15"),
      reviewedAt: new Date("2024-09-20"),
      supportingDocuments: [
        "farm_registration.pdf",
        "previous_harvest_records.pdf"
      ],
      mfiNotes: "Good credit history and viable farming plan. Approved for full amount.",
    },
  });

  await prisma.loanApplication.create({
    data: {
      farmerId: farmer2.id,
      requestedAmount: 75000.0,
      loanPurpose: "Expand greenhouse farming operations",
      repaymentPeriodMonths: 18,
      status: "SUBMITTED",
      submittedAt: new Date("2024-10-01"),
      supportingDocuments: [
        "business_plan.pdf",
        "land_title.pdf"
      ],
    },
  });

  console.log("✅ Loan applications created successfully");

  // Create training modules
  const trainingModule1 = await prisma.trainingModule.create({
    data: {
      title: "Climate-Smart Farming Techniques",
      description: "Learn sustainable farming practices that adapt to climate change",
      category: "Sustainable Agriculture",
      content: "This module covers various climate-smart farming techniques including crop rotation, water conservation, and soil management.",
      durationMinutes: 45,
      difficultyLevel: "BEGINNER",
      isPublished: true,
      tags: ["climate", "sustainability", "farming", "techniques"],
      videoUrls: [
        "https://example.com/video1.mp4"
      ],
      documentUrls: [
        "https://example.com/guide1.pdf"
      ],
    },
  });

  const trainingModule2 = await prisma.trainingModule.create({
    data: {
      title: "Organic Pest Management",
      description: "Natural methods to control pests without harmful chemicals",
      category: "Pest Control",
      content: "Learn about biological pest control, companion planting, and organic pesticides.",
      durationMinutes: 60,
      difficultyLevel: "INTERMEDIATE",
      isPublished: true,
      tags: ["organic", "pest", "management", "natural"],
      videoUrls: [
        "https://example.com/video2.mp4"
      ],
      documentUrls: [
        "https://example.com/guide2.pdf"
      ],
    },
  });

  console.log("✅ Training modules created successfully");

  // Create training progress
  await prisma.userTrainingProgress.create({
    data: {
      userId: farmer1.id,
      trainingModuleId: trainingModule1.id,
      progressPercentage: 100,
      isCompleted: true,
      completedAt: new Date("2024-09-25"),
    },
  });

  await prisma.userTrainingProgress.create({
    data: {
      userId: farmer1.id,
      trainingModuleId: trainingModule2.id,
      progressPercentage: 75,
      isCompleted: false,
    },
  });

  await prisma.userTrainingProgress.create({
    data: {
      userId: farmer2.id,
      trainingModuleId: trainingModule1.id,
      progressPercentage: 50,
      isCompleted: false,
    },
  });

  console.log("✅ Training progress created successfully");

  // Create weather alerts
  await prisma.weatherAlert.create({
    data: {
      location: "Nakuru, Kenya",
      alertType: "RAIN",
      title: "Heavy Rainfall Expected",
      description: "Heavy rainfall is expected in the next 48 hours. Farmers should prepare for potential flooding.",
      severity: "HIGH",
      validFrom: new Date("2024-10-10"),
      validUntil: new Date("2024-10-12"),
      affectedCrops: ["tomatoes", "maize", "beans"],
    },
  });

  await prisma.weatherAlert.create({
    data: {
      location: "Kiambu, Kenya",
      alertType: "PEST_OUTBREAK",
      title: "Fall Armyworm Alert",
      description: "Fall armyworm has been detected in the area. Check your maize crops regularly.",
      severity: "MEDIUM",
      validFrom: new Date("2024-10-08"),
      validUntil: new Date("2024-10-15"),
      affectedCrops: ["maize", "sorghum"],
    },
  });

  console.log("✅ Weather alerts created successfully");

  // Create market prices
  await prisma.marketPrice.create({
    data: {
      productName: "Tomatoes",
      category: "Vegetables",
      location: "Nairobi Market",
      pricePerUnit: 55.0,
      unitType: "kg",
      marketName: "Wakulima Market",
      priceDate: new Date("2024-10-09"),
      priceTrends: {
        "lastWeek": 52.0,
        "lastMonth": 48.0,
        "trend": "increasing"
      },
    },
  });

  await prisma.marketPrice.create({
    data: {
      productName: "Sweet Potatoes",
      category: "Root Vegetables",
      location: "Nakuru Market",
      pricePerUnit: 38.0,
      unitType: "kg",
      marketName: "Nakuru Central Market",
      priceDate: new Date("2024-10-09"),
      priceTrends: {
        "lastWeek": 35.0,
        "lastMonth": 32.0,
        "trend": "increasing"
      },
    },
  });

  console.log("✅ Market prices created successfully");

  // Create credit scores
  await prisma.creditScore.create({
    data: {
      score: 750,
      scoreFactors: {
        "paymentHistory": 85,
        "farmingExperience": 90,
        "landOwnership": 80,
        "previousLoans": 75
      },
      transactionHistory: {
        "totalTransactions": 25,
        "averageAmount": 15000,
        "onTimePayments": 23
      },
      farmingHistory: {
        "yearsOfExperience": 8,
        "cropTypes": ["tomatoes", "beans", "maize"],
        "averageYield": "above_average"
      },
      lastCalculated: new Date("2024-10-01"),
      user: {
        connect: { id: farmer1.id }
      },
    },
  });

  await prisma.creditScore.create({
    data: {
      score: 680,
      scoreFactors: {
        "paymentHistory": 75,
        "farmingExperience": 70,
        "landOwnership": 85,
        "previousLoans": 65
      },
      transactionHistory: {
        "totalTransactions": 18,
        "averageAmount": 12000,
        "onTimePayments": 16
      },
      farmingHistory: {
        "yearsOfExperience": 5,
        "cropTypes": ["sweet_potatoes", "maize"],
        "averageYield": "average"
      },
      lastCalculated: new Date("2024-10-01"),
      user: {
        connect: { id: farmer2.id }
      },
    },
  });

  console.log("✅ Credit scores created successfully");

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: farmer1.id,
      title: "New Order Received",
      message: "You have received a new order for 50kg of tomatoes from David Ochieng",
      type: "ORDER",
      data: {
        "orderId": order1.id,
        "buyerName": "David Ochieng"
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: buyer1.id,
      title: "Order Confirmed",
      message: "Your order for tomatoes has been confirmed by the farmer",
      type: "ORDER",
      data: {
        "orderId": order1.id,
        "farmerName": "John Mwangi"
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: farmer1.id,
      title: "Weather Alert",
      message: "Heavy rainfall expected in your area. Take necessary precautions.",
      type: "WEATHER",
      data: {
        "alertType": "RAIN",
        "severity": "HIGH"
      },
    },
  });

  console.log("✅ Notifications created successfully");

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log("- 7 users created (2 farmers, 2 buyers, 1 MFI, 1 extension officer, 1 admin)");
  console.log("- 4 product listings created");
  console.log("- 3 orders created");
  console.log("- 4 messages created");
  console.log("- 2 loan applications created");
  console.log("- 2 training modules created");
  console.log("- 3 training progress records created");
  console.log("- 2 weather alerts created");
  console.log("- 2 market prices created");
  console.log("- 2 credit scores created");
  console.log("- 3 notifications created");
  console.log("\n🔑 Test Credentials:");
  console.log("Farmer: farmer1@farmconnect.co.ke / password123");
  console.log("Buyer: buyer1@farmconnect.co.ke / password123");
  console.log("MFI: mfi1@farmconnect.co.ke / password123");
  console.log("Admin: admin@farmconnect.co.ke / password123");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
