import { MongoClient } from "mongodb";
import "dotenv/config";

let client;
let database;

export async function connectToDatabase() {
    const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
    const databaseName = process.env.MONGODB_DB ?? "item_database";

    client = new MongoClient(uri);
    await client.connect();

    database = client.db(databaseName);
    await database.command({ ping: 1 });

    console.log("Successfully connected to MongoDB database!");
}

export function getItemsCollection() {
    if (!database) {
        throw new Error("Database is not connected.");
    }
    return database.collection("items");
}

export async function closeDatabaseConnection() {
    if (client) {
        await client.close();
    }
}