// WARNING: This is NOT a secure way to handle API keys in production.
// For this GDG prototype due to credit card restrictions, we are making an exception.
const GEMINI_API_KEY = "AIzaSyCcn1apO1SYfa8W1_d3sAF1qgsggqINcSk"; 

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCu5JyCL5LbTpvm5c2YDFOzBiNDIq_zUq4",
    authDomain: "pathfinder-1d5df.firebaseapp.com",
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // Signup modal handling
  const signupModal = document.getElementById("signupModal");
  const signupTrigger = document.getElementById("signupTrigger");
  const closeModal = document.getElementById("closeModal");
  const submitSignup = document.getElementById("submitSignup");
  
  signupTrigger.onclick = () => signupModal.style.display = "flex";
  closeModal.onclick = () => signupModal.style.display = "none";
  
  submitSignup.onclick = async () => {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
  
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      alert("Account created successfully!");
      signupModal.style.display = "none";
    } catch (error) {
      alert("Signup error: " + error.message);
    }
  };
  
  // Dark Mode Toggle
  const toggle = document.getElementById("darkToggle");
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", toggle.checked);
  });
  

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
        userInput.value = '';
        sendButton.disabled = true; // Disable button while sending
    
        addMessage('Thinking...', 'bot'); // Show thinking message
    
        try {
            const API_URL = "https://generativelanguage.googleapis.com/v1beta1/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;
    
            const systemPrompt = `You are a helpful and encouraging Career Roadmap Chatbot for college students. Your goal is to provide guidance on career paths, required skills, and interview tips. Keep responses concise and actionable.
    
            When asked about:
            - Career paths: Suggest relevant paths based on major/interests and briefly describe them.
            - Required skills: List essential skills for a given role and suggest general ways to acquire them (e.g., online courses, projects).
            - Interview tips: Provide actionable advice or common questions for a specific job title or general interviews.
    
            Always maintain a positive and supportive tone. If a question is outside these topics (e.g., unrelated personal advice, complex technical debugging), politely redirect to your core functions.`;
    
            // Combine system prompt and user message for the API call
            const payload = {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: systemPrompt + "\n\n" + userInput }]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 200, // Limit response length
                },
            };
    
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            // Remove the "Thinking..." message before displaying the actual response
            chatMessages.lastChild.remove(); 
    
            if (!response.ok) {
                // Try to get more detailed error from the API
                const errorData = await response.json();
                console.error('Gemini API Error:', errorData);
                throw new Error(`Gemini API error! Status: ${response.status}, Details: ${errorData.error.message || 'Unknown error'}`);
            }
    
            const data = await response.json();
            const geminiResponse = data.candidates[0].content.parts[0].text;
            addMessage(geminiResponse, 'bot'); // Display Gemini's response
    
        } catch (error) {
            console.error('Error calling Gemini API directly:', error);
            chatMessages.lastChild.remove(); // Remove "Thinking..." message
            addMessage('Oops! The chatbot encountered an error. Please try again. (Check console for details)', 'bot');
            // IMPORTANT: If you encounter CORS errors here, you might need to try restricting your API key by HTTP referrer in Google Cloud Console if allowed for Gemini.
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