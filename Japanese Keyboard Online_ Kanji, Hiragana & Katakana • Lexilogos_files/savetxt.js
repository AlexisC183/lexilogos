// copyright lexilogos.com


function savetext() {
    const texte = document.querySelector('#bar').value;
    const lang = document.documentElement.lang || 'en'; 
    const nomFichier = (lang === 'fr') ? 'lexilogos_clavier.txt' : 'lexilogos_keyboard.txt';
    
    const blob = new Blob(["\ufeff", texte], { type: 'text/plain;charset=utf-8' });
    const lien = document.createElement('a');
    lien.href = URL.createObjectURL(blob);
    lien.download = nomFichier;
    
    // Compatibilité navigateurs
    document.body.appendChild(lien); // Nécessaire pour certains navigateurs anciens/mobiles
    lien.click();
    
    // Nettoyage immédiat
    document.body.removeChild(lien);
    URL.revokeObjectURL(lien.href);
}


function openFile(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
	
	reader.onload = function(e) {
    const content = e.target.result;
    const area = document.querySelector('#bar');
    
    // Si le textarea n'est pas vide, on ajoute un saut de ligne avant le nouveau texte
    if (area.value.length > 0) {
        area.value += "\n";
    }
    
    area.value += content;
    input.value = ''; // Reset pour pouvoir recharger le même fichier
};

    // Lecture en UTF-8 
    reader.readAsText(file, 'UTF-8');
}

	

function processFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const area = document.getElementById('bar');
        
        if (!area) return;

        // 1. Logique d'ajout de texte
        if (area.value.length > 0) {
            area.value += "\n";
        }
        area.value += content;
        
        // 2. Déclenchement de la conversion (si elle existe)
        // On vérifie si un attribut oninput est défini sur la balise
        if (area.getAttribute('oninput')) {
            // Cela exécute le code contenu dans oninput (conversion)
            new Function(area.getAttribute('oninput')).call(area);
        } 
        // Sinon, on lance l'événement standard au cas où un script externe écoute
        else {
            area.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };
    reader.readAsText(file, 'UTF-8');
}

// Gestion des événements de glisser-déposer sur la page
document.addEventListener('dragover', function(e) {
    if (e.target.id === 'bar') {
        e.preventDefault();
        e.target.style.backgroundColor = "#f0f8ff";
    }
}, false);

document.addEventListener('dragleave', function(e) {
    if (e.target.id === 'bar') {
        e.target.style.backgroundColor = "";
    }
}, false);

document.addEventListener('drop', function(e) {
    if (e.target.id === 'bar') {
        e.preventDefault();
        e.target.style.backgroundColor = "";
        processFile(e.dataTransfer.files[0]);
    }
}, false);