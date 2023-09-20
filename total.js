// const BOT_API_BASE_URL = "https://34.30.137.2";
const BOT_API_BASE_URL = "http://127.0.0.1:5000";

const createAxiosInstance = (config = {}) => {
    const instance = axios.create({
        baseURL: BOT_API_BASE_URL,
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
    jQuery('.welcome-container').addClass("hidden")
    jQuery('.chat-container').removeClass("hidden")
}

const closeWindow = () => {
    jQuery('.chat-container').addClass("hidden")
    jQuery('.welcome-container').removeClass("hidden")
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
                    <img class='w-10 h-10 mr-2' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.png" alt="bot" />
                    <div
                        class="left-message-text bg-white shadow-message rounded-r-lg rounded-tl-lg p-2.5">
                        <div class='flex items-center h-[24px] overflow-hidden'>
                            <img class='w-[48px] h-[48px]' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/loading-dots.gif" alt="loading" />
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
    location.href = BOT_API_BASE_URL + '/download/transcript/' + session_id;
}

const selectFAQHandle = (fId) => {
    let text = jQuery(`.faq_${fId}`).find('.left-message-text').text().trim();
    jQuery('#text').val(text);
    sendHandle();
}

jQuery(document).ready(() => {
    try {
        if (location.pathname.indexOf('afrilabs-admin') != -1) return;
        // if (location.pathname.indexOf('afrilabs-admin') != -1) {
            jQuery('.welcome-container').removeClass('hidden');
            jQuery('.bot-container').attr("style", "top: unset!important")
            window.addEventListener("resize", () => {
                jQuery('.bot-container').attr("style", "top: unset!important");
                setTimeout(() => {
                    jQuery('.bot-container').attr("style", "top: unset!important");
                })
            });
            window.addEventListener("scroll", () => {
                jQuery('.bot-container').attr("style", "top: unset!important")
                setTimeout(() => {
                    jQuery('.bot-container').attr("style", "top: unset!important")
                })
            });
        // }

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
                                    <img class='w-10 h-10 mr-2' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.png" alt="bot" />
                                    <div class="left-message-text bg-white shadow-message rounded-r-lg rounded-tl-lg p-2.5">
                                        <pre>${item.text}</pre>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <div class='chat_${item.id} message-row right-message w-full flex justify-end mb-2.5 pl-8'>
                                <div class='flex items-start'>
                                    <div
                                        class="right-message-text bg-secondary text-white shadow-message rounded-l-lg rounded-tr-lg p-2.5 ">
                                        <pre>${item.text}</pre>
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
                    const faqResponse = await axios.get(`${BOT_API_BASE_URL}/faq/0`);
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








// -------------------------------------------------------------------------------- bot-admin ============================================================
const adminLoginHandle = async () => {
    let email = jQuery("#admin-bot-email").val();
    let password = jQuery("#admin-bot-password").val();
    const axios = createAxiosInstance();
    let response = await axios.post(`/admin/login`, {
        email: email,
        password: password
    });
    if (response.data) {
        if (response.data.token) {
            localStorage.setItem("accessToken", response.data.token);
            localStorage.setItem("session_id", response.data.session_id);
            jQuery('.bot-admin-login-container').addClass('hidden');
            jQuery('.bot-admin-content-container').removeClass('hidden');
            location.reload();
        }
    }
}

const adminMenuSelect = (section) => {
    jQuery('.admin-bot-menu.active').removeClass("active");
    jQuery(`.admin-bot-menu.${section}-menu`).addClass("active");

    jQuery('.admin-bot-content.active').removeClass("active");
    jQuery(`.admin-bot-content.${section}-content`).addClass("active");
}

const formatTimeBySecond = (durationInSeconds) => {
    const minutesInHour = 60;
    const secondsInMinute = 60;
    const minutesInDay = 24 * 60;

    const days = Math.floor(durationInSeconds / (minutesInDay * secondsInMinute));
    const hours = Math.floor(durationInSeconds / (minutesInHour * secondsInMinute)) % 24;
    const minutes = Math.floor(durationInSeconds / secondsInMinute) % 60;

    let formattedTime = '';

    if (days > 0) {
        formattedTime += `${days} day${days > 1 ? 's' : ''} `;
    }
    if (hours > 0) {
        formattedTime += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
        formattedTime += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    return formattedTime.trim();
}

function formatFileSize(sizeInBytes) {
    if (sizeInBytes === 0) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const base = 1024;
    const digitGroups = Math.floor(Math.log(sizeInBytes) / Math.log(base));
    const formattedSize = parseFloat((sizeInBytes / Math.pow(base, digitGroups)).toFixed(2));

    return `${formattedSize} ${units[digitGroups]}`;
}

const editFaqHandle = (fId) => {
    console.log(fId)
    jQuery(`.faq-${fId}`).find('input').attr('readOnly', false);
    jQuery(`.faq-${fId}`).find('.faq-edit').addClass('hidden');
    jQuery(`.faq-${fId}`).find('.faq-save').removeClass('hidden');
}

const saveFaqHandle = async (fId) => {
    console.log(fId)
    const axios = createAxiosInstance();
    let text = jQuery(`.faq-${fId}`).find('input').val();
    try {
        let response = await axios.post('/faq/' + fId, {
            text: text
        })
        if (response.data) {
            jQuery(`.faq-${fId}`).find('input').attr('readOnly', true);
            jQuery(`.faq-${fId}`).find('.faq-edit').removeClass('hidden');
            jQuery(`.faq-${fId}`).find('.faq-save').addClass('hidden');
            if (fId == '0' || fId == 0) {
                jQuery(`.faq-0`).addClass(`faq-${response.data.faq_id}`);
                jQuery(`.faq-0`).find('.faq-edit').attr('onclick', `editFaqHandle(${response.data.faq_id})`);
                jQuery(`.faq-0`).find('.faq-save').attr('onclick', `saveFaqHandle(${response.data.faq_id})`);
                jQuery(`.faq-0`).find('.faq-delete').attr('onclick', `deleteFaqHandle(${response.data.faq_id})`);
                jQuery(`.faq-0`).removeClass('faq-0');
            }
        }
    } catch (err) {
        console.log(err);
    }
}

const deleteFaqHandle = async (fId) => {
    console.log(fId)
    try {
        const axios = createAxiosInstance();
        let response = await axios.delete('/faq/' + fId);
        if (response.data) {
            jQuery(`.faq-${fId}`).remove();
        }
        return false
    } catch (err) {
        console.log(err);
    }
}

const addFaqHandle = () => {
    console.log('here');
    let userRow = `
        <div class="faq-row faq-0 w-full flex items-center bg-white mb-4">
            <div class="w-full relative flex items-center">
                <input class='w-full px-4 py-2 border text-lg border-border focus:border-border rounded mr-2' value='' placeholder='' />
            </div>
            <div class='flex items-center'>
                <button onclick="saveFaqHandle(0)"
                    class="faq-save w-[26px] h-[26px] flex items-center justify-center ml-6">
                    <img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/save.png"
                        alt="saveImage" />
                </button>
                <button onclick="editFaqHandle(0)"
                    class="faq-edit w-[24px] h-[24px] flex items-center justify-center ml-6 hidden">
                    <img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/edit.png"
                        alt="editImage" />
                </button>
                <button onclick="deleteFaqHandle(0)"
                    class="faq-delete w-[28px] h-[28px] flex items-center justify-center ml-6">
                    <img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png"
                        alt="deleteImage" />
                </button>
            </div>
        </div>
    `;
    jQuery('.bot-admin-faq-section').append(userRow);
}
const scrollDownAdmin = () => {
    jQuery('.bot-admin-chat-wrap')[0].scrollTop = 10000000000;
}

const isValidFileType = (type) => {
    switch (type) {
        case 'text/plain':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/pdf':
            return true;
        default:
            return false;
    }
}


const fileValidate = (f) => {
    console.log(f);
    if (f.size > 1024 * 1024 * 100) {
        alert('File is too large');
    } else if (!isValidFileType(f.type)) {
        alert('File type is invalid.')
    }
    return true;
}

let file;

const sendAdminHandle = async () => {
    let text = jQuery('#admin-text').val();
    try {
        if (file) {
            if (!fileValidate(file)) return;
            data = new FormData();
            data.append('file', file);
            data.append('text', text);
            config = {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type
                },
            };
            let user_chat_row = `
                <div class='chat_new_user message-row left-message w-full flex mb-2.5 mr-8'>
                    <div class='flex items-start'>
                        <div
                            class="left-message-text relative bg-secondary text-white shadow-message rounded-r-lg rounded-tl-lg p-2.5">
                            <p class="mb-2"><pre>${text}</pre></p>
                            <img class="w-[20px] h-[20px]" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/attachment.png" alt="attachmentImage" />
                            <div class="flex items-center justify-end mt-1">
                                <div class="progress-container w-[80px] h-[6px] p-[1px] bg-progress-bar">
                                    <div class="w-[0px] progress-percent h-1 bg-green">
                                    </div>
                                </div>
                                <label class="ml-2 leading-none text-[10px] text-white">${formatFileSize(file.size)}</label>
                                <img class="tick-img hidden w-[10px] h-[10px] ml-1" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/tick.png" alt="tickImage" />
                            </div>
                            <button class="delete-chat absolute -right-[25px] bottom-[6px] w-[20px] h-[20px]" onclick="delteChatHandle(0)"><img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png" /></button>
                        </div>
                    </div>
                </div>
            `;
            jQuery('.bot-admin-chat-wrap').append(user_chat_row);
            let bot_chat_row = `
                <div class='chat_new_bot message-row right-message w-full flex justify-end mb-2.5 pl-8'>
                    <div class='flex items-start'>
                        <div class="right-message-text relative bg-white shadow-message rounded-l-lg rounded-tr-lg p-2.5 ">
                            <div class='flex items-center h-[24px] overflow-hidden'>
                                <img class='w-[48px] h-[48px]' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/loading-dots.gif" alt="loading" />
                            </div>
                            <button class="delete-chat absolute -right-[25px] bottom-[6px] w-[20px] h-[20px]" onclick="delteChatHandle(0)"><img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png" /></button>
                        </div>
                        <img class='w-12 h-12 ml-4' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.png" alt="bot" />
                    </div>
                </div>
            `;
            jQuery('.bot-admin-chat-wrap').append(bot_chat_row);
            scrollDownAdmin();
            let sId = sessionId();
            console.log(sId);
            const axios = createAxiosInstance();
            let response = await axios.post(`/chats/${sId}`, data, {
                ...config,
                onUploadProgress: progressEvent => {
                    const loaded = progressEvent.loaded;
                    const total = progressEvent.total ? progressEvent.total : 1;
                    const progress = Math.round((loaded / total) * 100);
                    if (progress == 100) {
                        jQuery('.chat_new_user').find('.progress-container').remove();
                        jQuery('.chat_new_user').find('.tick-img').removeClass('hidden');
                        jQuery('.imported_file_name').text("");
                        file = "";
                        jQuery('#file_import').val("");
                    } else {
                        jQuery('.chat_new_user').find('.progress-percent')[0].style.width = progress + '%';
                    }
                },
            });
            if (response.data) {
                let data = response.data.data;
                if (data.session_id) setSessionId(data.session_id);
                jQuery('.chat_new_user').addClass(`chat_${data.chat_id}`);
                jQuery('.chat_new_user').removeClass("chat_new_user");
                jQuery('.chat_new_user').find(".delete-chat").attr("onclick", `delteChatHandle(${data.chat_id})`);
                jQuery('.chat_new_bot').addClass(`chat_${data.bot_chat_id}`);
                jQuery('.chat_new_bot').find(".delete-chat").attr("onclick", `delteChatHandle(${data.bot_chat_id})`);
                jQuery('.chat_new_bot').find('.right-message-text').html(data.text_ai);
                jQuery('.chat_new_bot').find('.right-message-text img').remove();
                jQuery('.chat_new_bot').removeClass("chat_new_bot");
                scrollDownAdmin();
                totalChat += 2;
            }
        } else {
            if (!text) return;
            jQuery('#admin-text').val("");
            let user_chat_row = `
                <div class='chat_new_user message-row left-message w-full flex mb-2.5 mr-8'>
                    <div class='flex items-start'>
                        <div
                            class="left-message-text bg-secondary text-white shadow-message rounded-r-lg rounded-tl-lg p-2.5">
                            <pre>${text}</pre>
                        </div>
                    </div>
                </div>
            `;
            jQuery('.bot-admin-chat-wrap').append(user_chat_row);
            let bot_chat_row = `
                <div class='chat_new_bot message-row right-message w-full flex justify-end mb-2.5 pl-8'>
                    <div class='flex items-start'>
                        <div class="right-message-text bg-white shadow-message rounded-l-lg rounded-tr-lg p-2.5 ">
                            <div class='flex items-center h-[24px] overflow-hidden'>
                                <img class='w-[48px] h-[48px]' src="https://afrilabsgathering.com/wp-content/uploads/2023/09//loading-dots.gif" alt="loading" />
                            </div>
                        </div>
                        <img class='w-12 h-12 ml-4' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.png" alt="bot" />
                    </div>
                </div>
            `;
            jQuery('.bot-admin-chat-wrap').append(bot_chat_row);
            scrollDownAdmin();
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
                jQuery('.chat_new_bot').find('.right-message-text').html(data.text_ai);
                jQuery('.chat_new_bot').find('.right-message-text img').remove();
                jQuery('.chat_new_bot').removeClass("chat_new_bot");
                scrollDownAdmin();
                totalChat += 2;
            }
        }
    } catch (error) {
        console.log(error)
    }
}


const handleAdminKeydown = (e) => {
    if (e.code == "Enter") {
        sendAdminHandle();
    }
}

const fileChangeHandle = (e) => {
    file = e.target.files[0];
    jQuery('.imported_file_name').text(file.name);
}


const downloadUserChatHistory = async (uId) => {
    location.href = BOT_API_BASE_URL + '/download/user/' + uId;
}

const delteChatHandle = async (cId) => {
    try {
        const axios = createAxiosInstance();
        let response = await axios.delete('/chats/' + cId);
        if (response.data) {
            jQuery(`.chat_${cId}`).remove();
        }
        return false
    } catch (err) {
        console.log(err);
    }
}

const updateAnalysis = async () => {
    try {
        const axios = createAxiosInstance();
        let start_time = jQuery("#start_date").val();
        let end_time = jQuery("#end_date").val();
        console.log(start_time, end_time);
        if (start_time) start_time =  "&start_time=" + new Date(start_time).getTime() / 1000;
        if (end_time) end_time =  "&end_time=" + new Date(end_time).getTime() / 1000;
        console.log(start_time, end_time);
        let response = await axios.get(`/admin?$${start_time}${end_time}`)
        if (response.data) {
            console.log(response.data);
            let data = response.data.data;
            jQuery('#totalChatCount').html(data.chat_count);
            jQuery('#totalUserCount').html(data.user_count);
            jQuery('#averageChatCount').html(Math.round(data.average_chat_count_by_user));
            jQuery('#maxDuration').html(formatTimeBySecond(data.max_duration));
            jQuery('#maxChatCountByOneUser').html(data.max_chat_count_by_one_user);
            jQuery('#totalDownloadCount').html(data.total_download_count);

            
            jQuery('.bot-admin-content-container').removeClass('hidden');
            jQuery('.bot-admin-login-container').addClass('hidden');
        }
    } catch (err) {
        console.log("bot-admin-content-container", err)
        jQuery('.bot-admin-content-container').addClass('hidden');
        jQuery('.bot-admin-login-container').removeClass('hidden');
    }
}

jQuery(document).ready(() => {
    (async () => {
        updateAnalysis();

        try {
            const faqResponse = await axios.get(`/faq/0`);
            if (faqResponse.data) {
                let faqDatas = faqResponse.data.data;
                faqDatas.map((item, index) => {
                    let faq_row = `
                        <li class="text-lg mt-2">
                            ${item.text}
                        </li>
                    `;
                    jQuery('.admin-faq-section').append(faq_row);
                })
                if (!faqDatas.length) {
                    jQuery('.admin-faq-section').append('<li class="text-lg mt-2">There is nothing yet</li>');
                }
            }
        } catch(err) {
            console.log(err);
        }

        try {
            const axios = createAxiosInstance();
            const userResponse = await axios.get(`/users/0`);
            if (userResponse.data) {
                let userData = userResponse.data.data;
                userData.map(item => {
                    let userRow = `
                        <div class="w-full flex items-center rounded-xl bg-white p-2 mb-4">
                            <div class='w-1/4'>
                                <p class='w-full text-center text-[24px]'>${item.first_name} ${item.last_name}</p>
                            </div>
                            <div class='w-1/3'>
                                <p class='w-full text-center text-lg'>${item.phone}</p>
                            </div>
                            <div class='w-1/3'>
                                <p class='w-full text-center text-lg'>${item.email}</p>
                            </div>
                            <div>
                                <button onclick="downloadUserChatHistory(${item.id})" class="w-[32px] h-[32px] flex items-center justify-center ml-6">
                                    <img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/download.png" alt="download" />
                                </button>
                            </div>
                        </div>
                    `;
                    jQuery('.bot-admin-user-section').append(userRow);
                });
            }
        } catch (err) {
            console.log(err);
        }

        try {
            const axios = createAxiosInstance();
            const userResponse = await axios.get(`/faq/0`);
            if (userResponse.data) {
                let userData = userResponse.data.data;
                userData.map(item => {
                    let faqRow = `
                        <div class="faq-row faq-${item.id} w-full flex items-center bg-white mb-4">
                            <div class="w-full relative flex items-center">
                                <input class='w-full px-4 py-2 border text-lg border-border focus:border-border rounded mr-2' value='${item.text}' readOnly placeholder='' />
                            </div>
                            <div class='flex items-center'>
                                <button onclick="saveFaqHandle(${item.id})"
                                    class="faq-save w-[26px] h-[26px] flex items-center justify-center ml-6 hidden">
                                    <img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/save.png"
                                        alt="saveImage" />
                                </button>
                                <button onclick="editFaqHandle(${item.id})"
                                    class="faq-edit w-[24px] h-[24px] flex items-center justify-center ml-6">
                                    <img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/edit.png"
                                        alt="editImage" />
                                </button>
                                <button onclick="deleteFaqHandle(${item.id})"
                                    class="faq-delete w-[28px] h-[28px] flex items-center justify-center ml-6">
                                    <img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png"
                                        alt="deleteImage" />
                                </button>
                            </div>
                        </div>
                    `;
                    jQuery('.bot-admin-faq-section').append(faqRow);
                });
            }
        } catch (err) {
            console.log(err);
        }

        try {
            let sId = sessionId();
            const axios = createAxiosInstance();
            const response = await axios.get(`/chats/${sId}`);
            if (response.data) {
                jQuery('.bot-admin-chat-wrap').find('.message-row ').remove();

                let chats = response.data.data;
                totalChat = chats.length;
                console.log(totalChat);
                chats.map((item, index) => {
                    let chat_row = `
                        ${!item.is_bot ? `
                            <div class='chat_${item.id} message-row left-message w-full flex mb-2.5 pr-8'>
                                <div class='flex items-start'>
                                    <div class="left-message-text relative bg-secondary text-white shadow-message rounded-r-lg rounded-tl-lg p-2.5">
                                        
                                        ${item.file ? `
                                            <p class="mb-2"><pre>${item.text}</pre></p>
                                            <img class="w-[20px] h-[20px]" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/attachment.png" alt="attachmentImage" />
                                            <div class="flex items-center justify-end mt-1">
                                                <label class="ml-2 leading-none text-[10px] text-white">${formatFileSize(item.file.size)}</label>
                                                <img class="w-[10px] h-[10px] ml-1" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/tick.png" alt="tickImage" />
                                            </div>
                                        ` : `<pre>${item.text}</pre>`}

                                        <button class="delete-chat absolute -right-[25px] bottom-[6px] w-[20px] h-[20px]" onclick="delteChatHandle(${item.id})"><img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png" /></button>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <div class='chat_${item.id} message-row right-message w-full flex justify-end mb-2.5 pl-8'>
                                <div class='flex items-start'>
                                    <div
                                        class="right-message-text relative bg-white text-black shadow-message rounded-l-lg rounded-tr-lg p-2.5">
                                        <pre>${item.text}</pre>
                                        <button class="delete-chat absolute -right-[25px] bottom-[6px] w-[20px] h-[20px]" onclick="delteChatHandle(${item.id})"><img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png" /></button>
                                    </div>
                                    <img class='w-12 h-12 ml-4' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.png" alt="bot" />
                                </div>
                            </div>
                        `}
                    `;
                    jQuery('.bot-admin-chat-wrap').append(chat_row);
                    scrollDownAdmin();
                })
            }
        } catch (error) {

        }
    })()
})
