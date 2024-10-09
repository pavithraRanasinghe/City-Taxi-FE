import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Table } from "react-bootstrap";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import "bootstrap/dist/css/bootstrap.min.css";

// Dummy Financial Data
const financialData = [
  { id: 1, date: "2024-09-01", earnings: 1200, expenses: 800 },
  { id: 2, date: "2024-09-15", earnings: 1500, expenses: 600 },
  { id: 3, date: "2024-09-30", earnings: 900, expenses: 400 },
];

const FinancialReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // In a real-world app, this data would be fetched from the server
    setReports(financialData);
    setFilteredReports(financialData);
  }, []);

  // Filter reports based on date range
  const handleDateFilter = () => {
    const filtered = reports.filter((report) => {
      const reportDate = new Date(report.date);
      return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
    });
    setFilteredReports(filtered);
  };

  // Function to generate PDF report
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Report", 20, 10);
    
    // Table headers
    doc.autoTable({
      head: [["ID", "Date", "Earnings", "Expenses", "Net Income"]],
      body: filteredReports.map((report) => [
        report.id,
        report.date,
        report.earnings,
        report.expenses,
        report.earnings - report.expenses,
      ]),
    });

    // Save the PDF
    doc.save("financial_report.pdf");
  };

  return (
    <Container className="mt-5">
      <h1>Financial Reports</h1>
      
      {/* Date Filter */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Control 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date" 
          />
        </Col>
        <Col md={4}>
          <Form.Control 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date" 
          />
        </Col>
        <Col md={4}>
          <Button variant="primary" onClick={handleDateFilter}>
            Filter
          </Button>
        </Col>
      </Row>

      {/* Export PDF Button */}
      <Row className="mb-4">
        <Col className="text-right">
          <Button variant="danger" onClick={exportPDF}>
            Export PDF
          </Button>
        </Col>
      </Row>

      {/* Financial Reports Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Earnings</th>
            <th>Expenses</th>
            <th>Net Income</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.date}</td>
              <td>${report.earnings}</td>
              <td>${report.expenses}</td>
              <td>${report.earnings - report.expenses}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default FinancialReports;
