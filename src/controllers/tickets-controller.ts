import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypesArray = await ticketsService.getTicketTypes();

    return res.status(httpStatus.OK).send(ticketTypesArray);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as AuthenticatedRequest;

  try {
    const ticket = await ticketsService.getTicketByUserId(userId);

    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const ticketTypeId: number = req.body.ticketTypeId;
  const { userId } = req as AuthenticatedRequest;

  try {
    const ticket = await ticketsService.insertTicket(ticketTypeId, userId);

    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    if (error.name === "invalidDataError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}
