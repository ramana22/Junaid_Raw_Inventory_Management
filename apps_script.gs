// Soap Manufacturing System - Google Apps Script Backend
// WITH CORS SUPPORT FOR WEB APP DEPLOYMENT
// Sheet ID: 1exwbP0rCF7TSngMJm5f_zbVoK39DFjwSejxu9pA7sMw

const SHEET_ID = '1exwbP0rCF7TSngMJm5f_zbVoK39DFjwSejxu9pA7sMw';

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
 * MAIN HANDLER - Handles both GET and POST requests
 * INCLUDES CORS HEADERS
 */
function doPost(e) {
  try {
    // Parse the request
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    console.log('📥 Received action:', action);
    console.log('📥 Payload:', payload);

    let result;

    // Route to appropriate function
    switch(action) {
      case 'test':
        result = { success: true, message: 'API connection successful' };
        break;

      case 'authenticate':
        result = authenticateEmployee(payload.employeeId, payload.password);
        break;

      case 'getDropdownData':
        result = {
          ingredients: getIngredients(),
          products: getProducts(),
          employees: getEmployees()
        };
        break;

      case 'submitRawMaterial':
        result = submitRawMaterial(payload);
        break;

      case 'submitBatch':
        result = submitBatch(payload);
        break;

      case 'getProductPricing':
        result = getProductPricing(payload);
        break;

      case 'logActivity':
        logActivity(payload.userId, payload.userName, payload.action, payload.details);
        result = { success: true };
        break;

      default:
        result = { error: 'Unknown action: ' + action };
    }

    // Return response with CORS headers
    return createCorsResponse(result);

  } catch (error) {
    console.error('❌ Error:', error.toString());
    return createCorsResponse({ 
      success: false, 
      error: error.toString() 
    });
  }
}

/**
 * Handle GET requests (optional)
 */
function doGet(e) {
  return createCorsResponse({
    message: 'Soap Manufacturing API',
    status: 'running',
    version: '1.0'
  });
}

/**
 * CREATE CORS RESPONSE
 * Adds necessary headers to allow requests from any origin
 */
function createCorsResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

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
  if (!sheet) return { success: false, error: 'Employees sheet not found' };
  if (!employeeId || !password ) return { success: false, error: 'Employees pwd not correct' };


  const data = sheet.getDataRange().getValues();

  const inputEmployeeId = String(employeeId || '').trim();
  const inputPassword = String(password || '').trim();

  for (let i = 1; i < data.length; i++) {
    const sheetEmployeeId = String(data[i][0] || '').trim();
    const sheetPassword = String(data[i][3] || '').trim();

    if (sheetEmployeeId === inputEmployeeId && sheetPassword === inputPassword) {
      return {
        success: true,
        id: sheetEmployeeId,
        name: String(data[i][1] || '').trim(),
        role: String(data[i][2] || '').trim(),
        company: String(data[i][4] || '').trim() || 'AMAZON'
      };
    }
  }

  return {
    success: false,
    error: 'Invalid Employee ID or Password'
  };
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
 * Get latest price per oz for an ingredient from RAW Product Details sheet
 * FIXED: Queries the actual sheet instead of relying on frontend data
 */
function getIngredientLatestPrice(ingredient, batchDate) {
  const sheet = getSheetByName(SHEETS.RAW_PRODUCT_DETAILS);
  if (!sheet) {
    console.log('RAW Product Details sheet not found');
    return null;
  }

  const data = sheet.getDataRange().getValues();
  let latestPrice = null;
  let latestDate = null;
  const ingredientLower = String(ingredient).toLowerCase().trim();
  const queryDate = new Date(batchDate);

  // Loop through all rows to find matching ingredient with latest date on or before batch date
  for (let i = 1; i < data.length; i++) {
    const sheetIngredient = String(data[i][3] || '').toLowerCase().trim();
    const sheetDate = new Date(data[i][0]);
    const sheetPrice = parseFloat(data[i][6]) || 0; // Price Per OZ is in column 6 (0-indexed)

    // Skip if ingredient doesn't match
    if (sheetIngredient !== ingredientLower) continue;

    // Skip if date is after batch date
    if (sheetDate > queryDate) continue;

    // Use this price if it's the latest so far
    if (!latestDate || sheetDate >= latestDate) {
      latestDate = sheetDate;
      latestPrice = sheetPrice;
    }
  }

  console.log(`Found price for ${ingredient}: ${latestPrice} per oz`);
  return latestPrice;
}

/**
 * Submit batch entry
 * FIXED: Looks up prices from RAW Product Details sheet
 */
function submitBatch(payload) {
  try {
    const sheet = getSheetByName(SHEETS.BATCH_PROCESSED);
    if (!sheet) {
      return { success: false, error: 'Sheet not found' };
    }

    const { date, batchId, preparedBy, companyName, items } = payload;

    // Validate required fields
    if (!date || !batchId || !preparedBy || !companyName) {
      return { success: false, error: 'Missing required batch fields' };
    }

    if (!items || items.length === 0) {
      return { success: false, error: 'No items to submit' };
    }

    // Add each item to the sheet
    for (const item of items) {
      // Look up the latest price for this ingredient from RAW Product Details
      let price = parseFloat(item.price) || 0;
      
      // Try to get the real price from sheet if not provided or if it seems wrong
      const sheetPrice = getIngredientLatestPrice(item.ingredient, date);
      if (sheetPrice !== null && sheetPrice > 0) {
        // Recalculate: weight * price per oz
        price = parseFloat(item.weight) * sheetPrice;
        console.log(`Recalculated price for ${item.ingredient}: ${item.weight} oz × $${sheetPrice}/oz = $${price}`);
      }
      
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
      message: `Batch ${batchId} created successfully with ${items.length} items`,
      batchId: batchId,
      itemCount: items.length
    };
  } catch (error) {
    logActivity(payload.userId, payload.userName, 'BATCH_SUBMIT', 
      error.toString(), 'ERROR');
    return { success: false, error: error.toString() };
  }
}

/**
 * Get product pricing data
 * Fixed: Properly aggregates prices and includes batch date
 */
function getProductPricing(filters) {
  try {
    const sheet = getSheetByName(SHEETS.BATCH_PROCESSED);
    if (!sheet) return { success: false, error: 'Sheet not found' };

    const data = sheet.getDataRange().getValues();
    const results = {};

    for (let i = 1; i < data.length; i++) {
      // Get values and convert to strings, handling nulls
      const batchDate = data[i][0] || '';
      const batchId = data[i][1] || '';
      const productName = data[i][4] || '';
      const price = parseFloat(data[i][7]) || 0;

      // Skip empty rows
      if (!batchId || !productName) continue;

      // Convert date for filtering
      const dateForComparison = new Date(batchDate);

      // Apply filters
      if (filters.productName && filters.productName.trim()) {
        if (!String(productName).toLowerCase().includes(String(filters.productName).toLowerCase())) {
          continue;
        }
      }

      if (filters.batchId && filters.batchId.trim()) {
        if (String(batchId) !== String(filters.batchId)) {
          continue;
        }
      }

      if (filters.fromDate && filters.fromDate.trim()) {
        if (dateForComparison < new Date(filters.fromDate)) {
          continue;
        }
      }

      if (filters.toDate && filters.toDate.trim()) {
        if (dateForComparison > new Date(filters.toDate)) {
          continue;
        }
      }

      // Use batchId_productName as key to group by batch and product
      const key = `${String(batchId)}_${String(productName)}`;
      
      if (!results[key]) {
        results[key] = {
          batchDate: formatDate(batchDate),
          batchId: String(batchId),
          productName: String(productName),
          totalPrice: 0
        };
      }

      // Add price to total
      results[key].totalPrice += price;
    }

    // Convert to array and sort by date (newest first)
    const resultArray = Object.values(results);
    resultArray.sort((a, b) => {
      const dateA = new Date(a.batchDate);
      const dateB = new Date(b.batchDate);
      return dateB - dateA;
    });

    logActivity(
      filters.userId || 'SYSTEM',
      filters.userName || 'SYSTEM',
      'PRICING_SEARCH',
      `Searched pricing data - Found ${resultArray.length} results`,
      'SUCCESS'
    );

    return { 
      success: true, 
      data: resultArray 
    };

  } catch (error) {
    console.error('Error in getProductPricing:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Format date helper function
 */
function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${year}-${month}-${day}`;
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
