const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. Parse arguments
const args = process.argv.slice(2);
if (args.length < 1) {
    console.error('Usage: node generate_pdf.js <folder_name>');
    process.exit(1);
}

const folderName = args[0];
const folderPath = path.resolve(__dirname, folderName);

if (!fs.existsSync(folderPath)) {
    console.error(`Error: Folder '${folderName}' does not exist at ${folderPath}`);
    process.exit(1);
}

// 2. Read input files
const invoicePath = path.join(folderPath, `${folderName}.hbr`);
const dataPath = path.join(folderPath, 'data.json');
const headerPath = path.join(folderPath, 'header.hbr');
const footerPath = path.join(folderPath, 'footer.hbr');

if (!fs.existsSync(invoicePath) || !fs.existsSync(dataPath)) {
    console.error(`Error: Missing 'invoice.hbr' or 'data.json' in '${folderName}'`);
    process.exit(1);
}

let content = fs.readFileSync(invoicePath, 'utf8');
let data;
try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (e) {
    console.error(`Error: Invalid JSON in 'data.json': ${e.message}`);
    process.exit(1);
}

let headerTemplate = fs.existsSync(headerPath) ? fs.readFileSync(headerPath, 'utf8') : null;
let footerTemplate = fs.existsSync(footerPath) ? fs.readFileSync(footerPath, 'utf8') : null;

// Load PDF options from pdfoptions.json if it exists
const pdfOptionsPath = path.join(folderPath, 'pdfoptions.json');
let pdfOptions = {};
if (fs.existsSync(pdfOptionsPath)) {
    try {
        pdfOptions = JSON.parse(fs.readFileSync(pdfOptionsPath, 'utf8'));
        console.log(`Loaded PDF options from ${pdfOptionsPath}`);
    } catch (e) {
        console.warn(`Warning: Failed to parse pdfoptions.json: ${e.message}`);
    }
}

// 3. Construct API Payload
// Reading API Key from env var or args (optional second arg)
const apiKey = process.env.RAPIDAPI_KEY || args[1];

if (!apiKey) {
    console.warn('Warning: No RAPIDAPI_KEY provided in environment variables or as second argument.');
    console.warn('The request might fail if the API requires authentication.');
}

// Merge PDF options with defaults
const defaultOptions = {
    displayHeaderFooter: !!(headerTemplate || footerTemplate),
    headerTemplate: headerTemplate,
    footerTemplate: footerTemplate,
    printBackground: true,
    margin: {
        top: '150px',
        bottom: '150px'
    }
};

const payload = {
    sourceType: 'Template',
    content: content,
    data: data,
    options: { ...defaultOptions, ...pdfOptions }
};

const payloadString = JSON.stringify(payload);

// 4. Make API Request
const options = {
    hostname: 'pdfrenderpro.p.rapidapi.com',
    path: '/pdf',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadString),
        'X-RapidAPI-Host': 'pdfrenderpro.p.rapidapi.com',
        'X-RapidAPI-Key': apiKey || ''
    }
};

console.log(`Sending request for folder '${folderName}'...`);

const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
        console.error(`API Request Failed with status: ${res.statusCode}`);
        let errorData = '';
        res.on('data', chunk => errorData += chunk);
        res.on('end', () => {
            console.error('Response Body:', errorData);
        });
        return;
    }

    const chunks = [];
    res.on('data', (chunk) => {
        chunks.push(chunk);
    });

    res.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        const outputPath = path.join(folderPath, `${folderName}.pdf`);
        fs.writeFileSync(outputPath, pdfBuffer);
        console.log(`Success! PDF generated at: ${outputPath}`);
    });
});

req.on('error', (e) => {
    console.error(`Request Error: ${e.message}`);
});

req.write(payloadString);
req.end();
