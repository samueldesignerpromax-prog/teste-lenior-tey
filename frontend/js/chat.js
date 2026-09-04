// URL do backend no Render - ATUALIZADO
const API_BASE_URL = 'https://lenior-ss.onrender.com/api';

const messagesContainer = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const clearButton = document.getElementById('clearChat');
const loadingIndicator = document.getElementById('loadingIndicator');

const STORAGE_KEY = 'lenior_chat_history';
let chatHistory = loadHistory();

function getInitialMessage() {
  return {
    role: 'bot',
    text: 'Olá! Sou o LENIOR, seu assistente virtual da Samuel Tech IA. Como posso ajudar você hoje?',
    time: new Date().toLocaleTimeString('pt-BR')
  };
}

function loadHistory() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  return [getInitialMessage()];
}

function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
}

function renderMessages() {
  messagesContainer.innerHTML = '';
  chatHistory.forEach(msg => {
    const div = document.createElement('div');
    div.classList.add('message', msg.role === 'user' ? 'user' : 'bot');
    div.innerHTML = `<span>${msg.text}</span><span class="time">${msg.time || ''}</span>`;
    messagesContainer.appendChild(div);
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addMessage(role, text, time) {
  const msg = {
    role,
    text,
    time: time || new Date().toLocaleTimeString('pt-BR')
  };
  chatHistory.push(msg);
  saveHistory();
  renderMessages();
}

async function sendMessageToBackend(userMessage) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: chatHistory.map(m => ({ role: m.role, content: m.text }))
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Erro na comunicação com o servidor.');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Erro:', error);
    return 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente mais tarde.';
  }
}

async function handleSend() {
  const text = messageInput.value.trim();
  if (!text) return;

  addMessage('user', text);
  messageInput.value = '';
  messageInput.focus();

  loadingIndicator.style.display = 'flex';
  const botResponse = await sendMessageToBackend(text);
  loadingIndicator.style.display = 'none';

  addMessage('bot', botResponse);
}

function clearHistory() {
  if (confirm('Tem certeza que deseja limpar todo o histórico da conversa?')) {
    chatHistory = [getInitialMessage()];
    saveHistory();
    renderMessages();
  }
}

sendButton.addEventListener('click', handleSend);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSend();
  }
});
clearButton.addEventListener('click', clearHistory);

renderMessages();
