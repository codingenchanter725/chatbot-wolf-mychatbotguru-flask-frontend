const BASE_URL = "http://localhost:5000";

const createAxiosInstance = (config = {}) => {
    const instance = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('accessToken')}`,
        },
        ...config, // Override default configuration if provided
    });

    // Add interceptors, custom defaults, etc. if needed

    return instance;
};

const goChathandle = () => {
    jQuery('.welocome-container').addClass("hidden")
    jQuery('.chat-container').removeClass("hidden")
}

const closeWindow = () => {
    jQuery('.chat-container').addClass("hidden")
    jQuery('.welocome-container').removeClass("hidden")
}

const changeSizeWindows = () => {
    jQuery('.size-btn').toggleClass("rotate-180");
    jQuery('.chat-container').toggleClass("max-now")
}

const scrollDown = () => {
    jQuery('#chat-wrap')[0].scrollTop = 10000000000;
}

const clearText = () => {
    jQuery('#text').val("");
}


const sessionId = () => {
    let sId = localStorage.getItem("session_id");
    return (!sId || sId == 'undefined' || sId == "") ? 0 : sId;
}
const setSessionId = (sId) => {
    localStorage.setItem('session_id', sId);
}

const toggleTextReadOnly = (val, is_user) => {
    if (val && !is_user) {
        jQuery('#text').attr('readOnly', val);
        console.log(is_user)
        jQuery('#chat-wrap').append(jQuery('.user-form'));
        jQuery('.user-form').removeClass('hidden')
    }
}

let AIThinking = false, totalChat = 0;

const sendHandle = async () => {
    try {
        if (jQuery('#text').attr('readOnly')) {

            const axios = createAxiosInstance();
            let response = await axios.post(`/register`, {
                'first_name': jQuery('#firstname').val(),
                'last_name': jQuery('#lastname').val(),
                'email': jQuery('#email').val(),
                'phone': jQuery('#phone').val(),
                'password': 'User$123',
                'session_id': sessionId()
            });
            if (response.data) {
                console.log('UserForm', response.data)
                if (response.data.message === "Email is already taken") {
                    alert("Email is already taken")
                } else {
                    jQuery('.user-form').addClass('hidden')
                    jQuery('#text').attr('readOnly', false);
                }
            }
            return;
        }

        let text = jQuery("#text").val().trim();
        if (!text) return;
        clearText();
        let user_chat_row = `
            <div class='chat_new_user message-row right-message w-full flex justify-end mb-2.5 pl-8'>
                <div class='flex items-start'>
                    <div class="right-message-text bg-secondary text-white shadow-message rounded-l-lg rounded-tr-lg p-2.5 ">
                        ${text}
                    </div>
                </div>
            </div>
        `;
        jQuery('#chat-wrap').append(user_chat_row);
        let bot_chat_row = `
            <div class='chat_new_bot message-row left-message w-full flex mb-2.5 mr-8'>
                <div class='flex items-start'>
                    <img class='w-12 h-12 mr-4' src="./images/bot.png" alt="bot" />
                    <div
                        class="left-message-text bg-white shadow-message rounded-r-lg rounded-tl-lg p-2.5">
                        <div class='flex items-center h-[24px] overflow-hidden'>
                            <img class='w-[48px] h-[48px]' src="./images//loading-dots.gif" alt="loading" />
                        </div>
                    </div>
                </div>
            </div>
        `;
        jQuery('#chat-wrap').append(bot_chat_row);
        scrollDown();
        let sId = sessionId();
        const axios = createAxiosInstance();
        let response = await axios.post(`/chats/${sId}`, {
            text: text
        });
        if (response.data) {
            let data = response.data.data;
            if (data.session_id) setSessionId(data.session_id);
            jQuery('.chat_new_user').addClass(`chat_${data.chat_id}`);
            jQuery('.chat_new_user').removeClass("chat_new_user");
            jQuery('.chat_new_bot').addClass(`chat_${data.bot_chat_id}`);
            jQuery('.chat_new_bot').find('.left-message-text').html(data.text_ai);
            jQuery('.chat_new_bot').find('.left-message-text img').remove();
            jQuery('.chat_new_bot').removeClass("chat_new_bot");
            scrollDown();
            totalChat += 2;
        }

        if (totalChat >= 4) {
            jQuery('.faq-section').remove();
            if (totalChat > 4) {
                jQuery('.user-form').remove();
            }
        }
        if (totalChat == 4) {
            /// user form handle
            toggleTextReadOnly(true)
        }
        if (totalChat < 4) {
            jQuery('#chat-wrap').append(jQuery('.faq-section'));
            jQuery('.faq-section').removeClass('hidden')
        }
    } catch (err) {
        console.log('sendhandle', err);
    }
}

const handleKeydown = (e) => {
    if (e.code == "Enter") {
        sendHandle();
    }
}

const downloadTranscript = async () => {
    let session_id = sessionId();
    location.href = BASE_URL + '/download/transcript/' + session_id;
}

const selectFAQHandle = (fId) => {
    let text = jQuery(`.faq_${fId}`).find('.left-message-text').text().trim();
    jQuery('#text').val(text);
    sendHandle();
}

jQuery(document).ready(() => {
    try {
        (async () => {
            let sId = sessionId();
            const axios = createAxiosInstance();
            const response = await axios.get(`/chats/${sId}`);
            if (response.data) {
                jQuery('#chat-wrap').find('.message-row ').remove();

                let chats = response.data.data;
                totalChat = chats.length;
                chats.map((item, index) => {
                    let chat_row = `
                        ${item.is_bot ? `
                            <div class='chat_${item.id} message-row left-message w-full flex mb-2.5 pr-8'>
                                <div class='flex items-start'>
                                    <img class='w-12 h-12 mr-4' src="./images/bot.png" alt="bot" />
                                    <div class="left-message-text bg-white shadow-message rounded-r-lg rounded-tl-lg p-2.5">
                                        ${item.text}
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <div class='chat_${item.id} message-row right-message w-full flex justify-end mb-2.5 pl-8'>
                                <div class='flex items-start'>
                                    <div
                                        class="right-message-text bg-secondary text-white shadow-message rounded-l-lg rounded-tr-lg p-2.5 ">
                                        ${item.text}
                                    </div>
                                </div>
                            </div>
                        `}
                    `;
                    jQuery('#chat-wrap').append(chat_row);
                    scrollDown()
                })

                if (chats.length < 4) {
                    jQuery('#chat-wrap').append(jQuery('.faq-section'));
                    const faqResponse = await axios.get(`${BASE_URL}/faq/0`);
                    if (faqResponse.data) {
                        let faqDatas = faqResponse.data.data;
                        faqDatas.map((item, index) => {
                            let faq_row = `
                                <div class="${'faq_' + item.id} ml-[72px]">
                                    <span class="cursor-pointer" onclick="selectFAQHandle(${item.id})">
                                        <div id="chat_${item.id}" class='left-message w-full flex mb-2.5 pr-8'>
                                            <div class='flex items-start'>
                                                <div class="left-message-text !border-primary border !rounded-none bg-white !mb-0 shadow-message rounded-r-lg rounded-tl-lg p-2.5">
                                                    ${item.text}
                                                </div>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                            `;
                            jQuery('.faq-section').append(faq_row)
                            scrollDown()
                        })
                    }
                    jQuery('.faq-section').toggleClass('hidden');
                    scrollDown()
                }
                if (totalChat == 4) {
                    toggleTextReadOnly(true, response.data.user.email ? true : false)
                }
            }
        })()
    } catch (err) {
        console.log(err)
    }
})