
# Usage:
#   make run folder=invoice
#   make run folder=invoice key=YOUR_API_KEY

NODE = node
SCRIPT = generate_pdf.js

.PHONY: run

run:
	$(NODE) $(SCRIPT) $(folder) $(key)

