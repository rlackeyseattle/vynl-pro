import os
import shutil

# Paths
GRAPHICS_SRC = r"C:\ATLAS_ROOT\MUSIC\Rob Lackey\graphics"
WEB_PUBLIC = r"C:\ATLAS_ROOT\CODE\WEBSITES\VYNL.PRO\public"
FRIENDS_DEST = os.path.join(WEB_PUBLIC, "graphics", "friends")

os.makedirs(FRIENDS_DEST, exist_ok=True)

IMAGES = [
    "ALBUM COVER IDEA - Ash and Static.png",
    "ALBUM COVER IDEA - Breaking Even With Ghosts.png",
    "ALBUM COVER IDEA - Come Sundown Raise Hell.png",
    "ALBUM COVER IDEA - Everything Tastes Like Whiskey.png",
    "ALBUM COVER IDEA - Falling Sky.png",
    "ALBUM COVER IDEA - Balcony Weather.png",
    # Note: Using .png for consistency, will check if they exist or use others if not
    "ALBUM COVER IDEA - Songs I Didn't Write.png",
    "ALBUM COVER IDEA - Ash and Static 2.png"
]

for i, img in enumerate(IMAGES):
    src = os.path.join(GRAPHICS_SRC, img)
    if os.path.exists(src):
        ext = img.split('.')[-1]
        dest_filename = f"{i+1}.{ext}"
        shutil.copy2(src, os.path.join(FRIENDS_DEST, dest_filename))
        print(f"Copied {img} as {dest_filename}")

print("Done copying Top 8 images.")
