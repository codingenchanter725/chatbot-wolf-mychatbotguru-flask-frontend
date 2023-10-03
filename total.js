// const BOT_API_BASE_URL = "https://flash-backend.forillontech.com";
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

const restartChatHandle = async () => {
    setSessionId("")
    location.reload();
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

let AIThinking = false, totalChat = 0, userEmail = "";

const sendHandle = async () => {
    let text = jQuery('#text').val();
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
                <div class='chat_new_user message-row right-message w-full flex justify-end mb-2.5 pl-8'>
                    <div class='flex items-start'>
                        <div class="right-message-text relative bg-secondary text-white shadow-message rounded-l-lg rounded-tr-lg p-2.5 ">
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
                        </div>
                    </div>
                </div>
            `;
            jQuery('#chat-wrap').append(user_chat_row);
            let bot_chat_row = `
                <div class='chat_new_bot message-row left-message w-full flex mb-2.5 mr-8'>
                    <div class='flex items-start'>
                        <img class='w-10 h-10 mr-2 rounded-full' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.jpg" alt="bot" />
                        <div class="left-message-text relative shadow-message bg-white rounded-r-lg rounded-tl-lg p-2.5">
                            <pre></pre>
                            <div class='chat-loading flex items-center h-[24px] overflow-hidden'>
                                <img class='w-[48px] h-[48px]' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/loading-dots.gif" alt="loading" />
                            </div>
                        </div>
                    </div>
                </div>
            `;
            jQuery('#chat-wrap').append(bot_chat_row);
            scrollDown();
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

                jQuery('.chat_new_bot').addClass(`chat_${data.bot_chat_id}`);
                jQuery('.chat_new_bot').find('.left-message-text pre').html(data.text_ai);
                jQuery('.chat_new_bot').find('.left-message-text .chat-loading').remove();
                jQuery('.chat_new_bot').removeClass("chat_new_bot");
                scrollDown();
                totalChat += 2;
            }
        } else {
            if (!text) return;
            jQuery('#text').val("");
            let user_chat_row = `
                <div class='chat_new_user message-row right-message w-full flex justify-end mb-2.5 pl-8'>
                    <div class='flex items-start'>
                        <div class="right-message-text relative bg-secondary text-white  shadow-message rounded-l-lg rounded-tr-lg p-2.5 ">
                            <pre>${text}</pre>
                        </div>
                    </div>
                </div>
            `;
            jQuery('#chat-wrap').append(user_chat_row);
            let bot_chat_row = `
                <div class='chat_new_bot message-row left-message w-full flex mb-2.5 mr-8'>
                    <div class='flex items-start'>
                        <img class='w-10 h-10 mr-2 rounded-full' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.jpg" alt="bot" />
                        <div class="left-message-text relative bg-white shadow-message rounded-r-lg rounded-tl-lg p-2.5">
                            <pre></pre>
                            <div class='chat-loading flex items-center h-[24px] overflow-hidden'>
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
                jQuery('.chat_new_bot').find('.left-message-text pre').html(data.text_ai);
                jQuery('.chat_new_bot').find('.left-message-text .chat-loading').remove();
                jQuery('.chat_new_bot').removeClass("chat_new_bot");
                scrollDown();
                totalChat += 2;
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const sendHandle1 = async (isSubmit = false) => {
    // try {
    //     let text = jQuery("#text").val().trim();
    //     if (!text) return;
    //     clearText();
    //     let user_chat_row = `
    //         <div class='chat_new_user message-row right-message w-full flex justify-end mb-2.5 pl-8'>
    //             <div class='flex items-start'>
    //                 <div class="right-message-text bg-secondary text-white shadow-message rounded-l-lg rounded-tr-lg p-2.5 ">
    //                     <pre>${text}</pre>
    //                 </div>
    //             </div>
    //         </div>
    //     `;
    //     jQuery('#chat-wrap').append(user_chat_row);
    //     let bot_chat_row = `
    //         <div class='chat_new_bot message-row left-message w-full flex mb-2.5 mr-8'>
    //             <div class='flex items-start'>
    //                 <img class='w-10 h-10 mr-2 rounded-full' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.jpg" alt="bot" />
    //                 <div class="left-message-text bg-white shadow-message rounded-r-lg rounded-tl-lg p-2.5">
    //                     <pre></pre>
    //                     <div class='chat-loading flex items-center h-[24px] overflow-hidden'>
    //                         <img class='w-[48px] h-[48px]' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/loading-dots.gif" alt="loading" />
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     `;
    //     jQuery('#chat-wrap').append(bot_chat_row);
    //     scrollDown();
    //     let sId = sessionId();
    //     const axios = createAxiosInstance();
    //     let response = await axios.post(`/chats/${sId}`, {
    //         text: text
    //     });
    //     if (response.data) {
    //         let data = response.data.data;
    //         if (data.session_id) setSessionId(data.session_id);
    //         jQuery('.chat_new_user').addClass(`chat_${data.chat_id}`);
    //         jQuery('.chat_new_user').removeClass("chat_new_user");
    //         jQuery('.chat_new_bot').addClass(`chat_${data.bot_chat_id}`);
    //         jQuery('.chat_new_bot').find('.left-message-text pre').html(data.text_ai);
    //         jQuery('.chat_new_bot').find('.left-message-text .chat-loading').remove();
    //         jQuery('.chat_new_bot').removeClass("chat_new_bot");
    //         scrollDown();
    //         totalChat += 2;
    //     }
    //     scrollDown();
    // } catch (err) {
    //     console.log('sendhandle', err);
    //     if (err.response.data.message === "Email is already taken") {
    //         alert("Email is already taken")
    //     }
    // }
}

const handleKeydown = (e) => {
    if (e.code == "Enter") {
        sendHandle();
    }
}

jQuery(document).ready(() => {
    try {
        (async () => {
            let sId = sessionId();
            const axios = createAxiosInstance();
            const response = await axios.get(`/chats/${sId}`);
            if (response.data) {
                jQuery('#chat-wrap').find('.message-row ').remove();
                userEmail = response.data.user.email ? true : false;

                let chats = response.data.data;
                totalChat = chats.length;
                chats.map((item, index) => {
                    let chat_row = `
                        ${item.is_bot ? `
                            <div class='chat_${item.id} message-row left-message w-full flex mb-2.5 pr-8'>
                                <div class='flex items-start'>
                                    <img class='w-10 h-10 mr-2 rounded-full' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.jpg" alt="bot" />
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

                                        ${item.file ? `
                                            <p class="mb-2"><pre>${item.text}</pre></p>
                                            <img class="w-[20px] h-[20px]" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/attachment.png" alt="attachmentImage" />
                                            <div class="flex items-center justify-end mt-1">
                                                <label class="ml-2 leading-none text-[10px] text-white">${formatFileSize(item.file.size)}</label>
                                                <img class="w-[10px] h-[10px] ml-1" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/tick.png" alt="tickImage" />
                                            </div>
                                        ` : `<pre>${item.text}</pre>`}

                                    </div>
                                </div>
                            </div>
                        `}
                    `;
                    jQuery('#chat-wrap').append(chat_row);
                    scrollDown()
                })
            }
        })()
    } catch (err) {
        console.log(err)
    }
})








// -------------------------------------------------------------------------------- bot-admin ============================================================
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

let file, lastUpdatedTime = Date.now();

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
                            <button class="delete-chat absolute -right-[25px] bottom-[6px] w-[20px] h-[20px]" onclick="deleteChatHandle(0)"><img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png" /></button>
                        </div>
                    </div>
                </div>
            `;
            jQuery('.bot-admin-chat-wrap').append(user_chat_row);
            let bot_chat_row = `
                <div class='chat_new_bot message-row right-message w-full flex justify-end mb-2.5 pl-8'>
                    <div class='flex items-start'>
                        <div class="right-message-text relative bg-white shadow-message rounded-l-lg rounded-tr-lg p-2.5 ">
                            <pre></pre>
                            <div class='chat-loading flex items-center h-[24px] overflow-hidden'>
                                <img class='w-[48px] h-[48px]' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/loading-dots.gif" alt="loading" />
                            </div>
                            <button class="delete-chat absolute -right-[25px] bottom-[6px] w-[20px] h-[20px]" onclick="deleteChatHandle(0)"><img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png" /></button>
                        </div>
                        <img class='w-12 h-12 ml-6 rounded-full' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.jpg" alt="bot" />
                    </div>
                </div>
            `;
            jQuery('.bot-admin-chat-wrap').append(bot_chat_row);
            scrollDownAdmin();
            let sId = sessionId();
            console.log(sId);
            const axios = createAxiosInstance();
            let response = await axios.post(`/chats/${sId}?is_admin=1`, data, {
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
                jQuery('.chat_new_user').find(".delete-chat").attr("onclick", `deleteChatHandle(${data.chat_id})`);
                jQuery('.chat_new_user').removeClass("chat_new_user");

                jQuery('.chat_new_bot').addClass(`chat_${data.bot_chat_id}`);
                jQuery('.chat_new_bot').find(".delete-chat").attr("onclick", `deleteChatHandle(${data.bot_chat_id})`);
                jQuery('.chat_new_bot').find('.right-message-text pre').html(data.text_ai);
                jQuery('.chat_new_bot').find('.right-message-text .chat-loading').remove();
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
                            class="left-message-text relative bg-secondary text-white shadow-message rounded-r-lg rounded-tl-lg p-2.5">
                            <pre>${text}</pre>
                            <button class="delete-chat absolute -right-[25px] bottom-[6px] w-[20px] h-[20px]" onclick="deleteChatHandle(0)"><img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png" /></button>
                        </div>
                    </div>
                </div>
            `;
            jQuery('.bot-admin-chat-wrap').append(user_chat_row);
            let bot_chat_row = `
                <div class='chat_new_bot message-row right-message w-full flex justify-end mb-2.5 pl-8'>
                    <div class='flex items-start'>
                        <div class="right-message-text relative bg-white shadow-message rounded-l-lg rounded-tr-lg p-2.5 ">
                            <pre></pre>
                            <div class='chat-loading flex items-center h-[24px] overflow-hidden'>
                                <img class='w-[48px] h-[48px]' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/loading-dots.gif" alt="loading" />
                            </div>
                            <button class="delete-chat absolute -right-[25px] bottom-[6px] w-[20px] h-[20px]" onclick="deleteChatHandle(0)"><img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png" /></button>
                        </div>
                        <img class='w-12 h-12 ml-6 rounded-full' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.jpg" alt="bot" />
                    </div>
                </div>
            `;
            jQuery('.bot-admin-chat-wrap').append(bot_chat_row);
            scrollDownAdmin();
            let sId = sessionId();
            const axios = createAxiosInstance();
            let response = await axios.post(`/chats/${sId}?is_admin=1`, {
                text: text
            });
            if (response.data) {
                let data = response.data.data;
                if (data.session_id) setSessionId(data.session_id);
                jQuery('.chat_new_user').addClass(`chat_${data.chat_id}`);
                jQuery('.chat_new_user').find(".delete-chat").attr("onclick", `deleteChatHandle(${data.chat_id})`);
                jQuery('.chat_new_user').removeClass("chat_new_user");
                jQuery('.chat_new_bot').addClass(`chat_${data.bot_chat_id}`);
                jQuery('.chat_new_bot').find(".delete-chat").attr("onclick", `deleteChatHandle(${data.bot_chat_id})`);
                jQuery('.chat_new_bot').find('.right-message-text pre').html(data.text_ai);
                jQuery('.chat_new_bot').find('.right-message-text .chat-loading').remove();
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

const deleteChatHandle = async (cId) => {
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

const changeInitialPromptHandle = async (e) => {
    let text = e.target.value;

    lastUpdatedTime = Date.now();
    setTimeout(async () => {
        let deft = Date.now() - lastUpdatedTime;
        if (deft > 1000) {
            const axios = createAxiosInstance();
            let response = await axios.put('/admin/initial_prompt', {
                text: text
            });
        }
    }, 1000);
}

jQuery(document).ready(() => {
    (async () => {
        try {
            let sId = sessionId();
            const axios = createAxiosInstance();
            const response = await axios.get(`/chats/${sId}?is_admin=1`);
            if (response.data) {
                jQuery('.bot-admin-chat-wrap').find('.message-row').remove();

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

                                        <button class="delete-chat absolute -right-[25px] bottom-[6px] w-[20px] h-[20px]" onclick="deleteChatHandle(${item.id})"><img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png" /></button>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <div class='chat_${item.id} message-row right-message w-full flex justify-end mb-2.5 pl-8'>
                                <div class='flex items-start'>
                                    <div
                                        class="right-message-text relative bg-white text-black shadow-message rounded-l-lg rounded-tr-lg p-2.5">
                                        <pre>${item.text}</pre>
                                        <button class="delete-chat absolute -right-[25px] bottom-[6px] w-[20px] h-[20px]" onclick="deleteChatHandle(${item.id})"><img class="w-full h-full" src="https://afrilabsgathering.com/wp-content/uploads/2023/09/delete.png" /></button>
                                    </div>
                                    <img class='w-12 h-12 ml-6 rounded-full' src="https://afrilabsgathering.com/wp-content/uploads/2023/09/bot.jpg" alt="bot" />
                                </div>
                            </div>
                        `}
                    `;
                    jQuery('.bot-admin-chat-wrap').append(chat_row);
                    scrollDownAdmin();
                })
                if (response.data.sessionId) {
                    setSessionId(response.data.sessionId)
                }
            }
        } catch (error) {

        }

        try {
            const axios = createAxiosInstance();
            const response = await axios.get(`/admin/initial_prompt`);
            if (response.data) {
                let text = response.data.data.text;
                jQuery('#initial-prompt').val(text);
            }
        } catch (error) {

        }
    })()
})
