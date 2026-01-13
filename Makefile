
# Usage:
#   make run folder=invoice
#   make run folder=invoice key=YOUR_API_KEY

NODE = node
SCRIPT = generate_pdf.js

.PHONY: run


run:
	$(NODE) $(SCRIPT) $(folder) $(key)

# Usage: make start <folder_name> [api_key]
# Ex: make start invoice
# Ex: make start invoice my-key
start:
	@:
	$(eval ARGS := $(filter-out $@,$(MAKECMDGOALS)))
	$(NODE) $(SCRIPT) $(ARGS)

# Catch-all rule to handle argument-as-target
%:
	@:
