/*
Данный продукт включает компоненты, разработанные "An1by" (https://aniby.net/).
Оригинальный репозиторий: https://github.com/an1by/StreamFeatures
 */

let totalMessages = 0;
let msgLimit = true;
let msgLimitAmount = 12;
let msgAlign = "top";

window.addEventListener("onWidgetLoad", async (initData) => {
    // fields.json & data.json
    let widgetSettings = initData.detail.fieldData;
});

// Обработчик событий виджета
window.addEventListener("onEventReceived", (event) => {
    const eventData = event.detail;

    // Удаление сообщений
    if (eventData.listener === "delete-message") {
        $(`.message-row[data-msgid=${eventData.event.msgId}]`).remove();
        return;
    }

    if (eventData.listener === "delete-messages") {
        $(`.message-row[data-sender=${eventData.event.userId}]`).remove();
        return;
    }

    // Обработка обычных сообщений
    if (eventData.listener === "message") {
        processChatMessage(eventData.event.data);
    }
});

function shouldIgnoreMessage(eventData) {
    return (eventData.text.startsWith('!') && hideCommands === "yes") || ignoredUserList.indexOf(eventData.nick) !== -1;
}

function addElementToContainer(html) {
    const container = $("main");

    let element;

    if (msgAlign === "top") {
        container.append(html);
        element = container.children().last();
    } else {
        container.prepend(html);
        element = container.children().first();
    }

    element.hide().slideToggle(200);
}

function createMessageTemplate(msgId, senderId, senderName, message) {
    return $.parseHTML(`
        <div data-sender="${senderId}" data-msgid="${msgId}" 
            class="message">
            <div class="username">${senderName}</div>
            <div class="text">${message}</div>
        </div>
    `);
}

// Основная функция добавления сообщения
function addMessage(senderName, messageContent, senderID, messageID) {
    totalMessages++;

    // Выбираем шаблон в зависимости от типа сообщения
    let messageElement = createMessageTemplate(messageID, senderID, senderName, messageContent);

    // Добавляем сообщение в контейнер
    addElementToContainer(messageElement);

    // Лимитирование сообщений
    if (msgLimit && totalMessages > msgLimitAmount) {
        handleMessageLimit();
    }
}

function processChatMessage(messageData) {
    if (shouldIgnoreMessage(messageData)) return;

    const processedMessage = processMessageContent(messageData);

    addMessage(messageData.displayName, processedMessage, messageData.userId, messageData.msgId);
}

function handleMessageLimit() {
    const children = $(".message-row");
    const element = msgAlign === "bottom" ? children.first() : children.last();
    element.remove();
}

// Сюда кидаем текст ивента, чтобы добавить смайлики
function processMessageContent(element) {
    let html = html_encode(element.text);
    let emoteList = element.emotes;
    let modifiableHtml = html;
    for (let i = 0; i < emoteList.length; i++) {
        modifiableHtml = modifiableHtml.replace(emoteList[i].name, " ");
        modifiableHtml = modifiableHtml.replace(/\p{C}/gu, '');
    }
    return html.replace(/(\S*)/gi, (smth, str) => {
        let filteredEmotes = emoteList.filter(emote => {
            return html_encode(emote.name) === str;
        });
        let emotes_length = 0;
        if (typeof filteredEmotes[0] !== 'undefined') {
            let result;
            emotes_length = element.emotes.length;
            if (modifiableHtml.trim() === '' && largeEmotes) {
                if (emotes_length === 1) {
                    let imageSource = filteredEmotes[0].urls[4];
                    if (imageSource.search(/cdn.frankerfacez.com/ !== -1)) {
                        imageSource = imageSource.replace("https:https:", "https:");
                    }
                    result = `<img alt="" class="emote large" src="${imageSource}"/>`;
                } else {
                    if (emotes_length > 1) {
                        let imageSource = filteredEmotes[0].urls[2];
                        if (imageSource.search(/cdn.frankerfacez.com/ !== -1)) {
                            imageSource = imageSource.replace("https:https:", "https:");
                        }
                        result = `<img alt="" class="emote default" src="${imageSource}"/>`;
                    }
                }
            } else {
                let imageSource = filteredEmotes[0].urls[1];
                if (imageSource.search(/cdn.frankerfacez.com/ !== -1)) {
                    imageSource = imageSource.replace('https:https:', "https:");
                }
                result = `<img alt="" class="emote small" src="${imageSource}"/>`;
            }
            return result;
        } else {
            return str;
        }
    });
}

function html_encode(html) {
    return html.replace(/[<>"^]/g, function (match) {
        return '&#' + match.charCodeAt(0x0) + ';';
    });
}
