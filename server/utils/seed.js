import Plan from '../Models/Plan.model.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

const objs = [
    {
        name: "Free",
        capacity: 1024 * 1024 * 1024,
        support: "Email support",
        price: 0,
        key: "free"
    },
    {
        name: "Silver",
        capacity: 1024 * 1024 * 1024,
        support: "Email support",
        price: 1,
        key: "silver"
    },
    {
        name: "Gold",
        capacity: 5 * 1024 * 1024 * 1024,
        support: "Priority email support",
        price: 10,
        key: "gold"
    },
    {
        name: "Platinum",
        capacity: 10 * 1024 * 1024 * 1024,
        support: "24/7 Phone & Email support",
        price: 10, // updated from 10 to 20 (if that's correct)
        key: "platinum"
    }
];

export async function seed() {
    try {
        await Plan.deleteMany({});
        await Plan.insertMany(objs);
        console.log("Seeding completed!");
    } catch (err) {
        console.error("Error during seeding:", err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
