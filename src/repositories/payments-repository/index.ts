import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function getPayment(ticketId: number) {
  const payment = prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
  return payment;
}

async function insertPayment(paymentData: Omit<Payment, "id" | "createdAt">) {
  return prisma.payment.create({
    data: paymentData,
  });
}

const paymentsRepository = {
  getPayment,
  insertPayment,
};

export default paymentsRepository;
