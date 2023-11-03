import qrcode
from PIL import Image, ImageDraw, ImageFont

# Function to generate QR code image
def generate_qr_code(url):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    return img

# Function to overlay text on the QR code
def overlay_text_on_qr(img, text):
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype("Montserrat-SemiBoldItalic.ttf", 20)
    textwidth, textheight = draw.textsize(text, font)

    # Calculate coordinates for the text
    width, height = img.size
    x = (width - textwidth) / 2
    y = 10  # 10 pixels from the top

    # Place text on image
    draw.text((x, y), text, font=font, fill="black")

    return img

# Main function to create QR code with text
def create_qr_with_text(subdomain, domain):
    url = f'https://{subdomain}.{domain}'
    qr_img = generate_qr_code(url)
    final_img = overlay_text_on_qr(qr_img, subdomain)

    # Save the final image
    final_img.save(f'{subdomain}_QR.png', 'PNG')

# Example usage
subdomain = 'karl'  # Replace with the subdomain you want
domain = 'jalbo.link'  # Replace with your domain
create_qr_with_text(subdomain, domain)
