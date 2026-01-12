# handlebar-templates
Example Handlerbar Templates to generate the Pdf files. Ex. Invoice, Tables, Image, Barcodes, QRCodes, etc.

## How to use `generate_pdf.js`

This script allows you to generate a PDF from the templates in a specific folder using the PDF Render Pro API via RapidAPI.

### Usage

You can use `make` to run the script:

```bash
make run folder=<folder_name> key=<api_key>
```

Or you can run the script directly with Node.js:

```bash
node generate_pdf.js <folder_name> <api_key>
```

### Parameters

- `<folder_name>`: The name of the folder containing the template files (e.g., `invoice`, `report`). The folder acts as the context and must contain:
    - `<folder_name>.hbr` (Main content template)
    - `data.json` (Data to populate the template)
    - `header.hbr` (Optional header template)
    - `footer.hbr` (Optional footer template)
- `<api_key>`: Your RapidAPI Key.

### Example

To generate a PDF for the `invoice` folder with a specific API key using `make`:

```bash
make run folder=invoice key=my-secret-api-key
```

Or using `node`:

```bash
node generate_pdf.js invoice my-secret-api-key
```

Alternatively, you can set the `RAPIDAPI_KEY` environment variable and run the script without the key argument:

```bash
export RAPIDAPI_KEY=my-secret-api-key
make run folder=invoice
# or
node generate_pdf.js invoice
```

The generated PDF will be saved as `<folder_name>.pdf` inside the specified folder.
