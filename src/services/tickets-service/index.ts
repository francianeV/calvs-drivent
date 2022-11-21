import {  TicketTypeEntity } from "@/protocols";
import { invalidDataError, notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { Ticket } from "@prisma/client";

async function getTicketTypes(): Promise<TicketTypeEntity[]> {
  return await ticketsRepository.findTicketTypes();
}

async function getTicketByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  }

  return ticket;
}

async function getTicketTypeByTypeId(ticketTypeId: number) {
  const ticketType = await ticketsRepository.findTicketTypeByTypeId(ticketTypeId);

  return ticketType;
}

async function insertTicket(ticketTypeId: number, userId: number) {
  if (!ticketTypeId) {
    throw invalidDataError;
  }

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const newTicket: Omit<Ticket, "id" | "createdAt"> = {
    status: "RESERVED",
    ticketTypeId,
    enrollmentId: enrollment.id,
    updatedAt: new Date(),
  };

  return await ticketsRepository.createTicket(newTicket);
}

const ticketsService = {
  getTicketTypes,
  getTicketByUserId,
  getTicketTypeByTypeId,
  insertTicket,
};

export default ticketsService;
