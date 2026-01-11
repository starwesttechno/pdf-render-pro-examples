
# Usage:
#   make run folder=invoice
#   make run folder=invoice key=YOUR_API_KEY
#   make test

NODE = node
SCRIPT = generate_pdf.js

.PHONY: run test

run:
	@if [ -z "$(folder)" ]; then \
		echo "Error: folder argument is required. Usage: make run folder=<folder_name> [key=<api_key>]"; \
		exit 1; \
	fi
	@if [ -n "$(key)" ]; then \
		$(NODE) $(SCRIPT) $(folder) $(key); \
	else \
		$(NODE) $(SCRIPT) $(folder); \
	fi

test:
	$(NODE) $(SCRIPT) invoice
