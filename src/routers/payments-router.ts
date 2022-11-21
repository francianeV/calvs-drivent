import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getPayment, postPayment } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPayment)
  .post("/process", postPayment);

export { paymentsRouter };
