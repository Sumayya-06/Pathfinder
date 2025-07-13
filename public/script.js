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
            const CLOUD_FUNCTION_URL = 'YOUR_CLOUD_FUNCTION_URL_HERE'; // <<< PASTE YOUR URL HERE

            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });
        
            // Remove the "Thinking..." message before displaying the actual response
            chatMessages.lastChild.remove(); 
        
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
        
            const data = await response.json();
            addMessage(data.response, 'bot');
        } catch (error) {
            console.error('Error calling Cloud Function:', error);
            chatMessages.lastChild.remove();
            addMessage('Oops! The chatbot encountered an error. Please try again.', 'bot');
        }finally {
            sendButton.disabled = false; // Re-enable button
        }
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});