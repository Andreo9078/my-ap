import XLSX from "xlsx";
import fs from "fs";

// Читаем CSV-файл
const workbook = XLSX.readFile(
  "./scripts/data/Пользователи/inputDataUsers.csv",
  {
    raw: true,
    codepage: 65001 
  }
);

// Берем первый лист
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Преобразуем CSV в JSON
const data = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });

console.log(data);
