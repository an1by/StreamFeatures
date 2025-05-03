import zipfile

name = "an1by"

zip_path = f"./{name}_chat.zip"

with zipfile.ZipFile(zip_path, "w") as zip:
    zip.write("index.html", "html.txt")
    zip.write("index.js", "js.txt")
    zip.write("index.css", "css.txt")
    zip.write("fields.json", "fields.txt")
    zip.write("data.json", "data.txt")
    zip.writestr(
        "README.txt",
        f"Чат сделан специально для {name} ♥" +
        f"\nСоздатель: an1by / https://aniby.net" +
        f"\n\nГайд по установке чата: https://youtu.be/sY1hULqQms8"
    )
