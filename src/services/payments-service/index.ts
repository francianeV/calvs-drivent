import paymentsRepository from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentsRepository from "@/repositories/enrollment-repository";
import { invalidDataError, notFoundError, unauthorizedError } from "@/errors";
import { Payment } from "@prisma/client";

async function getPayment(ticketId: number, userId: number) {
  if (!ticketId) {
    throw invalidDataError;
  }

  const ticket = await ticketsRepository.getTicketById(ticketId);

  if (!ticket) {
    throw notFoundError();
  }

  const enrollment = await enrollmentsRepository.findEnrollmentByUserId(userId);

  if (enrollment.id !== ticket.enrollmentId) {
    throw unauthorizedError();
  }

  const payment = await paymentsRepository.getPayment(ticketId);

  return payment;
}

async function postPayment(body: BodyCard, userId: number) {
  if (!body.ticketId) {
    throw invalidDataError;
  }
  if (!body.cardData) {
    throw invalidDataError;
  }

  const ticket = await ticketsRepository.getTicketById(body.ticketId);

  if (!ticket) {
    throw notFoundError();
  }

  const enrollment = await enrollmentsRepository.findEnrollmentByUserId(userId);

  if (enrollment.id !== ticket.enrollmentId) {
    throw unauthorizedError();
  }

  const ticketType = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  const price = ticketType.TicketType.price;

  const lastDigits = body.cardData.number.toString().slice(-4);

  const paymentData: Omit<Payment, "id" | "createdAt"> = {
    ticketId: body.ticketId,
    value: price,
    cardIssuer: body.cardData.issuer,
    cardLastDigits: lastDigits,
    updatedAt: new Date(),
  };

  await ticketsRepository.updateTicket(ticket.id);
  
  const payment = await paymentsRepository.insertPayment(paymentData);

  return payment;
}

type BodyCard = {
  ticketId: number;
  cardData: CardData;
};

type CardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

const paymentsService = {
  getPayment,
  postPayment
};

export default paymentsService;
