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
        const userInput = chatInput.value.trim();
        if (userInput === '') return;
    
        addMessage(userInput, 'user');
        chatInput.value = '';
        sendButton.disabled = true; // Disable button while sending
    
        addMessage('Thinking...', 'bot'); // Show thinking message
    
        try {
            // This is the URL of your deployed Firebase Cloud Function
            // REPLACE 'YOUR_CLOUD_FUNCTION_URL_HERE' with the URL you copied from Step 4
            const CLOUD_FUNCTION_URL = 'YOUR_CLOUD_FUNCTION_URL_HERE'; 
    
            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userInput }), // Ensure 'userInput' is passed as 'message'
            });
    
            // Remove the "Thinking..." message before displaying the actual response
            chatMessages.lastChild.remove(); 
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
    
            const data = await response.json();
            addMessage(data.response, 'bot'); // Display Gemini's response
    
        } catch (error) {
            console.error('Error calling Cloud Function:', error);
            chatMessages.lastChild.remove(); // Remove "Thinking..." message
            addMessage('Oops! The chatbot encountered an error. Please try again. (Check console for details)', 'bot');
        } finally {
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