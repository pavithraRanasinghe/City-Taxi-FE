import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const generateExcelFile = async (headers, data, fileName) => {
  // Create a new workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Add headers to the worksheet
  worksheet.columns = headers;

  // Add rows from the data array
  data.forEach((driver) => {
    // Create an object for each row based on the headers
    const row = headers.reduce((acc, header, index) => {
      acc[header.key] = driver[index];
      return acc;
    }, {});
    worksheet.addRow(row);
  });

  // Create buffer to save the file
  const buffer = await workbook.xlsx.writeBuffer();

  // Use file-saver to save the file
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};

export default generateExcelFile;
