cat "$1" | umd "$2" > "$3.umd.js"
cat "$1" | umd "$2" | uglifyjs --compress --mangle -- > "$3.umd.min.js"
