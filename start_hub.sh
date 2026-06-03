#!/bin/bash

# Define the ecosystem checksum file
CHECKSUM_FILE="ecosystem.checksum"

echo "========================================="
echo "   TUNAPAC HUMANLEDGER HUB - SECURITY"
echo "========================================="

# 1. Check if the checksum file exists
if [ ! -f "$CHECKSUM_FILE" ]; then
    echo "[!] Integrity profile missing. Generating fresh profile..."
    sha512sum pi_ai_hub.py quantum_transactions.py pi.toml index.html > "$CHECKSUM_FILE"
    echo "[+] Profile created successfully."
fi

# 2. Run the integrity check
echo "[*] Auditing file integrity signatures..."
if sha512sum -c "$CHECKSUM_FILE" --status; then
    echo "[OK] Integrity verified. No unauthorized alterations detected."
    echo "-----------------------------------------"
    echo "[*] Booting pi_ai_hub.py..."
    python3 pi_ai_hub.py
else
    echo "-----------------------------------------"
    echo "[CRITICAL ERROR] File integrity check FAILED!"
    echo "[!] One or more core files have been altered or corrupted."
    echo "[!] Execution halted for security."
    exit 1
fi
