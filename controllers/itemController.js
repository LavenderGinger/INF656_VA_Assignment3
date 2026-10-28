import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getItemsCollection } from "../data/dataMongo.js";
import { ObjectId } from "mongodb";

export async function checkItemId(req, res, next) {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "fail",
                message: "The item ID is invalid.",
            });
        }

        const item = await getItemsCollection().findOne({
            _id: new ObjectId(id),
        });
        if (!item) {
            return res.status(404).json({
                status: "fail",
                message: "The item was not found.",
            });
        }
        req.item = item;
        next();
    } catch (error) {
        next(error);
    }
}

export function validateItemBody(req, res, next) {
    const isCreate = req.method === "POST";
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        return res.status(400).json({
            status: "fail",
            message: "The request body must be a valid JSON object.",
        });
    }

    const { name, category, price } = req.body;
    if (isCreate && (!name || !category || price === undefined)) {
        return res.status(400).json({
            status: "fail",
            message: "The fields name, category, and price are all required.",
        })
    }

    if (price !== undefined) {
        const priceNumber = Number(price);
        if (Number.isNaN(priceNumber) || priceNumber < 0) {
            return res.status(400).json({
                status: "fail",
                message: "The price must be a non-negative number.",
            });
        }
    }

    next();
}

export async function getAllItems(req, res, next) {
    try {
        const items = await getItemsCollection().find({}).toArray();
        res.status(200).json({
            status: "success",
            results: items.length,
            data: { items },
        });
    } catch (error) {
        next(error);
    }
}

export function getItem(req, res) {
    res.status(200).json({
        status: "success",
        data: { item: req.item },
    });
}

export async function createItem(req, res, next) {
    try {
        const itemCollection = getItemsCollection();

        const newItem = {
            name: req.body.name,
            category: req.body.category,
            price: Number(req.body.price),
        };

        const result = await itemCollection.insertOne(newItem);
        const createdItem = await itemCollection.findOne({
            _id: result.insertedId,
        });
        res.status(201).json({
            status: "success",
            data: { item: createdItem },
        });
    } catch (error) {
        next(error);
    }
}

export async function updateItem(req, res, next) {
    try {
        const updates = {};
        if (req.body.name !== undefined) {
            updates.name = req.body.name;
        }
        if (req.body.category !== undefined) {
            updates.category = req.body.category;
        }
        if (req.body.price !== undefined) {
            updates.price = Number(req.body.price);
        }

        const itemCollection = getItemsCollection();
        const result = await itemCollection.updateOne(
            { _id: req.item._id },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Item was not found.",
            });
        }

        const updatedItem = await itemCollection.findOne({
            _id: req.item._id,
        });
        res.status(200).json({
            status: "success",
            data: { item: updatedItem },
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteItem(req, res, next) {
    try {
        const result = await getItemsCollection().deleteOne({
            _id: req.item._id,
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: "fail",
                message: "The item was not found.",
            });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}