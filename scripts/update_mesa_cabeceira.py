import os
import io
import urllib.request
from PIL import Image

GIFTS_DIR = os.path.join(os.getcwd(), "public", "images", "gifts")
os.makedirs(GIFTS_DIR, exist_ok=True)

urls = [
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=80",
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80"
]

def crop_center_square(img):
    width, height = img.size
    min_dim = min(width, height)
    left = (width - min_dim) / 2
    top = (height - min_dim) / 2
    right = (width + min_dim) / 2
    bottom = (height + min_dim) / 2
    return img.crop((left, top, right, bottom))

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            img = Image.open(io.BytesIO(data)).convert("RGB")
            img_cropped = crop_center_square(img)
            img_resized = img_cropped.resize((1024, 1024), Image.Resampling.LANCZOS)
            output_path = os.path.join(GIFTS_DIR, "gift-004.webp")
            img_resized.save(output_path, "WEBP", quality=90)
            print(f"Saved {output_path} successfully from {url}")
            break
    except Exception as e:
        print(f"Error for {url}: {e}")
