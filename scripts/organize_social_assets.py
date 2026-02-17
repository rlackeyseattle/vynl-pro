import os
import shutil

# Paths
BASE_MUSIC = r"C:\ATLAS_ROOT\MUSIC\Rob Lackey"
DISCOGRAPHY = os.path.join(BASE_MUSIC, ".discography")
WEB_PUBLIC = r"C:\ATLAS_ROOT\CODE\WEBSITES\VYNL.PRO\public"

ALBUMS = {
    "applause": {
        "src": os.path.join(DISCOGRAPHY, "Applause For The Apocalypse (2024)"),
        "dest": os.path.join(WEB_PUBLIC, "music", "applause")
    },
    "lowfires": {
        "src": os.path.join(DISCOGRAPHY, "Low Fires LP (2025)", "Masters"),
        "dest": os.path.join(WEB_PUBLIC, "music", "lowfires")
    },
    "surrender": {
        "src": os.path.join(DISCOGRAPHY, "Surrender With A Smile (2022)"),
        "dest": os.path.join(WEB_PUBLIC, "music", "surrender")
    },
    "victory": {
        "src": os.path.join(DISCOGRAPHY, "Victory To The Villains (2023)", "Masters"),
        "dest": os.path.join(WEB_PUBLIC, "music", "victory")
    }
}

def setup_dirs():
    for album in ALBUMS.values():
        os.makedirs(album["dest"], exist_ok=True)
    os.makedirs(os.path.join(WEB_PUBLIC, "graphics", "profile"), exist_ok=True)
    os.makedirs(os.path.join(WEB_PUBLIC, "graphics", "albums"), exist_ok=True)

def copy_assets():
    # Copy MP3s
    for name, paths in ALBUMS.items():
        if not os.path.exists(paths["src"]):
            print(f"Source not found for {name}: {paths['src']}")
            continue
            
        for file in os.listdir(paths["src"]):
            if file.lower().endswith(".mp3"):
                shutil.copy2(os.path.join(paths["src"], file), os.path.join(paths["dest"], file))
                print(f"Copied {file} to {name}")
            # Also copy cover art if found in album folder
            if "cover" in file.lower() or "album" in file.lower() and (file.lower().endswith(".jpg") or file.lower().endswith(".png")):
                shutil.copy2(os.path.join(paths["src"], file), os.path.join(WEB_PUBLIC, "graphics", "albums", f"{name}_cover.{file.split('.')[-1]}"))
                print(f"Copied cover for {name}")

    # Copy Profile Image
    profile_src = os.path.join(BASE_MUSIC, "graphics", "bryant.jpg")
    if os.path.exists(profile_src):
        shutil.copy2(profile_src, os.path.join(WEB_PUBLIC, "graphics", "profile", "main.jpg"))
        print("Copied profile image")

if __name__ == "__main__":
    setup_dirs()
    copy_assets()
    print("Done organizing assets.")
