import { sendMessage } from "../controllers/message.controller.js";
import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {getMessages, getUsersForSidebar} from "../controllers/message.controller.js";

const router = express.Router();


router.get("/users",protectRoute,getUsersForSidebar)
router.get("/users/:id",protectRoute,getMessages)

router.post("/send/:id",protectRoute,sendMessage)


export default router;