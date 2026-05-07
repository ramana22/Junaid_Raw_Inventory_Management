// Soap Manufacturing System - Google Apps Script Backend
// Sheet ID: 1-twqY8w9hto179qrQ5nd0BSc8o85d13kVB5DyDaaKcM

const SHEET_ID = '1-twqY8w9hto179qrQ5nd0BSc8o85d13kVB5DyDaaKcM';

// Sheet names
const SHEETS = {
  EMPLOYEES: 'Employees',
  PRODUCTS: 'Products',
  INGREDIENTS: 'Ingredients',
  RAW_PRODUCT_DETAILS: 'RAW Product Details',
  BATCH_PROCESSED: 'BATCH PROCESSED',
  ACTIVITY_LOG: 'Activity Log'
};

/**
 * Initialize sheets with headers
 */
function initializeSheets() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // Create RAW Product Details sheet
  if (!getSheetByName(SHEETS.RAW_PRODUCT_DETAILS)) {
    const sheet = ss.insertSheet(SHEETS.RAW_PRODUCT_DETAILS);
    sheet.appendRow([
      'Date',
      'PO Number',
      'Company Name',
      'Ingredient',
      'Weight (oz)',
      'Price ($)',
      'Price Per OZ',
      'Timestamp'
    ]);
    formatHeader(sheet);
  }

  // Create BATCH PROCESSED sheet
  if (!getSheetByName(SHEETS.BATCH_PROCESSED)) {
    const sheet = ss.insertSheet(SHEETS.BATCH_PROCESSED);
    sheet.appendRow([
      'Batch Date',
      'Batch ID',
      'Company Name',
      'Prepared By',
      'Product Name',
      'Ingredient Name',
      'Weight In OZ',
      'Price',
      'Timestamp'
    ]);
    formatHeader(sheet);
  }

  // Create Activity Log sheet
  if (!getSheetByName(SHEETS.ACTIVITY_LOG)) {
    const sheet = ss.insertSheet(SHEETS.ACTIVITY_LOG);
    sheet.appendRow([
      'Timestamp',
      'User ID',
      'User Name',
      'Action',
      'Details',
      'Status'
    ]);
    formatHeader(sheet);
  }
}

/**
 * Format header row
 */
function formatHeader(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setBackground('#667eea');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setFrozenRows(1);
}

/**
 * Get sheet by name
 */
function getSheetByName(name) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(name);
}

/**
 * Get employees data for dropdown
 */
function getEmployees() {
  const sheet = getSheetByName(SHEETS.EMPLOYEES);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const employees = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      employees.push({
        id: data[i][0],
        name: data[i][1],
        role: data[i][2]
      });
    }
  }
  
  return employees;
}

/**
 * Get products data for dropdown
 */
function getProducts() {
  const sheet = getSheetByName(SHEETS.PRODUCTS);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const products = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1]) {
      products.push({
        id: data[i][0],
        name: data[i][1]
      });
    }
  }
  
  return products;
}

/**
 * Get ingredients data for dropdown
 */
function getIngredients() {
  const sheet = getSheetByName(SHEETS.INGREDIENTS);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const ingredients = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1]) {
      ingredients.push({
        id: data[i][0],
        name: data[i][1]
      });
    }
  }
  
  return ingredients;
}

/**
 * Authenticate employee login
 */
function authenticateEmployee(employeeId, password) {
  const sheet = getSheetByName(SHEETS.EMPLOYEES);
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === employeeId && data[i][3] === password) {
      return {
        id: data[i][0],
        name: data[i][1],
        role: data[i][2],
        company: data[i][4] || 'AMAZON'
      };
    }
  }
  
  return null;
}

/**
 * Submit raw material entry
 */
function submitRawMaterial(payload) {
  try {
    const sheet = getSheetByName(SHEETS.RAW_PRODUCT_DETAILS);
    if (!sheet) {
      return { success: false, error: 'Sheet not found' };
    }

    const { date, poNumber, companyName, ingredients } = payload;

    for (const ingredient of ingredients) {
      sheet.appendRow([
        date,
        poNumber,
        companyName,
        ingredient.ingredient,
        ingredient.weight,
        ingredient.price,
        ingredient.pricePerOz,
        new Date()
      ]);
    }

    logActivity(payload.userId, payload.userName, 'RAW_MATERIAL_SUBMIT', 
      `Submitted ${ingredients.length} ingredients with PO ${poNumber}`, 'SUCCESS');

    return { 
      success: true, 
      message: `${ingredients.length} ingredients added successfully`,
      poNumber: poNumber 
    };
  } catch (error) {
    logActivity(payload.userId, payload.userName, 'RAW_MATERIAL_SUBMIT', 
      error.toString(), 'ERROR');
    return { success: false, error: error.toString() };
  }
}

/**
 * Get latest price per oz for an ingredient
 */
function getIngredientLatestPrice(ingredient, date) {
  const sheet = getSheetByName(SHEETS.RAW_PRODUCT_DETAILS);
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  let latestPrice = null;
  let latestDate = null;

  for (let i = 1; i < data.length; i++) {
    if (data[i][3] && data[i][3].toLowerCase() === ingredient.toLowerCase()) {
      const rowDate = new Date(data[i][0]);
      const queryDate = new Date(date);

      if (!latestDate || rowDate <= queryDate) {
        if (!latestDate || rowDate > latestDate) {
          latestDate = rowDate;
          latestPrice = parseFloat(data[i][6]) || 0;
        }
      }
    }
  }

  return latestPrice;
}

/**
 * Submit batch entry
 */
function submitBatch(payload) {
  try {
    const sheet = getSheetByName(SHEETS.BATCH_PROCESSED);
    if (!sheet) {
      return { success: false, error: 'Sheet not found' };
    }

    const { date, batchId, preparedBy, companyName, items } = payload;

    for (const item of items) {
      const price = item.price || 0;
      
      sheet.appendRow([
        date,
        batchId,
        companyName,
        preparedBy,
        item.productName,
        item.ingredient,
        item.weight,
        price,
        new Date()
      ]);
    }

    logActivity(payload.userId, payload.userName, 'BATCH_SUBMIT', 
      `Submitted batch ${batchId} with ${items.length} items`, 'SUCCESS');

    return { 
      success: true, 
      message: `Batch ${batchId} created successfully`,
      batchId: batchId 
    };
  } catch (error) {
    logActivity(payload.userId, payload.userName, 'BATCH_SUBMIT', 
      error.toString(), 'ERROR');
    return { success: false, error: error.toString() };
  }
}

/**
 * Get product pricing data
 */
function getProductPricing(filters) {
  try {
    const sheet = getSheetByName(SHEETS.BATCH_PROCESSED);
    if (!sheet) return { success: false, error: 'Sheet not found' };

    const data = sheet.getDataRange().getValues();
    const results = {};

    for (let i = 1; i < data.length; i++) {
      const batchDate = data[i][0];
      const batchId = data[i][1];
      const productName = data[i][4];
      const price = parseFloat(data[i][7]) || 0;

      // Apply filters
      if (filters.productName && !productName.toLowerCase().includes(filters.productName.toLowerCase())) {
        continue;
      }
      if (filters.batchId && batchId !== filters.batchId) {
        continue;
      }
      if (filters.fromDate && new Date(batchDate) < new Date(filters.fromDate)) {
        continue;
      }
      if (filters.toDate && new Date(batchDate) > new Date(filters.toDate)) {
        continue;
      }

      const key = `${batchId}_${productName}_${batchDate}`;
      if (!results[key]) {
        results[key] = {
          batchDate,
          batchId,
          productName,
          totalPrice: 0
        };
      }
      results[key].totalPrice += price;
    }

    const resultArray = Object.values(results);
    logActivity(filters.userId, filters.userName, 'PRICING_SEARCH', 
      `Searched pricing data with filters`, 'SUCCESS');

    return { 
      success: true, 
      data: resultArray 
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Log user activity
 */
function logActivity(userId, userName, action, details, status = 'INFO') {
  try {
    const sheet = getSheetByName(SHEETS.ACTIVITY_LOG);
    if (!sheet) return;

    sheet.appendRow([
      new Date(),
      userId || 'UNKNOWN',
      userName || 'UNKNOWN',
      action,
      details,
      status
    ]);
  } catch (error) {
    Logger.log('Error logging activity: ' + error.toString());
  }
}

/**
 * Handle POST requests from HTML form
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    let result;

    switch (payload.action) {
      case 'authenticate':
        result = authenticateEmployee(payload.employeeId, payload.password);
        if (result) {
          logActivity(result.id, result.name, 'LOGIN', 'User logged in', 'SUCCESS');
          return ContentService.createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
        } else {
          logActivity(payload.employeeId, 'UNKNOWN', 'LOGIN', 'Failed login attempt', 'ERROR');
          return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid credentials' }))
            .setMimeType(ContentService.MimeType.JSON);
        }

      case 'getDropdownData':
        result = {
          employees: getEmployees(),
          products: getProducts(),
          ingredients: getIngredients()
        };
        return ContentService.createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);

      case 'submitRawMaterial':
        result = submitRawMaterial(payload);
        return ContentService.createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);

      case 'submitBatch':
        result = submitBatch(payload);
        return ContentService.createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);

      case 'getProductPricing':
        result = getProductPricing(payload);
        return ContentService.createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);

      case 'logActivity':
        logActivity(payload.userId, payload.userName, payload.action, payload.details, payload.status);
        return ContentService.createTextOutput(JSON.stringify({ success: true }))
          .setMimeType(ContentService.MimeType.JSON);

      default:
        return ContentService.createTextOutput(JSON.stringify({ error: 'Unknown action' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function - run from Apps Script editor
 */
function testSetup() {
  try {
    initializeSheets();
    Logger.log('✓ Sheets initialized');

    const employees = getEmployees();
    Logger.log('✓ Employees loaded: ' + employees.length);

    const products = getProducts();
    Logger.log('✓ Products loaded: ' + products.length);

    const ingredients = getIngredients();
    Logger.log('✓ Ingredients loaded: ' + ingredients.length);

    Logger.log('Setup test completed successfully!');
  } catch (error) {
    Logger.log('✗ Error: ' + error.toString());
  }
}
