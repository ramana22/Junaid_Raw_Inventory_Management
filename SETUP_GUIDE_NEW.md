# Soap Manufacturing System - Complete Setup Guide

## 📋 Overview

This is a role-based, web-based inventory and batch management system for soap manufacturing with:
- ✅ Employee login authentication
- ✅ 3 main tabs (Raw Material Entry, Batch Entry, Product Pricing)
- ✅ Dynamic form fields with add/remove functionality
- ✅ Real-time price calculations
- ✅ Confirmation modals before submission
- ✅ Google Sheets integration
- ✅ Activity logging for audit trail
- ✅ Admin-only features

---

## 🚀 Quick Start

### Step 1: Set Up Google Sheet Structure

Create these sheets in your Google Sheet (`1-twqY8w9hto179qrQ5nd0BSc8o85d13kVB5DyDaaKcM`):

#### 1. **Employees** Sheet
Columns: `Id | Name | Role | Password | Company`

Example:
```
Id       | Name      | Role  | Password    | Company
EMP001   | John Doe  | Admin | password123 | AMAZON
EMP002   | Jane Smith| Staff| password123 | AMAZON
```

#### 2. **Products** Sheet
Columns: `Product Id | Product Name`

Example:
```
Product Id | Product Name
PRD001     | SOURSOUP
PRD002     | african black
PRD003     | lavender
```

#### 3. **Ingredients** Sheet
Columns: `Ingredient Id | Ingredient Name`

Example:
```
Ingredient Id | Ingredient Name
ING001        | cardamon
ING002        | tulasi
ING003        | turmaric
ING004        | cloves
ING005        | graipfruit
ING006        | lemonpeel
```

#### 4. **RAW Product Details** Sheet (Auto-created)
Columns: `Date | PO Number | Company Name | Ingredient | Weight (oz) | Price ($) | Price Per OZ | Timestamp`

#### 5. **BATCH PROCESSED** Sheet (Auto-created)
Columns: `Batch Date | Batch ID | Company Name | Prepared By | Product Name | Ingredient Name | Weight In OZ | Price | Timestamp`

#### 6. **Activity Log** Sheet (Auto-created)
Columns: `Timestamp | User ID | User Name | Action | Details | Status`

---

### Step 2: Add Google Apps Script

1. **Open your Google Sheet**
2. **Go to**: Extensions > Apps Script
3. **Delete** default code
4. **Copy ALL** code from `apps_script_new.gs`
5. **Paste** into Apps Script editor
6. **Save** with name: "Soap Manufacturing Backend"

### Step 3: Deploy as Web App

1. **Click** "New deployment" (+)
2. **Select**: Web app
3. **Execute as**: Your Google Account
4. **Who has access**: Anyone
5. **Click** Deploy
6. **Copy** the deployment URL
7. **Save** this URL - you'll need it for the form

### Step 4: Get Deployment ID

From the deployment URL: `https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallback`

Copy the `{DEPLOYMENT_ID}` part

### Step 5: Update HTML Form

1. **Open** `soap_manufacturing_new.html` in a text editor
2. **Find** line with `const API_BASE`
3. **Replace** `{DEPLOYMENT_ID}` with your actual deployment ID
4. **Save** the file

### Step 6: Use the Form

1. **Open** `soap_manufacturing_new.html` in web browser
2. **Login** with test credentials:
   - ID: `EMP001` | Password: `password123`
   - ID: `EMP002` | Password: `password123`

---

## 📊 System Features

### Tab 1: Raw Material Entry

**Purpose**: Record ingredient purchases from suppliers

**Fields**:
- Date (required) - Uses today's date by default
- PO Number (required) - Unique purchase order identifier
- Company Name (required) - Supplier name

**Dynamic Ingredients**:
- Ingredient (required) - Searchable dropdown from Ingredients sheet
- Weight (oz) (required) - Quantity in ounces
- Price ($) (required) - Total purchase price
- Price Per OZ (auto-calculated) - Price ÷ Weight = automatically calculated

**Features**:
- ✅ Add multiple ingredients with "Add Ingredient" button
- ✅ Remove individual ingredients with "Remove" button
- ✅ Add new ingredient on Enter key press
- ✅ Ingredient dropdown with search
- ✅ Confirmation modal before submission
- ✅ Saves all records to "RAW Product Details" sheet

**Example Data**:
```
Date    | PO Num | Company | Ingredient  | Weight | Price | Price/OZ
07/05   | 1234   | amazon  | cardamon    | 500    | 500   | 1
07/05   | 1234   | amazon  | tulasi      | 450    | 600   | 1.33
07/05   | 1234   | amazon  | turmaric    | 600    | 7000  | 11.67
```

---

### Tab 2: Batch Entry

**Purpose**: Create production batches with ingredients

**Fields**:
- Date of Production (required) - Uses today's date by default
- Batch ID (auto-generated, disabled) - Unique batch identifier
- Prepared By (required) - Searchable dropdown from Employees sheet
- Product Name (required, per item) - Searchable dropdown from Products sheet
- Ingredient (required, per item) - Searchable dropdown from Ingredients sheet
- Weight in oz (required, per item) - Quantity used
- Price (auto-calculated, per item) - Weight × Price Per OZ from latest raw material

**Features**:
- ✅ Batch ID auto-generated on date entry
- ✅ Add multiple batch items with "Add Item" button
- ✅ Remove items with "Remove" button
- ✅ Price automatically calculated from latest raw material prices
- ✅ Total price shown at bottom
- ✅ Searchable dropdowns for Product and Ingredient
- ✅ Confirmation modal shows all items and total price
- ✅ Click "Proceed" to submit batch

**Example Data**:
```
Batch Date | Batch ID | Company | Prepared By | Product   | Ingredient  | Weight | Price
07/05      | JIMMY    | AMAZON  | IZZY        | SOURSOUP  | cardamon    | 12     | 12.00
07/05      | JIMMY    | AMAZON  | IZZY        | SOURSOUP  | tulasi      | 14     | 18.67
07/05      | JIMMY    | AMAZON  | IZZY        | african   | cardamon    | 12     | 12.00
```

---

### Tab 3: Product Pricing Report

**Purpose**: View and analyze product pricing (Admin only)

**Features**:
- ✅ Search by Product Name
- ✅ Search by Batch ID
- ✅ Search by Date Range (From - To)
- ✅ Table showing: Batch ID | Date | Product Name | Total Price
- ✅ Displays sum of all ingredient prices per product per batch
- ✅ Admin-only access (disabled for non-admin users)

**Search Filters**:
- Product Name: Case-insensitive search
- Batch ID: Exact match
- Date Range: Filter by from and to dates
- Combined filters work together

---

## 🔐 Login & Access Control

### Login Credentials
Create employees in the Employees sheet with:
- Id: Employee ID
- Name: Full name
- Role: Admin or Staff
- Password: Login password
- Company: Company name

### Role-Based Access
- **Admin**: Can access all 3 tabs including Product Pricing
- **Staff**: Can access Tabs 1 & 2 only. Tab 3 (Pricing) is disabled

### Demo Login
```
Username: EMP001
Password: password123
Role: Admin

Username: EMP002
Password: password123
Role: Staff
```

---

## 📝 Activity Logging

All user activities are logged to the "Activity Log" sheet:

**Logged Events**:
- LOGIN - User login
- LOGOUT - User logout
- TAB_SWITCH - Tab navigation
- RAW_MATERIAL_SUBMIT - Raw material submission
- BATCH_SUBMIT - Batch submission
- PRICING_SEARCH - Pricing report search

**Log Data**:
- Timestamp
- User ID
- User Name
- Action
- Details
- Status (SUCCESS/ERROR)

---

## 🔧 Implementation Steps

### Step 1: Prepare Google Sheet
- [ ] Create all required sheets
- [ ] Add sample data to Employees, Products, Ingredients
- [ ] Verify sheet names match exactly

### Step 2: Add Apps Script
- [ ] Copy `apps_script_new.gs` code
- [ ] Paste into Extensions > Apps Script
- [ ] Save the script
- [ ] Run `testSetup()` to initialize sheets

### Step 3: Deploy Web App
- [ ] Click "New deployment"
- [ ] Select "Web app"
- [ ] Set to "Anyone" access
- [ ] Copy deployment URL
- [ ] Save deployment ID

### Step 4: Configure HTML Form
- [ ] Update `API_BASE` with deployment ID
- [ ] Update any custom endpoints if needed

### Step 5: Test System
- [ ] Open HTML form in browser
- [ ] Login with test credentials
- [ ] Add sample raw material entry
- [ ] Add sample batch entry
- [ ] Check Google Sheet for saved data
- [ ] Verify Activity Log entries

### Step 6: Go Live
- [ ] Create actual employee accounts
- [ ] Add actual products and ingredients
- [ ] Train users on system
- [ ] Monitor Activity Log regularly

---

## 📱 Form Usage Guide

### Raw Material Entry Workflow

1. **Open form** in web browser
2. **Login** with your credentials
3. **Click** "Raw Material Entry" tab
4. **Fill in**:
   - Date (auto-filled with today)
   - PO Number (e.g., PO-2024-001)
   - Company Name (e.g., Amazon, Suppliers Inc)
5. **Add first ingredient**:
   - Type ingredient name in search box (or select from dropdown)
   - Enter weight in oz
   - Enter total price
   - Click "Add Ingredient"
6. **Add more ingredients** (repeat step 5 for each)
7. **Click** "Submit All Records"
8. **Review** confirmation modal
9. **Click** "Confirm & Submit"
10. **Success!** Data is saved to Google Sheets

### Batch Entry Workflow

1. **Click** "Batch Entry" tab
2. **Fill in**:
   - Date (auto-filled, can change)
   - Batch ID (auto-generated when you change date)
   - Prepared By (search and select employee)
3. **Add first batch item**:
   - Select Product Name from dropdown
   - Select Ingredient from dropdown
   - Enter Weight (oz)
   - Price auto-calculates from raw materials
   - Click "Add Item"
4. **Add more items** (repeat step 3)
5. **Review** total price shown at bottom
6. **Click** "Proceed"
7. **Review** confirmation modal with all items and total
8. **Click** "Confirm & Submit"
9. **Success!** Batch is saved to Google Sheets

### Product Pricing Workflow (Admin Only)

1. **Click** "Product Pricing" tab (if you're an Admin)
2. **Optional**: Use search filters
   - Enter product name to search
   - Enter batch ID to search
   - Select date range
   - Click "Search"
3. **View** results in table
4. **Click** "View" button for more details
5. **Reset** filters with "Reset" button

---

## ✅ Validation Rules

### Raw Material Entry
- ✅ All three header fields required
- ✅ At least one ingredient required
- ✅ Ingredient must be selected from dropdown
- ✅ Weight must be > 0
- ✅ Price must be > 0
- ✅ Price Per OZ auto-calculated (Price ÷ Weight)

### Batch Entry
- ✅ Date required
- ✅ Batch ID auto-generated (not editable)
- ✅ Prepared By must be selected from dropdown
- ✅ At least one batch item required
- ✅ Product Name must be selected from dropdown
- ✅ Ingredient must be selected from dropdown
- ✅ Weight must be > 0
- ✅ Price auto-calculated from latest raw material prices

---

## 🐛 Troubleshooting

### Issue: Login fails

**Solution**:
- Verify Employees sheet exists
- Check employee ID spelling (case-sensitive)
- Check password spelling (case-sensitive)
- Verify sheet has columns: Id, Name, Role, Password, Company

### Issue: Dropdown not showing

**Solution**:
- Verify required sheet exists (Ingredients, Products, Employees)
- Verify sheet contains data
- Check column structure matches expected format
- Clear browser cache and refresh

### Issue: Price not calculating

**Solution**:
- Verify raw material has been entered for ingredient
- Ensure weight is entered (not 0)
- Check that latest raw material has correct Price Per OZ
- Verify ingredient name matches exactly (case-sensitive)

### Issue: Data not saving

**Solution**:
- Check Google Apps Script deployment is active
- Verify deployment URL is correct
- Check sheet names in Apps Script match your sheets
- Run `testSetup()` to initialize sheets
- Check Activity Log for error messages

### Issue: Pricing tab disabled for admin

**Solution**:
- Verify login user has "Admin" role in Employees sheet
- Check column order: Id, Name, Role, Password, Company
- Logout and login again
- Try in incognito/private window

---

## 📊 Data Flow

```
LOGIN
  ↓
AUTHENTICATE AGAINST EMPLOYEES SHEET
  ↓
LOAD DROPDOWNS (Ingredients, Products, Employees)
  ↓
USER SELECTS TAB
  ↓
RAW MATERIAL ENTRY:
  - User enters date, PO, company, ingredients
  - System calculates Price Per OZ
  - On submit, saves to RAW Product Details sheet
  - Logs activity to Activity Log
  
BATCH ENTRY:
  - User enters date, prepared by, products, ingredients
  - System auto-generates Batch ID
  - System calculates price from latest raw materials
  - On submit, saves to BATCH PROCESSED sheet
  - Logs activity to Activity Log

PRODUCT PRICING (Admin only):
  - User searches/filters batches
  - System aggregates prices by product/batch
  - Displays results in table
  - Logs activity to Activity Log
```

---

## 🔗 Integration with Google Sheets

### Apps Script Triggers
The system uses `doPost()` handler for HTTP requests:
- Processes form submissions
- Authenticates users
- Loads dropdown data
- Saves records
- Retrieves pricing data
- Logs all activities

### Error Handling
- Try-catch blocks on all operations
- Detailed error logging
- User-friendly error messages
- Activity log captures all errors

---

## 📋 Testing Checklist

- [ ] Sheets are properly created and named
- [ ] Apps Script deployed successfully
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Raw material entry with multiple items
- [ ] Batch entry with multiple items
- [ ] Verify data saved to correct sheets
- [ ] Check Activity Log for entries
- [ ] Test dropdown searches
- [ ] Test confirmation modals
- [ ] Verify calculations (Price Per OZ, Total Price)
- [ ] Test admin access to Pricing tab
- [ ] Test staff cannot access Pricing tab

---

## 🚀 Production Deployment

Before going live:

1. **User Setup**
   - Create actual employee accounts in Employees sheet
   - Set appropriate roles (Admin/Staff)
   - Set secure passwords
   - Add company information

2. **Data Migration**
   - Add all products to Products sheet
   - Add all ingredients to Ingredients sheet
   - Import historical data if available

3. **Testing**
   - Complete full testing checklist
   - Test with actual data
   - Verify all calculations
   - Test with multiple users

4. **Training**
   - Train users on system
   - Share login credentials securely
   - Provide usage guides
   - Set expectations for support

5. **Monitoring**
   - Check Activity Log regularly
   - Monitor for errors
   - Review data quality
   - Make adjustments as needed

---

## 📞 Support

For issues:
1. Check Activity Log for error details
2. Review "Troubleshooting" section above
3. Verify sheet structure and data
4. Run `testSetup()` in Apps Script editor
5. Check browser console for errors (F12)

---

**System Version**: 1.0
**Created**: 2024
**Status**: Production Ready
**Google Sheet ID**: 1-twqY8w9hto179qrQ5nd0BSc8o85d13kVB5DyDaaKcM
