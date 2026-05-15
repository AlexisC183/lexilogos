/* ------------------------
   Chargement du JSON
   ------------------------ */
window.data = []; 

function normaliserRecherche(texte, respectCasse = false) {
  let resultat = respectCasse ? texte : texte.toLowerCase();

  const remplacements = [
    { regex: /ee/g, repl: 'ei' },
    { regex: /[ēê]/gi, repl: 'ee' },
    { regex: /[āâ]/gi, repl: 'aa' },
    { regex: /[īî]/gi, repl: 'ii' },
    { regex: /[ōô]/gi, repl: 'oo' },
    { regex: /[ūû]/gi, repl: 'uu' },
    { regex: /ou/gi, repl: 'oo' }
  ];

  remplacements.forEach(({ regex, repl }) => {
    resultat = resultat.replace(regex, repl);
  });

  return resultat;
}

fetch('/lexilogos/japonais.json')
  .then(r => r.json())
  .then(json => {
    window.data = Array.isArray(json) ? json : [];
    console.log('data loaded:', window.data.length, 'entrées');
  })
  .catch(err => {
    console.error('Erreur loading', err);
    window.data = [];
  });

function toEntity(hexOrEntity) {
  if (!hexOrEntity) return '';
  const s = String(hexOrEntity).trim();
  if (s.includes('&') && s.includes(';')) return s;
  const hex = s.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
  if (!hex) return '';
  return '\u0026\u0023x' + hex + '\u003B';
}

function afficherResultats(results) {
  const cont = document.getElementById('resultats');
  cont.innerHTML = '';

  if (!results || !results.length) {
    cont.innerHTML = "<div class='center span-red'>No Kanji found for this request.</div>";
    return;
  }

  cont.innerHTML = results.map(entry => {
    const ent = toEntity(entry.unicode);
    const latin = (Array.isArray(entry.latin) && entry.latin.length > 0) 
      ? entry.latin.map(l => String(l).trim()).join(', ') 
      : '-';
    const traits = entry.traits ?? '';
    const cles = entry.cles ?? '';

    return `
      <div class='case'>
        <span class='tra'>${traits}</span><br />
        <span class='cle'>${cles}</span><br />
        <span class='prob'>${latin}</span><br />
        <input type="button" class="chi" onclick="alfa(this.value)" value="${ent}">
      </div>
    `;
  }).join('');
}

function searchP(q = '', exact = false, respectCasse = false) {
  const traits = document.getElementById('traits')?.value || '';
  const cles   = document.getElementById('cles')?.value || '';

  if (!window.data || !Array.isArray(window.data)) {
    console.warn('Data not loaded yet');
    return;
  }

  const qCheck = respectCasse ? q : q.toLowerCase();

  const results = window.data.filter(entry => {
    if (qCheck) {
      if (!entry.latin || !Array.isArray(entry.latin)) return false;
      if (exact) {
        return entry.latin.some(l => {
          const val = respectCasse ? String(l) : String(l).toLowerCase();
          return val === qCheck;
        });
      } else {
        return entry.latin.some(l => {
          const val = respectCasse ? String(l) : String(l).toLowerCase();
          return val.startsWith(qCheck);
        });
      }
    }

    if (cles)   return String(entry.cles) === String(cles);
    if (traits) return String(entry.traits) === String(traits);
    return false;
  });

  afficherResultats(results);
}

let searchTimeout;

function updateIndicator(exactMode, respectCasse) {
  const indic = document.getElementById('mode-indic');
  let parts = [];
  if (exactMode) parts.push('<span>Search limited to these characters</span>');
  if (respectCasse) parts.push('<span>Case-sensitive search</span>');
  indic.innerHTML = parts.join('');
}

function verify() {
  const raw = document.getElementById('recherche').value || '';

  if (raw.trim() === '') {
    clearTimeout(searchTimeout);
    document.getElementById('resultats').innerHTML = '';
    updateIndicator(false, false);
    return;
  }

  let exactMode = raw.includes('!');
  let respectCasse = raw.includes('=');

  updateIndicator(exactMode, respectCasse);

  let val = raw.replace(/[!=]/g, '').trim();

  if (exactMode && val === '') return;

  const normalisedVal = normaliserRecherche(val, respectCasse);

  clearTimeout(searchTimeout);
  if (exactMode) {
    searchP(normalisedVal, true, respectCasse);
  } else {
    searchTimeout = setTimeout(() => searchP(normalisedVal, false, respectCasse), 200);
  }
}

function searchFromSelect(changedId) {
  searchP('', false);
  if (changedId) {
    const s = document.getElementById(changedId);
    if (s) s.selectedIndex = 0;
  }
  document.getElementById('recherche').focus();
}


