// copyright lexilogos.com

function alfa(item) {
    const input = document.getElementById('bar');
    const recherche = document.getElementById('recherche');
    if (!input) return;

    // 1. Insertion du caractère
    if (typeof input.selectionStart === 'number') {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.value = input.value.substring(0, start) + item + input.value.substring(end);
        input.selectionStart = input.selectionEnd = start + item.length;
    } 
    else if (document.selection) {
        const range = document.selection.createRange();
        range.text = item;
        range.select();
    } 
    else {
        input.value += item;
    }

    // 2. Gestion de l'expansion
    if (isExpanded) {
        autoResize();
        // On ne scrolle le textarea QUE si c'est lui qui a le focus final.
        // Mais ici, comme tu redonnes le focus à 'recherche', 
        // le scrollHeight du textarea risque de masquer la barre de recherche.
    }

    // 3. Nettoyage et Focus
    if (recherche) {
        recherche.value = '';
        recherche.focus();
        
        // ASTUCE : Si on est en mode expand et que le textarea est très grand,
        // on s'assure que la barre de recherche reste visible à l'écran.
        recherche.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
}