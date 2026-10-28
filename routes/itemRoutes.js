import express from "express";
import { checkItemId, validateItemBody, getAllItems, getItem, createItem, updateItem, deleteItem } from "../controllers/itemController.js";

const itemRouter = express.Router();

itemRouter
    .route("/")
    .get(getAllItems)
    .post(validateItemBody, createItem);

itemRouter
    .route("/:id")
    .get(checkItemId, getItem)
    .put(checkItemId, validateItemBody, updateItem)
    .patch(checkItemId, validateItemBody, updateItem)
    .delete(checkItemId, deleteItem);

export default itemRouter;