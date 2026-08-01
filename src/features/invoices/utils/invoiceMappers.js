export function mapInvoiceFormToPayload(formData, invoiceTotal) {
  return {
    invoiceNumber: String(formData.invoiceNumber).trim().toUpperCase(),
    clientId: String(formData.clientId),
    projectId: String(formData.projectId),
    hoursWorked: Number(formData.hoursWorked),
    hourlyRate: Number(formData.hourlyRate),
    total: Number(invoiceTotal),
    status: formData.status,
    issueDate: formData.issueDate,
    dueDate: formData.dueDate,
  };
}
