const SETTINGS_KEY = 'lenior_settings';

function loadSettings() {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return { username: '', theme: 'light', sound: true };
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applyTheme(theme) {
  document.body.className = theme === 'dark' ? 'dark-theme' : '';
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const settings = loadSettings();

  const usernameInput = document.getElementById('username');
  if (usernameInput) usernameInput.value = settings.username || '';

  applyTheme(settings.theme || 'light');
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const theme = this.dataset.theme;
      settings.theme = theme;
      applyTheme(theme);
      saveSettings(settings);
    });
  });

  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.checked = settings.sound !== false;
    soundToggle.addEventListener('change', function() {
      settings.sound = this.checked;
      saveSettings(settings);
      const label = this.closest('.toggle-container').querySelector('.toggle-label');
      if (label) label.textContent = this.checked ? 'Ativado' : 'Desativado';
    });
    const label = soundToggle.closest('.toggle-container').querySelector('.toggle-label');
    if (label) label.textContent = soundToggle.checked ? 'Ativado' : 'Desativado';
  }

  const saveBtn = document.getElementById('saveSettingsBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      settings.username = usernameInput.value.trim();
      saveSettings(settings);
      alert('Configurações salvas!');
    });
  }

  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', function() {
      if (confirm('Isso apagará todo o histórico de conversas. Continuar?')) {
        localStorage.removeItem('lenior_chat_history');
        alert('Histórico limpo com sucesso!');
        window.location.href = 'chat.html';
      }
    });
  }
});
