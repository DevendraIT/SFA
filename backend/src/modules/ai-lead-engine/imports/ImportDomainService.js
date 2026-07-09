import csv from 'csv-parser';
import xlsx from 'xlsx';
import fs from 'fs';
import axios from 'axios';

/**
 * Domain Service for parsing imported CSV/Excel data.
 * Accepts either a local file path or a remote Cloudinary URL.
 * Does not depend on the DB directly.
 */
export class ImportDomainService {

  /**
   * Determine if input is a remote URL or local file path.
   */
  isRemoteUrl(source) {
    return source.startsWith('http://') || source.startsWith('https://');
  }

  /**
   * Parse a CSV from a Cloudinary URL stream or a local file path.
   * Uses csv-parser for safe, spec-compliant parsing (quoted commas, etc.)
   */
  async parseCSV(source) {
    if (this.isRemoteUrl(source)) {
      return this._parseCSVFromUrl(source);
    }
    return this._parseCSVFromFile(source);
  }

  /**
   * Parse an Excel file from a Cloudinary URL or a local file path.
   */
  async parseExcel(source) {
    if (this.isRemoteUrl(source)) {
      return this._parseExcelFromUrl(source);
    }
    return this._parseExcelFromFile(source);
  }

  // ---- Private CSV helpers ----

  async _parseCSVFromUrl(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const results = [];
        const response = await axios({ url, method: 'GET', responseType: 'stream' });
        response.data
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  }

  async _parseCSVFromFile(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      if (!fs.existsSync(filePath)) {
        return reject(new Error(`File ${filePath} not found.`));
      }
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }

  // ---- Private Excel helpers ----

  async _parseExcelFromUrl(url) {
    const response = await axios({ url, method: 'GET', responseType: 'arraybuffer' });
    const workbook = xlsx.read(response.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }

  async _parseExcelFromFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filePath} not found.`);
    }
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }
}
