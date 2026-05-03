const XLSX = require('xlsx');

/**
 * Generate Excel workbook from student data
 */
const generateStudentExcel = (students, branchLabel) => {
  // Header row
  const worksheetData = [
    ['S.No', 'Full Name', 'Student ID', 'Branch', 'Email',
     'Contact No.', 'WhatsApp No.', 'T-Shirt Size', 'Payment Status',
     'Amount Paid', 'Confirmed By', 'Submitted At', 'Confirmed At']
  ];

  students.forEach((student, index) => {
    worksheetData.push([
      index + 1,
      student.fullName,
      student.studentId,
      student.branch,
      student.email,
      student.contactNumber,
      student.whatsappNumber,
      student.tshirtSize,
      student.paymentStatus.toUpperCase(),
      student.paymentAmount || 0,
      student.paymentConfirmedBy?.name || '-',
      student.formSubmittedAt
        ? new Date(student.formSubmittedAt).toLocaleDateString('en-IN')
        : '-',
      student.paymentConfirmedAt
        ? new Date(student.paymentConfirmedAt).toLocaleDateString('en-IN')
        : '-'
    ]);
  });

  // Size summary
  const sizeSummary = {};
  students.forEach(s => {
    sizeSummary[s.tshirtSize] = (sizeSummary[s.tshirtSize] || 0) + 1;
  });
  const summaryData = [
    ['Size', 'Count'],
    ...Object.entries(sizeSummary).sort()
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();

  const mainSheet = XLSX.utils.aoa_to_sheet(worksheetData);
  mainSheet['!cols'] = [
    { wch: 6 }, { wch: 25 }, { wch: 15 }, { wch: 8 }, { wch: 30 },
    { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 16 }, { wch: 12 },
    { wch: 20 }, { wch: 15 }, { wch: 15 }
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  XLSX.utils.book_append_sheet(workbook, mainSheet, 'Students');
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Size Summary');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  const filename = `MNIT_TShirt_${branchLabel || 'ALL'}_${Date.now()}.xlsx`;

  return { buffer, filename };
};

module.exports = { generateStudentExcel };
