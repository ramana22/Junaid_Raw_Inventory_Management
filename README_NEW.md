# 🧼 Soap Manufacturing System - Redesigned v2.0

## Complete Inventory & Batch Management System with Login & Role-Based Access

### ✨ Key Features

✅ **Employee Login System** with authentication
✅ **Role-Based Access Control** (Admin/Staff)
✅ **3 Complete Modules**:
   1. Raw Material Entry (with dynamic ingredient rows)
   2. Batch Entry (with dynamic batch items)
   3. Product Pricing Report (Admin only)
✅ **Dynamic Form Fields** - Add/Remove rows on the fly
✅ **Auto-Calculated Prices** - Weight × Price Per OZ
✅ **Search Dropdowns** for Ingredients, Products, Employees
✅ **Confirmation Modals** before every submission
✅ **Google Sheets Integration** for data persistence
✅ **Activity Logging** for audit trail and compliance
✅ **Responsive Design** (works on all devices)

---

## 📦 Files Included

### 1. **soap_manufacturing_new.html** (51 KB)
The main interactive web application
- Login page with authentication
- 3 tabbed interface for different functions
- Dynamic form fields
- Real-time calculations
- Confirmation modals
- Responsive design

### 2. **apps_script_new.gs** (12 KB)
Google Apps Script backend
- Handles all server-side operations
- Authenticates users against Employees sheet
- Saves data to Google Sheets
- Logs all activities
- Calculates prices from raw materials

### 3. **SETUP_GUIDE_NEW.md** (15 KB)
Complete implementation guide with step-by-step instructions

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Prepare Google Sheet
Create these sheets in your Google Sheet (`1-twqY8w9hto179qrQ5nd0BSc8o85d13kVB5DyDaaKcM`):
- **Employees** - User accounts and roles
- **Products** - Product list
- **Ingredients** - Ingredient list
- System auto-creates: RAW Product Details, BATCH PROCESSED, Activity Log

### Step 2: Add Google Apps Script
1. Open Google Sheet
2. Extensions > Apps Script
3. Delete default code
4. Paste content from `apps_script_new.gs`
5. Save

### Step 3: Deploy as Web App
1. Click "New deployment" (+)
2. Select "Web app"
3. Set to "Anyone" access
4. Copy deployment URL
5. Save the deployment ID

### Step 4: Update HTML Form
1. Open `soap_manufacturing_new.html`
2. Find: `const API_BASE = 'https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallback'`
3. Replace `{DEPLOYMENT_ID}` with your actual ID
4. Save

### Step 5: Open & Login
1. Open `soap_manufacturing_new.html` in web browser
2. Login with:
   - ID: EMP001 | Password: password123 (Admin)
   - ID: EMP002 | Password: password123 (Staff)

**Done!** System is ready to use.

---

## 📋 System Overview

### Tab 1: Raw Material Entry
**For**: Recording ingredient purchases from suppliers

**Fields**:
- Date (required, today by default)
- PO Number (required, e.g., PO-2024-001)
- Company Name (required, supplier name)
- **Dynamic Ingredients**:
  - Ingredient (search dropdown)
  - Weight (oz)
  - Price ($)
  - Price Per OZ (auto-calculated)

**Actions**:
- Add ingredient rows with "Add Ingredient" button
- Remove ingredient rows with "Remove" button
- Submit all records at once
- Confirmation modal shows all data before saving

**Saves To**: RAW Product Details sheet

---

### Tab 2: Batch Entry
**For**: Creating production batches with ingredients

**Fields**:
- Date of Production (required, today by default)
- Batch ID (auto-generated, disabled)
- Prepared By (search dropdown - Employees)
- **Dynamic Batch Items**:
  - Product Name (search dropdown)
  - Ingredient (search dropdown)
  - Weight (oz)
  - Price (auto-calculated from raw materials)

**Actions**:
- Add batch items with "Add Item" button
- Remove batch items with "Remove" button
- Total price calculated automatically
- Click "Proceed" to submit
- Confirmation modal shows all items and total price

**Saves To**: BATCH PROCESSED sheet

---

### Tab 3: Product Pricing Report
**For**: Viewing and analyzing product costs (Admin Only)

**Features**:
- Search by Product Name
- Search by Batch ID
- Search by Date Range
- Displays: Batch ID, Date, Product Name, Total Price
- Sums ingredient prices per product per batch

**Access**: Admin role only (Staff users see disabled tab)

**Searches**: BATCH PROCESSED sheet data

---

## 🔐 Login & Roles

### Employee Sheet Structure
Columns: `Id | Name | Role | Password | Company`

### Roles
- **Admin**: Full access to all 3 tabs
- **Staff**: Access to tabs 1 & 2 only (tab 3 disabled)

### Demo Credentials
```
Admin User:
  ID: EMP001
  Password: password123
  
Staff User:
  ID: EMP002
  Password: password123
```

---

## 📊 Data Flow

```
HTML Form
  ↓
  ├─→ RAW MATERIAL ENTRY
  │    ├─ Date, PO, Company → RAW Product Details Sheet
  │    └─ Ingredients → RAW Product Details Sheet
  │       └─ Activity Log
  │
  ├─→ BATCH ENTRY
  │    ├─ Batch ID, Date, Prepared By → BATCH PROCESSED Sheet
  │    └─ Items (Product, Ingredient, Weight, Price) → BATCH PROCESSED Sheet
  │       └─ Activity Log
  │
  └─→ PRODUCT PRICING (Admin)
       ├─ Query BATCH PROCESSED Sheet
       └─ Aggregate by Product & Batch
          └─ Activity Log
```

---

## 🔄 Automatic Calculations

### Raw Material Entry
```
Price Per OZ = Price ÷ Weight
Example: $600 ÷ 450 oz = $1.33/oz
```

### Batch Entry
```
Ingredient Price = Weight × Latest Price Per OZ from Raw Materials
Example: 14 oz × $1.33/oz = $18.62

Total Batch Price = SUM of all ingredient prices
Example: Item1 ($18.62) + Item2 ($15.00) = $33.62
```

### Product Pricing
```
Product Total Price = SUM of all ingredient prices for that product
Grouped by: Batch ID + Date + Product Name
```

---

## 📝 Activity Logging

Every action is logged to Activity Log sheet:
- LOGIN / LOGOUT
- TAB_SWITCH
- RAW_MATERIAL_SUBMIT
- BATCH_SUBMIT
- PRICING_SEARCH

**Logged Data**: Timestamp | User ID | Name | Action | Details | Status

---

## ✅ Form Validation

### Raw Material Entry
- ✅ All header fields required
- ✅ At least 1 ingredient required
- ✅ Ingredient must be from dropdown
- ✅ Weight > 0
- ✅ Price > 0
- ✅ Error messages show on invalid input

### Batch Entry
- ✅ Date required
- ✅ Prepared By must be selected
- ✅ At least 1 item required
- ✅ Product Name must be selected
- ✅ Ingredient must be selected
- ✅ Weight > 0
- ✅ Error messages show on invalid input

---

## 🎯 Example Workflow

### Scenario: Add Cardamom Purchase

1. **Login** as John Doe (EMP001)
2. **Go to** Raw Material Entry tab
3. **Fill in**:
   - Date: 07/05/2024 (auto-filled)
   - PO Number: PO-2024-001
   - Company Name: Amazon
4. **Add ingredient**:
   - Ingredient: Select "cardamon"
   - Weight: 500
   - Price: 500
   - Price Per OZ: **Auto-calculated = 1.00**
   - Click "Add Ingredient"
5. **Submit** - Confirmation modal shows all data
6. **Confirm** - Data saved to RAW Product Details sheet
7. **Activity Log** - Entry created with user, timestamp, action

---

### Scenario: Create Lavender Batch

1. **Login** as Jane Smith (EMP002)
2. **Go to** Batch Entry tab
3. **Fill in**:
   - Date: 07/05/2024
   - Batch ID: **Auto-generated = ABC123**
   - Prepared By: Select "Jane Smith"
4. **Add item 1**:
   - Product: SOURSOUP
   - Ingredient: cardamon
   - Weight: 12
   - Price: **Auto-calculated = 12.00**
   - Click "Add Item"
5. **Add item 2**:
   - Product: SOURSOUP
   - Ingredient: tulasi
   - Weight: 14
   - Price: **Auto-calculated = 18.62**
   - Click "Add Item"
6. **View** total price at bottom: $30.62
7. **Submit** - Confirmation shows all items + total
8. **Confirm** - Data saved to BATCH PROCESSED sheet
9. **Activity Log** - Entry created

---

### Scenario: View Product Pricing (Admin Only)

1. **Login** as John Doe (EMP001)
2. **Go to** Product Pricing tab
3. **Search options**:
   - By Product: Enter "SOURSOUP"
   - By Batch ID: Enter "ABC123"
   - By Date: Select date range
4. **Click** Search
5. **Results** show: Batch ID | Date | Product | Total Price
6. Example result: ABC123 | 07/05 | SOURSOUP | $30.62
7. **Click** View for details
8. **Activity Log** - Search logged

---

## 🛠️ Setup Requirements

### Google Sheet Required
- ID: `1-twqY8w9hto179qrQ5nd0BSc8o85d13kVB5DyDaaKcM`
- Sheets needed: Employees, Products, Ingredients (others auto-created)

### Google Apps Script Deployment
- Required for data persistence
- Must be deployed as "Web app"
- "Anyone" access required
- Deployment ID in HTML form

### Browser Requirements
- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Cookies enabled for session management

---

## 📋 Sheet Structure

### Employees Sheet
```
Id      | Name       | Role  | Password    | Company
EMP001  | John Doe   | Admin | password123 | AMAZON
EMP002  | Jane Smith | Staff | password123 | AMAZON
EMP003  | IZZY       | Staff | password123 | AMAZON
```

### Products Sheet
```
Product Id | Product Name
PRD001     | SOURSOUP
PRD002     | african black
PRD003     | lavender
```

### Ingredients Sheet
```
Ingredient Id | Ingredient Name
ING001        | cardamon
ING002        | tulasi
ING003        | turmaric
ING004        | cloves
ING005        | graipfruit
ING006        | lemonpeel
```

### RAW Product Details Sheet (Auto-created)
```
Date   | PO Number | Company | Ingredient | Weight | Price | Price Per OZ | Timestamp
07/05  | 1234      | amazon  | cardamon   | 500    | 500   | 1            | 2024-07-05...
```

### BATCH PROCESSED Sheet (Auto-created)
```
Batch Date | Batch ID | Company | Prepared By | Product | Ingredient | Weight | Price | Timestamp
07/05      | ABC123   | AMAZON  | Jane Smith  | SOURSOUP| cardamon  | 12     | 12.00 | 2024-07-05...
```

### Activity Log Sheet (Auto-created)
```
Timestamp        | User ID | User Name  | Action            | Details              | Status
2024-07-05 10:00 | EMP001  | John Doe   | LOGIN             | User logged in       | SUCCESS
2024-07-05 10:05 | EMP001  | John Doe   | RAW_MATERIAL_SUBMIT | Submitted 1... | SUCCESS
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Login fails** | Check ID/password in Employees sheet |
| **Dropdown empty** | Verify sheet has data and correct column structure |
| **Price not calculating** | Ensure weight > 0 and ingredient has raw material entry |
| **Data not saving** | Check Apps Script deployment, verify API URL |
| **Tab 3 disabled** | User needs "Admin" role in Employees sheet |

---

## 🔗 Important Links

**Google Sheet**: `1-twqY8w9hto179qrQ5nd0BSc8o85d13kVB5DyDaaKcM`

**Deployment URL** (from Apps Script): `https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallback`

---

## 📚 Documentation

For detailed setup instructions, see: **SETUP_GUIDE_NEW.md**

---

## ✨ What's New in v2.0

✅ Complete rewrite from previous system
✅ Login authentication
✅ Role-based access control
✅ Activity logging
✅ Dynamic form fields
✅ Proper Google Sheets integration
✅ Real-time price calculations
✅ Confirmation modals
✅ Admin-only features
✅ Responsive mobile design
✅ Complete audit trail

---

## 🚀 Ready to Use

1. **Open**: `soap_manufacturing_new.html`
2. **Login**: EMP001 / password123
3. **Start**: Use immediately!

No additional installation needed. Everything is built into the HTML file and works with Google Sheets.

---

**Version**: 2.0 - Complete Redesign
**Status**: Production Ready ✅
**Last Updated**: 2024
**Sheet ID**: 1-twqY8w9hto179qrQ5nd0BSc8o85d13kVB5DyDaaKcM
