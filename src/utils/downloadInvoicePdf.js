import jsPDF from "jspdf";

export const downloadInvoicePdf = (order) => {
  const doc = new jsPDF("p", "mm", "a4");

  const logo = new Image();
  logo.src = "/AdminLogo.jpeg";

  logo.onload = () => {
    doc.addImage(logo, "JPEG", 20, 10, 35, 25);

    doc.setFontSize(18);
    doc.setTextColor(124, 29, 29);
    doc.text("Shyam Jewellers", 60, 22);

    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text("Premium Jewellery Store", 60, 28);

    doc.setDrawColor(180);
    doc.line(20, 40, 190, 40);

    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text("INVOICE", 20, 50);

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

    row("Order ID", order.id);
    row("Customer Name", order.customerName);
    row("Customer Email", order.customerEmail);
    row("Customer Phone", order.customerPhone);
    row("Address", order.address);
    row("Order Date", order.orderDate);
    row("Order Status", order.orderStatus);
    row("Payment Method", order.paymentMethod);

    y += 4;
    doc.line(20, y, 190, y);
    y += 10;

    row("Total Cost", `Rs. ${order.totalCost}`);
    row("Due Amount", `Rs. ${order.dueAmount}`);

    y += 10;
    doc.line(20, y, 190, y);

    doc.setFontSize(11);
    doc.text("Thank you for shopping with us", 20, y + 12);

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("Shyam Jewellers - Trust, Purity, Excellence", 20, y + 20);

    doc.save(`invoice_order_${order.id}.pdf`);
  };
};
