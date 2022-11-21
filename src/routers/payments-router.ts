import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listPayment, postPayment } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", listPayment)
  .post("/process", postPayment);

export { paymentsRouter };
