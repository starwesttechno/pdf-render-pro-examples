# Handlebar Templates for PDF Render Pro

A comprehensive collection of Handlebars templates demonstrating the capabilities of the **PDF Render Pro API**. These examples cover critical features like Barcode/QR Code generation, Charts, Headers/Footers, and Document Security.

## 🚀 1. Examples Showcase

Explore our ready-to-use templates. Each example demonstrates specific API features and Handlebars logic.

### 1. [Monthly Report](./report)
A professional financial report template.
- **Description**: Includes a cover page, summary metrics, CSS-based bar charts, and data tables.
- **Handlers Used**: `{{#each}}`, `{{#if}}`, `.pageNumber`, `.date` (Header/Footer injection).

### 2. [Resume](./resume)
A clean, modern resume layout (3-page sample).
- **Description**: Features a sidebar layout, experience timelines with page-break-avoidance, and a separate header template for consistent personal branding.
- **Handlers Used**: `{{qrcode}}` (URL type), `{{#each}}`, `{{profile}}`.

### 3. [Business Card](./business_card)
Small format (3.5" x 2") styling.
- **Description**: Demonstrates handling non-A4 sizes and generating vCards for contact sharing.
- **Handlers Used**: `{{qrcode}}` (vCard), `{{concat}}`.

### 4. [Event Ticket](./event_ticket)
Secure event entry ticket.
- **Description**: Features a generated Barcode for ticket scanning and a QR code for gate check-in.
- **Handlers Used**: `{{barcode}}` (Code128), `{{qrcode}}` (URL).

### 5. [Shipping Label](./shipping_label)
Standard 4x6" shipping label.
- **Description**: Optimized for thermal printers with tracking barcodes and bold typography.
- **Handlers Used**: `{{barcode}}` (Code128 with options).

### 6. [Certificate](./certificate)
Landscape recognition certificate.
- **Description**: Uses a landscape layout with fancy borders and CSS-simulated seals.
- **Handlers Used**: CSS attributes for orientation (`@page { size: landscape; }`), background images.

### 7. [Legal Contract](./legal_contract)
Multi-page agreement document.
- **Description**: Text-heavy document with justified alignment, page break logic (`page-break-after`), and signature blocks.
- **Handlers Used**: `.pageNumber`, `.totalPages` (Footer).

### 8. [E-book](./ebook)
Complete book structure.
- **Description**: Features a cover page, Table of Contents, multi-chapter content, and consistent navigation headers.
- **Handlers Used**: `{{{content}}}` (HTML injection), `{{#each}}`.

---

## 🏃 Running Examples Locally

You can run any of these examples using the included `Makefile` and `generate_pdf.js` script.

**Prerequisites**:
- Node.js installed.
- A RapidAPI Key for PDF Render Pro.

**Usage**:
```bash
# Set your API Key in .env (recommended) or pass it directly
make start <folder_name> [api_key]
```

**Examples**:
```bash
make start resume
make start invoice my-secret-api-key
```

---

## 💻 Generic Integration Code

Below is a comprehensive **Node.js** integration snippet that works in any application. This code handles:
1.  **Reading Templates**: Loading HTML and JSON data.
2.  **API Request**: Sending the payload to PDF Render Pro.
3.  **Handling Helpers**: Note that **internal helpers** like `{{barcode}}` or `{{qrcode}}` are processed by the server automatically—you do not need to generate images locally!

```javascript
/**
 * Generic Node.js Integration for PDF Render Pro
 * Pre-requisites: npm install axios form-data
 */
const axios = require('axios');
const fs = require('fs');

async function generatePdf() {
  const apiKey = process.env.RAPIDAPI_KEY || 'YOUR_API_KEY';

  // 1. Prepare your content
  // In a real app, these might come from a DB or S3
  const templateHtml = `
    <html>
      <body>
        <h1>Invoice #{{invoice.number}}</h1>
        <p>Total: {{invoice.total}}</p>
        <!-- The server handles this helper automatically! -->
        <img src="{{{barcode invoice.number 'Code128' 200 80}}}" />
      </body>
    </html>
  `;
  
  const templateData = {
    invoice: {
      number: 'INV-1001',
      total: '$500.00'
    }
  };

  // 2. Construct Payload
  const payload = {
    sourceType: 'Template',
    content: templateHtml,
    data: templateData,
    options: {
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: '20px', bottom: '20px' }
    }
  };

  try {
    console.log('Generating PDF...');
    
    // 3. Call API
    const response = await axios.post('https://pdfrenderpro.p.rapidapi.com/pdf', payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'pdfrenderpro.p.rapidapi.com'
      },
      responseType: 'arraybuffer' // Important for binary data
    });

    // 4. Save Output
    fs.writeFileSync('output.pdf', response.data);
    console.log('Success! Saved to output.pdf');

  } catch (error) {
    console.error('Error generating PDF:', error.response ? error.response.data.toString() : error.message);
  }
}

generatePdf();
```

> **Note on Helpers**: Notice how `{{{barcode}}}` and `{{{qrcode}}}` are used directly in the HTML string. The PDF Render Pro engine detects these, generates the images on the fly, and embeds them into your PDF without costing extra API calls.
