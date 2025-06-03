# Packer

Создает архив, удобный для взаимодействия для ваших клиентов.\
Конвертирует следующие файлы:

* `index.html -> html.txt`
* `index.js -> js.txt`
* `index.css -> css.txt`
* `data.json -> data.txt`
* `fields.json -> fields.txt`

И добавляет `ПРОЧТИ_МЕНЯ.txt` с инструкцией по установке

## Подготовка

1. Установка `Python 3.8+`
2. `pip install requests zipfile`

## Использование

Скрипты для `Bash`/`Git Bash`

### Chat

```bash
curl -s https://raw.githubusercontent.com/an1by/StreamFeatures/refs/heads/master/scripts/packer/chat.py | \
python - "CHAT_README" "клиент" "автор" "ширина" "высота"
```

### Donation Goal (стандарт)

```bash
curl -s https://raw.githubusercontent.com/an1by/StreamFeatures/refs/heads/master/scripts/packer/donation_goal.py | \
python - "DONATION_GOAL_README" "клиент" "автор" "ширина" "высота"
```

### Donation Goal (st-aniby)

```bash
curl -s https://raw.githubusercontent.com/an1by/StreamFeatures/refs/heads/master/scripts/packer/donation_goal.py | \
python - "DONATION_GOAL_ANIBY_README" "клиент" "автор" "ширина" "высота"
```
