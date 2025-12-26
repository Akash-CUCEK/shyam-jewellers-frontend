import jsPDF from "jspdf";

/**
 * Home Service Invoice PDF (Frontend only)
 * No backend call required
 */
export const downloadHomeServicePdf = (service) => {
  const doc = new jsPDF("p", "mm", "a4");

  /* ========= LOGO ========= */
  const logo = new Image();
  logo.src = "/AdminLogo.jpeg"; // public/AdminLogo.jpeg

  logo.onload = () => {
    /* LOGO */
    doc.addImage(logo, "JPEG", 20, 12, 30, 22);

    /* BRAND */
    doc.setFontSize(18);
    doc.setTextColor(124, 29, 29);
    doc.text("Shyam Jewellers", 60, 22);

    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text("Home Service Request", 60, 28);

    doc.setDrawColor(180);
    doc.line(20, 40, 190, 40);

    /* HEADER */
    doc.setTextColor(0);
    doc.setFontSize(13);
    doc.text("SERVICE DETAILS", 20, 50);

    doc.setFontSize(10);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 20, 57);

    let y = 72;

    const row = (label, value) => {
      doc.setFont(undefined, "bold");
      doc.text(`${label}:`, 20, y);
      doc.setFont(undefined, "normal");
      doc.text(String(value ?? "-"), 80, y);
      y += 8;
    };

    /* ========= DETAILS ========= */
    row("Request ID", service.id);
    row("Customer Name", service.name);
    row("Mobile Number", service.phoneNumber);
    row("Service Type", service.serviceType);
    row("Status", service.status);
    row("Address", service.address || "-");
    row(
      "Requested At",
      service.createdAt ? new Date(service.createdAt).toLocaleString() : "-"
    );
    row("Notes", service.notes || "-");

    y += 6;
    doc.line(20, y, 190, y);

    /* FOOTER */
    doc.setFontSize(11);
    doc.text("Thank you for choosing Shyam Jewellers", 20, y + 14);

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("Shyam Jewellers • Trust • Purity • Excellence", 20, y + 22);

    doc.save(`home_service_request_${service.id}.pdf`);
  };
};
