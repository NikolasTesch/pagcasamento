import os
import io
import urllib.request
from PIL import Image

# Directory setup
GIFTS_DIR = os.path.join(os.getcwd(), "public", "images", "gifts")
os.makedirs(GIFTS_DIR, exist_ok=True)

# Image mapping: (ID, Search/Fallback Description, Primary Unsplash Photo URL, Alternative Unsplash Photo URL)
IMAGE_SOURCES = {
    "gift-004": {
        "name": "Armário Auxiliar de Quarto",
        "urls": [
            "https://images.unsplash.com/photo-1532372688391-d87a4a7ce9bd?w=1200&q=80",
            "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=80",
            "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80"
        ]
    },
    "gift-005": {
        "name": "Cabeceira de Cama",
        "urls": [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80"
        ]
    },
    "gift-006": {
        "name": "Fogão de Indução EOS",
        "urls": [
            "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=1200&q=80",
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80",
            "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=1200&q=80"
        ]
    },
    "gift-033": {
        "name": "Lixeiras Retrô para Banheiro",
        "urls": [
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80",
            "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
        ]
    },
    "gift-034": {
        "name": "Espelho Grande de Parede",
        "urls": [
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
            "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&q=80",
            "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80"
        ]
    },
    "vaquinha-006": {
        "name": "Cota para Guarda-Roupa",
        "urls": [
            "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1200&q=80",
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80"
        ]
    },
    "vaquinha-007": {
        "name": "Cota para Lava-Louças",
        "urls": [
            "https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=1200&q=80",
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80"
        ]
    }
}

def crop_center_square(img):
    width, height = img.size
    min_dim = min(width, height)
    left = (width - min_dim) / 2
    top = (height - min_dim) / 2
    right = (width + min_dim) / 2
    bottom = (height + min_dim) / 2
    return img.crop((left, top, right, bottom))

def process_item(item_id, info):
    print(f"Processing {item_id} ({info['name']})...")
    success = False
    for url in info['urls']:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = resp.read()
                img = Image.open(io.BytesIO(data)).convert("RGB")
                img_cropped = crop_center_square(img)
                img_resized = img_cropped.resize((1024, 1024), Image.Resampling.LANCZOS)
                
                output_path = os.path.join(GIFTS_DIR, f"{item_id}.webp")
                img_resized.save(output_path, "WEBP", quality=85)
                print(f"  Successfully saved {output_path}")
                success = True
                break
        except Exception as e:
            print(f"  Failed URL {url}: {e}")
    if not success:
        print(f"  WARNING: Could not download any image for {item_id}")

if __name__ == "__main__":
    for item_id, info in IMAGE_SOURCES.items():
        process_item(item_id, info)
