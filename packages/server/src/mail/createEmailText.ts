// Dear [Vendor Name],

// I am writing to remind you that your invoice [Invoice Number] is due for payment in [No. of days] day on [Due Date]. As a valued client, we greatly appreciate your promptness in settling your invoices.

// Please ensure that the payment is made on time to avoid any unnecessary late payment charges. If you have already made the payment, please disregard this message.

// If you have any queries or concerns regarding this invoice, please do not hesitate to contact us. We are always ready to assist you in any way possible.

// Thank you for your cooperation and prompt attention to this matter.

// Best regards,

// Team Oren

export function createEmailText(
  invoicenumber: string,
  vendorname: string,
  duedate: Date
) {
  const currentDate = new Date();
  const numberOfDays = Math.ceil(
    (duedate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
  );
  const formattedDueDate = duedate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `Dear ${vendorname},

I am writing to remind you that your invoice ${invoicenumber} is due for payment in ${numberOfDays} day on ${formattedDueDate}. As a valued client, we greatly appreciate your promptness in settling your invoices.

Please ensure that the payment is made on time to avoid any unnecessary late payment charges. If you have already made the payment, please disregard this message.

If you have any queries or concerns regarding this invoice, please do not hesitate to contact us. We are always ready to assist you in any way possible.

Thank you for your cooperation and prompt attention to this matter.

Best regards,

Team Oren`;
}
