import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (expenses, user) => {
  const headers = ['Date', 'Category', 'Subcategory', 'Description', 'Amount'];
  const csvData = expenses.map(exp => [
    exp.date,
    exp.category,
    exp.subcategory || '-',
    exp.description || '-',
    `${user.currency} ${exp.amount}`
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = (expenses, user) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(102, 126, 234);
  doc.text('Expense Report', 14, 20);
  
  // User info
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated for: ${user.fullName}`, 14, 30);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
  
  // Calculate total
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Table
  const tableData = expenses.map(exp => [
    exp.date,
    exp.category,
    exp.subcategory || '-',
    exp.description || '-',
    `${user.currency} ${exp.amount.toFixed(2)}`
  ]);
  
  doc.autoTable({
    startY: 45,
    head: [['Date', 'Category', 'Subcategory', 'Description', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [102, 126, 234] },
    foot: [['', '', '', 'Total', `${user.currency} ${total.toFixed(2)}`]],
    footStyles: { fillColor: [200, 200, 200], fontStyle: 'bold' }
  });
  
  doc.save(`expense_report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const getCategoryIcon = (category) => {
  const icons = {
    'Food': 'bi-cup-straw',
    'Transport': 'bi-bus-front',
    'Shopping': 'bi-cart',
    'Bills': 'bi-receipt',
    'Entertainment': 'bi-controller',
    'Health': 'bi-heart-pulse',
    'Other': 'bi-three-dots'
  };
  return icons[category] || 'bi-circle';
};

export const getCategoryColor = (category) => {
  const colors = {
    'Food': '#FF6384',
    'Transport': '#36A2EB',
    'Shopping': '#FFCE56',
    'Bills': '#4BC0C0',
    'Entertainment': '#9966FF',
    'Health': '#FF9F40',
    'Other': '#C9CBCF'
  };
  return colors[category] || '#999';
};
