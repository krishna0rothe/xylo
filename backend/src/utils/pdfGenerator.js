const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateFancyInvoicePDF = async (orderData) => {
  const pdfPath = path.join(__dirname, `../invoices/invoice_${orderData.transactionId}.pdf`);
  const doc = new PDFDocument({ margin: 30 });


  doc.pipe(fs.createWriteStream(pdfPath));

  // Header with logo
  doc.fontSize(28).font("Helvetica-Bold").text("Xylo Gaming Platform", {
    align: "center",
  });
  doc
    .moveDown(0.5)
    .fontSize(14)
    .font("Helvetica")
    .text("Your partner in gaming success!", { align: "center" });
  doc.moveDown(1);

  // Invoice details
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Invoice Details", { underline: true });
  doc.fontSize(12).font("Helvetica").moveDown(0.5);
  doc.text(`Invoice ID: ${orderData.transactionId}`);
  doc.text(`Transaction ID: ${orderData.transactionId || "N/A"}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown(1);

  // Buyer details
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Buyer Details", { underline: true });
  doc.fontSize(12).font("Helvetica").moveDown(0.5);
  doc.text(`Name: ${orderData.buyer.name}`);
  doc.text(`Email: ${orderData.buyer.email}`);
  doc.moveDown(1);

  // Seller details
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Seller Details", { underline: true });
  doc.fontSize(12).font("Helvetica").moveDown(0.5);
  doc.text(`Name: ${orderData.seller.name}`);
  doc.text(`Email: ${orderData.seller.email}`);
  doc.moveDown(1);

  // Game details
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Game Details", { underline: true });
  doc.fontSize(12).font("Helvetica").moveDown(0.5);
  doc.text(`Game Name: ${orderData.game.name}`);
  doc.text(`Price: ₹${orderData.game.price}`);
  doc.moveDown(1);

  // Footer
  doc
    .moveDown(2)
    .fontSize(10)
    .text("Thank you for your purchase!", { align: "center" });
  doc.text("Visit us at https://www.xylogames.com for more games.", {
    align: "center",
  });

  doc.end();
  return pdfPath;
};

module.exports = { generateFancyInvoicePDF };
