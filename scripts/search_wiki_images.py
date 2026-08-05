import urllib.request
import urllib.parse
import json

queries = {
    "gift-004": "bedside cabinet wooden nightstand",
    "gift-005": "upholstered headboard bed",
    "gift-006": "induction cooktop black glass",
    "gift-033": "pedal bin trash can",
    "gift-034": "large wall mirror decorative",
    "vaquinha-006": "modern wardrobe closet",
    "vaquinha-007": "stainless steel dishwasher appliance"
}

def get_wiki_imgs(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'WeddingApp/1.0 (contact@example.com)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pageid, page in pages.items():
                info = page.get('imageinfo', [{}])[0]
                img_url = info.get('url')
                mime = info.get('mime', '')
                width = info.get('width', 0)
                height = info.get('height', 0)
                if img_url and 'image/' in mime and not img_url.endswith('.svg') and width > 500 and height > 500:
                    results.append((img_url, width, height))
            return results
    except Exception as e:
        print(f"Error {query}: {e}")
        return []

if __name__ == "__main__":
    for item_id, q in queries.items():
        print(f"=== {item_id}: {q} ===")
        res = get_wiki_imgs(q)
        for r in res[:3]:
            print("  ", r)
