const { jsPDF } = require("jspdf");
const { default: autoTable } = require("jspdf-autotable");

try {
  const doc = new jsPDF();
  autoTable(doc, {
    body: [["A", "B"]],
  });
  console.log("lastAutoTable exists on doc?:", !!doc.lastAutoTable);
} catch (e) {
  console.error("autoTable Failed:", e);
}
