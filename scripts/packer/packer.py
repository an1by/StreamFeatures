import sys
import zipfile

import requests

# Console Input
widgetType = sys.argv[1]
client = sys.argv[2]
credits = sys.argv[3]
width = sys.argv[4]
height = sys.argv[5]

# README text
url = f"https://raw.githubusercontent.com/an1by/StreamFeatures/refs/heads/master/scripts/packer/{widgetType.upper()}_README.md"
response = requests.get(url)
readmeText = (
    response.text
    .replace("{credits}", credits)
    .replace("{client}", client)
    .replace("{width}", width)
    .replace("{height}", height)
)

# Forming ZIP
zip_path = f"./{widgetType.lower()}_donation_goal.zip"
with zipfile.ZipFile(zip_path, "w") as zip:
    zip.write("index.html", "html.txt")
    zip.write("index.js", "js.txt")
    zip.write("index.css", "css.txt")
    zip.write("fields.json", "fields.txt")
    zip.write("data.json", "data.txt")
    zip.writestr("ПРОЧТИ_МЕНЯ.txt", readmeText)
