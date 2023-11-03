import dns.resolver
import qrcode
from PIL import Image, ImageDraw, ImageFont
import requests

# Ask user for the subdomain and domain
subdomain = input("Enter the subdomain: ").strip()
domain = input("Enter the domain: ").strip()
full_domain = f"{subdomain}.{domain}"

# Function to check subdomain availability
def check_subdomain_availability(full_domain):
    try:
        dns.resolver.resolve(full_domain)
        return False  # If DNS resolution is successful, subdomain is taken
    except dns.resolver.NXDOMAIN:
        return True  # The subdomain does not exist
    except Exception as e:
        print(f"An error occurred: {e}")
        return False  # Assume it's taken in case of other errors

# Function to generate QR code
def generate_qr_code(url):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    return img

# Function to add text to the QR code image
def add_text_to_image(image, text):
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype("Montserrat-SemiBoldItalic.ttf", 36)  # Ensure font file is in the same directory
    textwidth, textheight = draw.textsize(text, font)
    width, height = image.size
    texttop = height - textheight - 10  # Adjusting the text position to be at the bottom
    textleft = (width - textwidth) // 2
    draw.text((textleft, texttop), text, font=font, fill="black")
    return image

# Function to save the image
def save_image(image, filename):
    image.save(filename, "PNG")

# Main logic
if check_subdomain_availability(full_domain):
    print(f"{full_domain} is available!")
    # ... rest of the QR code generation logic
else:
    print(f"{full_domain} is not available.")

