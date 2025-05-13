# Разработка под DonationAlerts

## Официальное API

API, с которым можно беспрепятственно взаимодействовать прописано
в [документации на официальном сайте][1].

Для взаимодействия с Centrifugo нужно работать с определенной версией.
Путем проб и страданий я нашел ее, способ экспорта ниже.

<a id="centrifuge"></a>

```html
<script type="text/javascript" src="https://unpkg.com/centrifuge@2.8.5/dist/centrifuge.js"></script>
```

## "Скрытое" API

У DonationAlerts есть [API, которое не прописано в официальной документации][2],
но доступ к нему более чем свободный. И с ним есть проблема, заключающаяся
в ошибке CORS - сервер DonationAlerts не позволяет взаимодействовать с ним
в браузере извне домена `donationalerts.com`, из-за чего приходится поднимать
собственный сервер для более удобного DonationAlerts.

`st.aniby.net` - **костыльный, но рабочий способ** обойти браузерную блокировку
CORS при попытке обращения к DonationAlerts.\
[Актуальная документация сервиса][3]

В случае чего, можно поднять этот сервис у себя, так как он опубликован
в [открытом доступе](https://github.com/an1by/st-aniby).

В виджет / браузер код работы с этим API можно экспортировать так:

```html
<script type="text/javascript" src="https://raw.githubusercontent.com/an1by/StreamFeatures/refs/heads/master/libs/donationalerts/donationalerts.umd.min.js"></script>
```
> Разобрать код можно [здесь](/libs/donationalerts/donationalerts.js).

Перед этим обязательно <a href="#centrifuge">экспортируйте Cenrifuge</a>!

## TOS & Privacy

Перед использованием данного сервиса прочтите эти два документа:

* Условия использования: https://st.aniby.net/terms-of-service
* Политика конфиденциальности: https://st.aniby.net/privacy-policy

[1]: https://www.donationalerts.com/apidoc

[2]: https://st.aniby.net/docs/da

[3]: https://st.aniby.net/docs
