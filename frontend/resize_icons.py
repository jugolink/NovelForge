import sys
from PIL import Image

src_path = sys.argv[1]
dest_dir = sys.argv[2]

img = Image.open(src_path)

sizes = {
    'pwa-192x192.png': (192, 192),
    'pwa-512x512.png': (512, 512),
    'apple-touch-icon.png': (180, 180),
    'favicon-32x32.png': (32, 32),
    'favicon-16x16.png': (16, 16),
}

for filename, size in sizes.items():
    resized = img.resize(size, Image.Resampling.LANCZOS)
    resized.save(f"{dest_dir}/{filename}", "PNG")

print("Icons resized successfully.")
