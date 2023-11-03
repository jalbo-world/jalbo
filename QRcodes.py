import whois
import qrcode
from PIL import Image, ImageDraw, ImageFont
import requests

# Ask user for the subdomain and domain
subdomain = input("Enter the subdomain: ").strip()
domain = input("Enter the domain: ").strip()
full_domain = f"{subdomain}.{domain}"

# Function to check domain availability
def check_domain_availability(domain):
    try:
        domain_info = whois.whois(domain)
        return False if domain_info.domain_name else True
    except:
        return True  # Assuming available if the WHOIS query fails

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
if check_domain_availability(full_domain):
    print(f"{full_domain} is available!")
    qr_code_image = generate_qr_code(f"https://{full_domain}")
    qr_code_image_with_text = add_text_to_image(qr_code_image, subdomain)
    filename = f"{subdomain}_qr_code.png"
    save_image(qr_code_image_with_text, filename)
    print(f"QR code saved as {filename}")
else:
    print(f"{full_domain} is not available.")
