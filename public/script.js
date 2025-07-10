document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        addMessage(userMessage, 'user');
        chatInput.value = '';
        sendButton.disabled = true; // Disable button while waiting for response

        // --- THIS IS WHERE WE'LL CALL OUR FIREBASE CLOUD FUNCTION ---
        // For now, a placeholder bot response:
        addMessage('Thinking...', 'bot');

        try {
            // Replace with your actual Cloud Function URL later
            // const response = await fetch('YOUR_CLOUD_FUNCTION_URL', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ message: userMessage }),
            // });
            // const data = await response.json();
            // chatMessages.lastChild.remove(); // Remove "Thinking..." message
            // addMessage(data.response, 'bot');

            // Placeholder for now:
            setTimeout(() => {
                chatMessages.lastChild.remove(); // Remove "Thinking..." message
                addMessage(`I received "${userMessage}". I'm not smart yet!`, 'bot');
                sendButton.disabled = false;
            }, 1000); // Simulate delay
        } catch (error) {
            console.error('Error sending message:', error);
            chatMessages.lastChild.remove(); // Remove "Thinking..." message
            addMessage('Oops! Something went wrong. Please try again.', 'bot');
            sendButton.disabled = false;
        }
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});