?const root = document.documentElement;
  const panel = document.getElementById('accessibility-panel');
  const panelToggle = document.getElementById('accessibility-toggle');
  const languageToggle = document.getElementById('language-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const fontScaleKey = 'hjd-font-scale';
  let language = localStorage.getItem('hjd-language') || 'es';
  let fontScale = Number(localStorage.getItem(fontScaleKey)) || 100;

  function applyLanguage(){
    const content = translations[language];
    document.documentElement.lang = language;
    document.getElementById('page-title').textContent = content.pageTitle;
    document.querySelectorAll('[data-i18n]').forEach(function(element){ element.textContent = content[element.dataset.i18n]; });
    document.querySelectorAll('[data-i18n-html]').forEach(function(element){ element.innerHTML = content[element.dataset.i18nHtml]; });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function(element){ element.setAttribute('aria-label', content[element.dataset.i18nAriaLabel]); });
    languageToggle.textContent = content.languageButton;
    themeToggle.textContent = (root.dataset.theme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')) === 'dark' ? content.themeButton : (language === 'es' ? 'Oscuro' : 'Light');
    panelToggle.setAttribute('aria-label', content[panelToggle.getAttribute('aria-expanded') === 'true' ? 'accessibilityCloseLabel' : 'accessibilityToggleLabel']);
    document.title = content.pageTitle;
  }

  function applyTheme(theme){
    root.dataset.theme = theme;
    localStorage.setItem('hjd-theme', theme);
    applyLanguage();
  }

  function setFontScale(nextScale){
    fontScale = Math.min(150, Math.max(80, nextScale));
    root.style.setProperty('--base-size', fontScale + '%');
    localStorage.setItem(fontScaleKey, fontScale);
  }

  panelToggle.addEventListener('click', function(){
    const isOpen = panelToggle.getAttribute('aria-expanded') === 'true';
    panelToggle.setAttribute('aria-expanded', String(!isOpen));
    panelToggle.setAttribute('aria-label', translations[language][isOpen ? 'accessibilityToggleLabel' : 'accessibilityCloseLabel']);
    panel.hidden = isOpen;
    panel.classList.toggle('is-open', !isOpen);
    if (!isOpen) languageToggle.focus();
  });
  languageToggle.addEventListener('click', function(){ language = language === 'es' ? 'en' : 'es'; localStorage.setItem('hjd-language', language); applyLanguage(); });
  themeToggle.addEventListener('click', function(){ applyTheme((root.dataset.theme || 'dark') === 'dark' ? 'light' : 'dark'); });
  document.getElementById('font-decrease').addEventListener('click', function(){ setFontScale(fontScale - 10); });
  document.getElementById('font-increase').addEventListener('click', function(){ setFontScale(fontScale + 10); });
  document.addEventListener('keydown', function(event){
    if (event.key === 'Escape' && !panel.hidden){ panel.hidden = true; panel.classList.remove('is-open'); panelToggle.setAttribute('aria-expanded', 'false'); panelToggle.setAttribute('aria-label', translations[language].accessibilityToggleLabel); panelToggle.focus(); }
  });

  setFontScale(fontScale);
  applyLanguage();

