#!/bin/bash

set -euo pipefail

# Check if any arguments were provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <file1> <file2> ..."
    exit 1
fi

# Run Prettier on the provided files
echo "Running Prettier..."
pnpm prettier --write "$@"

# Run ESLint with --fix on the provided files
echo "Running ESLint..."
pnpm eslint --fix "$@"

echo "Linting complete!"
