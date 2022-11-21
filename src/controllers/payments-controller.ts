import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function listPayment(req: AuthenticatedRequest, res: Response) {
  const ticketId = req.query.ticketId;
  const { userId } = req;

  try {
    const payment = await paymentsService.getPayment(Number(ticketId), userId);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "invalidDataError") {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const body = req.body;
  const { userId } = req;

  try {
    const payment = await paymentsService.postPayment(body, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "invalidDataError") {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
