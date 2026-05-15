// copyright lexilogos.com

const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const lang = document.documentElement.lang || 'en'; 
const labelClair = (lang === 'fr') ? 'mode clair' : 'Light mode';
const labelSombre = (lang === 'fr') ? 'mode sombre' : 'Dark mode';

// Fonction pour mettre à jour le texte du bouton
function updateButtonLabel(isDark) {
  toggleButton.value = isDark ? labelClair : labelSombre;
}

// Vérifie si un mode est déjà enregistré dans le localStorage
let currentTheme = localStorage.getItem('theme');

if (!currentTheme) {
  // Détection du mode système si aucun mode enregistré
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  currentTheme = prefersDark ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
}

if (currentTheme === 'dark') {
  body.classList.add('dark-theme');
}
updateButtonLabel(currentTheme === 'dark');

toggleButton.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateButtonLabel(isDark);
});

let clesOptions = null;

const selectRadicalTextField = document.getElementById('select-radical-text-field');
const cles = document.getElementById('cles');

selectRadicalTextField.addEventListener('input', e => {
  if (clesOptions === null) {
    clesOptions = Array.of(...cles.children);
  }

  const search = e.target.value.toLowerCase();

  cles.replaceChildren(
    clesOptions[0],
    ...clesOptions.filter(opt => opt.textContent.includes(search))
  );
});

document.getElementById('bar').focus();
