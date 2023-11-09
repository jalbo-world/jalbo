#!/bin/bash

# Take the input for the QR code
read -p "Enter the text for the QR code: " input

# Directory where the QR code will be saved
DIR=/Users/jalbo-brain/jalbo-infrastructure/qr_infrastructure/gallery/"$input"

# Create directory if it doesn't exist
mkdir -p "$DIR"

# Filename of the QR code image
FILE="$DIR/${input}_QR.png"

# Create the QR code
qrencode -o "$FILE" "https://$input.jalbo.link"

echo "QR code generated and saved to $FILE"
