function loadChatbot() {
  // Add Bootstrap CSS
  const style = document.createElement('style');
  style.textContent = `
    /* Bootstrap-like Chatbot Styles */
    .chatbot-icon {
      position: fixed;
      bottom: 20px;
      right: 20px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 1000;
    }

    .chatbot-icon img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .chatbox {
      display: none;
      position: fixed;
      bottom: 80px;
      right: 20px;
      background-color: #f8f9fa;
      color: #333;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      width: 350px;
      height: 500px;
      overflow-y: auto;
      z-index: 999;
      padding: 20px;
      max-width: 100%;
      border: 1px solid #ccc;
    }

    .chatbox-content {
      max-height: 350px;
      overflow-y: auto;
      margin-bottom: 10px;
    }

    .suggestions {
      display: block;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .suggestions div {
      padding: 8px;
      background-color: #007bff;
      color: #fff;
      margin-bottom: 5px;
      cursor: pointer;
      border-radius: 5px;
    }

    .suggestions div:hover {
      background-color: #0056b3;
    }

    .message-input-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }

    #user-input {
      width: 70%;
      padding: 8px;
      background-color: #f1f1f1;
      color: #333;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-right: 5px;
    }

    #send-message {
      padding: 8px 10px;
      border: none;
      background: #007bff;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }

    #send-message:hover {
      background-color: #0056b3;
    }

    /* Mobile Responsiveness */
    @media (max-width: 500px) {
      .chatbox {
        width: 90%;
        height: 400px;
      }

      .message-input-area {
        flex-direction: column;
        align-items: stretch;
      }

      #user-input {
        width: 100%;
        margin-bottom: 5px;
      }

      #send-message {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);

  // Chatbot HTML content
  const chatbotHTML = `
    <div id="chatbox" class="chatbox">
      <div id="chatbox-content" class="chatbox-content">
        <div class="bot-message">Hello! How can I assist you today?</div>
        <div id="suggestions" class="bot-message suggestions">
          <div onclick="sendMessageWithSuggestion('How to borrow a book?')">How to borrow a book?</div>
          <div onclick="sendMessageWithSuggestion('Library timings')">Library timings</div>
          <div onclick="sendMessageWithSuggestion('Where can I find journals?')">Where can I find journals?</div>
        </div>
      </div>
      <div class="message-input-area">
        <input type="text" id="user-input" class="form-control" placeholder="Type your message here..." />
        <button id="send-message" class="btn btn-primary">Send</button>
      </div>
    </div>
    <div class="chatbot-icon" onclick="toggleChat()">
      <img src="https://assets.onecompiler.app/436645ybn/4384pp5p8/icons8-technical-support-100.png" alt="Chatbot">
    </div>
  `;
  const div = document.createElement('div');
  div.innerHTML = chatbotHTML;
  document.body.appendChild(div);

  // JS functionality
  function toggleChat() {
    const chatbox = document.getElementById('chatbox');
    chatbox.style.display = chatbox.style.display === 'none' || chatbox.style.display === '' ? 'block' : 'none';
  }

  window.toggleChat = toggleChat;

  window.sendMessageWithSuggestion = function (text) {
    document.getElementById('user-input').value = text;
    sendMessage();
  }

  async function fetchAIResponse(userInput) {
    const API_KEY = "AIzaSyC_3yjzd9wBVexkQiHyvFun_ELaAaXhKH0";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const payload = { contents: [{ parts: [{ text: userInput }] }] };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Error fetching response";
    }
  }

  async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    const chatBox = document.getElementById('chatbox-content');

    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);
    document.getElementById('user-input').value = '';

    const botMessageContainer = document.createElement('div');
    botMessageContainer.className = 'bot-message-container';
    const botMessage = document.createElement('div');
    botMessage.className = 'bot-message';
    botMessage.textContent = 'Thinking...';
    botMessageContainer.appendChild(botMessage);
    chatBox.appendChild(botMessageContainer);
    chatBox.scrollTop = chatBox.scrollHeight;

    const response = await fetchAIResponse(userInput);
    botMessage.innerHTML = response;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  document.getElementById('send-message').addEventListener('click', sendMessage);
  document.getElementById('user-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });
}

// Call the chatbot loader
loadChatbot();
