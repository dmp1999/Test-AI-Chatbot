(function(userPin, chatbotName, chatImagePath, greeting) {

    // TEMPLATE js
    
    // Variables to be embedded inside html and css template strings as ${chatbotName}

    // Scoped CSS
    const styles = `
    /* CHATBOX
    =============== */
    .chatbox {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
    }
    
    /* CONTENT IS CLOSE */
    .chatbox__support {
        max-width: 70vw;
        max-height: 70vh;
        display: flex;
        flex-direction: column;
        background: #333;
        resize: both;
        overflow: hidden;
        overflow-y: auto;
        position: fixed;
        bottom: 7vh;
        right: 2vw;
        width: 450px;
        height: 600px;
        z-index: -123456;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: all .5s ease-in-out;
    }

    /* CONTENT ISOPEN */
    .chatbox--active {
        transform: translateY(-40px);
        visibility: visible;
        pointer-events: auto;
        z-index: 123456;
        opacity: 1;
    
    }
    
    /* BUTTON */
    .chatbox__button {
        text-align: right;
    }
    
    .chatbox__button img {
        width: 50px;
        height: auto;
    }
    
    .chatbox__button button,
    .chatbox__button button:focus,
    .chatbox__button button:visited {
        padding: 0.75vh;
        background: #333;
        border: none;
        outline: none;
        border-top-left-radius: 3vh;
        border-top-right-radius: 3vh;
        border-bottom-left-radius: 3vh;
        border-bottom-right-radius: 3vh;
        box-shadow: 0 1vh 2vh rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }

    .send__button {
        padding: 6px;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
    }
    
    /* HEADER */
    .chatbox__header {
        position: sticky;
        top: 0;
        background: var(--primaryGradient);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 15px 20px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        box-shadow: var(--primaryBoxShadow);
    }

    /* MESSAGES */
    .chatbox__messages {
        /* background: white; */
        margin-top: auto;
        display: flex;
        overflow-y: scroll;
        flex-direction: column-reverse;
        padding: 0 20px;
    }
    
    .messages__item {
        margin-top: 10px;
        background: white;
        color: black;
        padding: 8px 12px;
        max-width: 70%;
        width: fit-content;
    }
    
    .messages__item--visitor,
    .messages__item--typing {
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        background: white;
        color: black;
        margin-right: auto;
    }
    
    .messages__item--operator {
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 20px;
        background: white;
        color: black;
        margin-left: auto;
    }
        
    /* FOOTER */
    .chatbox__footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 20px 20px;
        background: var(--secondaryGradient);
        box-shadow: var(--secondaryBoxShadow);
        position: sticky;
        bottom: 0;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        margin-top: 20px;
    }

    .chatbox__footer input {
        width: 80%;
        border: none;
        padding: 10px 10px;
        border-radius: 30px;
        text-align: left;
    }

    .chatbox__image--header {
        margin-right: 10px;
    }

    .chatbox__image--header img {
        width: 3vw;
        height: auto;
    }
    
    .chatbox__heading--header {
        font-size: 1.2rem;
        color: white;
    }
    
    .chatbox__description--header {
        font-size: .9rem;
        color: white;
    }
    
    .chatbox__send--footer {
        color: white;
    }
    `;

    // Create a style element for the CSS
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    // Chatbot HTML
    const chatbotHTML = `
    <div class="container">
        <div class="chatbox">
            <div class="chatbox__support">
                <div class="chatbox__header">
                    <div class="chatbox__image--header">
                        <img src=${chatImagePath} alt="image">
                    </div>
                    <div class="chatbox__content--header">
                        <h4 class="chatbox__heading--header">${chatbotName}</h4>
                        <!-- <p class="chatbox__description--header">Ask me about our products and services.</p> -->
                    </div>
                </div>
                <div class="chatbox__messages">
                    <div></div>
                </div>
                <div class="chatbox__footer">
                    <input type="text" placeholder="Write a message...">
                    <button class="chatbox__send--footer send__button">Send</button>
                </div>
            </div>
            <div class="chatbox__button">
                <button><img src=${chatImagePath} alt="image"/></button>
            </div>
        </div>
    </div>
    `;

    // Create chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = "chatbot-container";  // Assign a class for potential style targeting
    chatbotContainer.innerHTML = chatbotHTML;
    document.body.appendChild(chatbotContainer);

    // JavaScript Logic
    // const SCRIPT_ROOT = "http://127.0.0.1:5000/"
    const SCRIPT_ROOT = "https://ai-chatbot-production-19f7.up.railway.app/chat/";
    // const SCRIPT_ROOT = "https://chatbot-service-2w5n.onrender.com/chat/"
    class Chatbox {
        constructor() {
            this.args = {
                openButton: document.querySelector('.chatbox__button'),
                chatBox: document.querySelector('.chatbox__support'),
                sendButton: document.querySelector('.send__button')
            }
    
            this.state = false;
            this.messages = [];
    
        }
    
        display() {
            const {openButton, chatBox, sendButton} = this.args;
    
            openButton.addEventListener('click', () => this.toggleState(chatBox))
    
            sendButton.addEventListener('click', () => this.onSendButton(chatBox))
    
            const node = chatBox.querySelector('input')
            node.addEventListener("keyup", ({key}) => {
                if (key === "Enter") {
                    this.onSendButton(chatBox)
                }
            })
    
            let msg0 = {name: chatbotName, message: greeting}
            this.messages.push(msg0)
            this.updateChatText(chatBox)
        }
    
        toggleState(chatbox) {
            this.state = !this.state;
    
            if(this.state) {
                chatbox.classList.add('chatbox--active')
            } else {
                chatbox.classList.remove('chatbox--active')
            }
        }
    
        onSendButton(chatbox) {
            var textField = chatbox.querySelector('input');
            let text1 = textField.value
            if (text1 === "") {
                return;
            }
    
            let msg1 = {name: "User", message: text1}
            this.messages.push(msg1)
            this.updateChatText(chatbox)
            textField.value = ''
    
            fetch(SCRIPT_ROOT, {
                method: 'POST',
                body: JSON.stringify({
                    message: text1,
                    userPin: userPin}),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(r => r.json())
            .then(r => {
                let msg2 = {name: chatbotName, message: r.answer};
                this.messages.push(msg2);
                this.updateChatText(chatbox)
                textField.value = ''
    
            }).catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox)
                textField.value = ''
            });
        }
    
        updateChatText(chatbox) {
    
            var html = '';
            this.messages.slice().reverse().forEach(function(item) {
                if (item.name === chatbotName)
                {
                    html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
                }
                else
                {
                    html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
                }
            });
    
            const chatmessage = chatbox.querySelector('.chatbox__messages');
            chatmessage.innerHTML = html;
    
        }
    
        setupResize() {
            let startX, startY, startWidth, startHeight;
        
            // Helper function to disable text selection
            const disableTextSelection = () => {
                document.body.style.userSelect = 'none';
            };
        
            // Helper function to re-enable text selection
            const enableTextSelection = () => {
                document.body.style.userSelect = '';
            };
        
            // Create the resizing handle
            const resizeHandle = document.createElement('div');
            resizeHandle.style.width = '10px';
            resizeHandle.style.height = '10px';
            resizeHandle.style.background = 'black';
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.top = '0';
            resizeHandle.style.left = '0';
            resizeHandle.style.cursor = 'nw-resize';
            this.args.chatBox.appendChild(resizeHandle);
        
            let animationFrameId;
    
            const onMouseMove = (event) => {
                if (!this.resizing) return;
            
                // Cancel the previous frame to avoid stacking
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            
                animationFrameId = requestAnimationFrame(() => {
                    const dx = startX - event.clientX;
                    const dy = startY - event.clientY;
            
                    const newWidth = startWidth + dx;
                    const newHeight = startHeight + dy;
            
                    // Define minimum and maximum dimensions
                    const minWidth = 300;
                    const minHeight = 300;
                    const maxWidth = 800;
                    const maxHeight = 800;
            
                    // Batch style changes to reduce reflows
                    const styles = {};
            
                    if (newWidth >= minWidth && newWidth <= maxWidth) {
                        styles.width = `${newWidth}px`;
                    }
                    if (newHeight >= minHeight && newHeight <= maxHeight) {
                        styles.height = `${newHeight}px`;
                    }
            
                    // Apply the styles in one go
                    Object.assign(this.args.chatBox.style, styles);
                });
            };        
        
            const onMouseUp = () => {
                this.resizing = false;
                enableTextSelection();  // Re-enable text selection
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
        
            resizeHandle.addEventListener('mousedown', (event) => {
                this.resizing = true;
        
                disableTextSelection();  // Disable text selection
        
                startX = event.clientX;
                startY = event.clientY;
                startWidth = this.args.chatBox.offsetWidth;
                startHeight = this.args.chatBox.offsetHeight;
        
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }    
    }
    
    const chatbox = new Chatbox();
    chatbox.display();
    chatbox.setupResize();

})('a0bcef8ca4f87f74e00dca822c18507b', 'Ren', 'https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png', 'Ask me about our Services and Products');