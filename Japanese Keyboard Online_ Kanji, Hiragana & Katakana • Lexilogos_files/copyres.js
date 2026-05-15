// copyright lexilogos.com


//EXPAND
let isExpanded = false;

function toggleExpand() {
    const input = document.getElementById("bar");
    const btn = document.getElementById("btnExpand");
    if (!input || !btn) return;

    // Détection de la langue
    const isEn = document.documentElement.lang === 'en';
    
    isExpanded = !isExpanded; 
    
    if (isExpanded) {
        // Mode replier / collapse
        btn.value = isEn ? "Default height" : "replier"; 
        autoResize(); 
    } else {
        // Mode déployer / expand
        btn.value = isEn ? "Fit to text" : "déployer";
        // Nettoyage complet pour revenir au CSS/HTML pur
        input.style.removeProperty('height'); 
    }
    
    // On garde le focus standard
    input.focus();
}


function autoResize() {
    const input = document.getElementById("bar");
    if (input && isExpanded) {
        input.style.height = 'auto';
        // Le +2 évite les micro-scrollbars sur Firefox
        input.style.height = (input.scrollHeight + 2) + 'px';
    }
}

// Utilisation d'une fonction nommée pour pouvoir la retirer si besoin
function handleInput() {
    autoResize();
}

window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("bar");
    if (input) {
        input.addEventListener('input', handleInput);
    }
});


// COPY KB

 let copyMsgTimeout = null;

  async function copy() {
    const saisieField = document.getElementById('bar');
    const message = document.getElementById('copymes');
    if (!saisieField || !message) return;

    const text = saisieField.value;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback
        saisieField.select();
        saisieField.setSelectionRange(0, 99999);
        document.execCommand('copy');
        // Optionnel: restaurer la sélection
        saisieField.setSelectionRange(text.length, text.length);
        saisieField.blur();
      }

      // Message “copié”
      message.classList.add('visible');
      if (copyMsgTimeout) clearTimeout(copyMsgTimeout);
      copyMsgTimeout = setTimeout(() => {
        message.classList.remove('visible');
      }, 2000);

    } catch(e) {
      console.error('Copy failed:', e);
    }
  }
	
	
// COPY CNV	
	
 function copy1() {
      const saisieField = document.getElementById('bar1');
      saisieField.select();
      saisieField.setSelectionRange(0, 99999); // compatibilité mobile
      document.execCommand("copy");

      const message = document.getElementById("copymes");
      message.classList.add("visible");

      // Retirer le message après 2 secondes
      clearTimeout(message.dataset.timeoutId); // efface l'ancien timer si besoin
      const timeoutId = setTimeout(() => {
        message.classList.remove("visible");
      }, 2000);

      message.dataset.timeoutId = timeoutId;
    }


 function copy2() {
      const saisieField = document.getElementById('bar2');
      saisieField.select();
      saisieField.setSelectionRange(0, 99999); // compatibilité mobile
      document.execCommand("copy");

      const message = document.getElementById("copymes");
      message.classList.add("visible");

      // Retirer le message après 2 secondes
      clearTimeout(message.dataset.timeoutId); // efface l'ancien timer si besoin
      const timeoutId = setTimeout(() => {
        message.classList.remove("visible");
      }, 2000);

      message.dataset.timeoutId = timeoutId;
    }
	
	
	//RESET
	
var lastText = ""; 
var resetTimer = null; 

function reset_all() {
    const bar = document.getElementById('bar');
	const recherche = document.getElementById('recherche');
    const btnEffa = document.getElementById("btn-effa"); // Le bouton qui déclenche le reset
    const btnExp = document.getElementById("btnExpand");
    
    if (!bar) return;

    // 1. Détection de la langue pour le bouton Undo/Annuler
    const isEn = document.documentElement.lang === 'en';
    const txtUndo = isEn ? "Undo" : "annuler";
    const txtRestore = isEn ? "Restore text" : "restaurer le texte";
    const txtClear = isEn ? "Clear" : "effacer";
    const txtExpand = isEn ? "Expand" : "déployer";

    // 2. LOGIQUE UNDO : Si on clique alors que le bouton affiche déjà "annuler"
    if (btnEffa && (btnEffa.innerHTML === "annuler" || btnEffa.innerHTML === "Undo")) {
        undoReset();
        return;
    }

    // 3. SAUVEGARDE avant effaçage
    if (bar.value.length > 0) {
        lastText = bar.value;
        
        if (btnEffa) {
            btnEffa.innerHTML = txtUndo;
            btnEffa.style.width = "3.75em";
            btnEffa.style.fontSize = "1em";
            btnEffa.title = txtRestore;

            // Timer de 6 secondes pour revenir à la croix (X)
            clearTimeout(resetTimer);
            resetTimer = setTimeout(function() {
                btnEffa.innerHTML = "&#x2718;";
                btnEffa.style.fontSize = "";
                btnEffa.style.width = "";
                btnEffa.title = txtClear;
                lastText = ""; 
            }, 6000);
        }
    }

    // 4. RÉINITIALISATION PHYSIQUE
    bar.value = '';
    bar.style.removeProperty('height'); 
    
    // Pour le bouton déployer
    isExpanded = false; 
    if (btnExp) {
        btnExp.innerHTML = txtExpand;
    }

    // Réinitialisation des modules spécifiques (Grec, Latin, Arabe, Chinois)
    try { if (typeof selectedLetter !== 'undefined') selectedLetter = null; } catch(e){}
    try { if (typeof selectedDiacritics !== 'undefined') selectedDiacritics = []; } catch(e){}
    try { if (typeof clickedTip !== 'undefined') clickedTip = null; } catch(e){}

    const keys = document.getElementById('diacKeys');
    if (keys) keys.innerHTML = '';

    // Nettoyage spécifique Chinois (si les IDs existent)
    const cles = document.getElementById('cles');
    if (cles) cles.selectedIndex = 0;
    const res = document.getElementById('resultats');
    if (res) res.innerHTML = '';
    const traits = document.getElementById('traitFilter');
    if (traits) traits.innerHTML = '';

    // Appels des fonctions de rafraîchissement si elles existent
    try { if (typeof renderKeyboard === 'function') renderKeyboard(); } catch(e){}
    try { if (typeof renderDiacriticButtons === 'function') renderDiacriticButtons(); } catch(e){}
    try { if (typeof setInfo === 'function') setInfo(''); } catch(e){}
    

if (recherche) {
    recherche.focus();
} else if (bar) {
    bar.focus();
}

}


function undoReset() {
    const input = document.getElementById("bar");
	const recherche = document.getElementById('recherche');
    const btnEffa = document.getElementById("btn-effa");
    const isEn = document.documentElement.lang === 'en';

    if (input && lastText) {
        input.value = lastText;
        lastText = "";
        
        if (btnEffa) {
            clearTimeout(resetTimer);
            btnEffa.innerHTML = "&#x2718;";
            btnEffa.style.fontSize = "";
            btnEffa.style.width = "";
            btnEffa.title = isEn ? "Clear" : "effacer";
        }

     //   if (typeof updateCount === "function") updateCount();

        
      //  input.focus(); 
	  // remplacer par
	  
	  if (recherche) {
    recherche.focus();
       } else if (bar) {
      bar.focus();
      }

    }
}


// RESET CNV

	function reset_cnv() {
  document.getElementById('bar1').value = '';
  document.getElementById('bar2').value = '';
}

	function reset_morse() {
  document.getElementById('bar1').value = '';
}