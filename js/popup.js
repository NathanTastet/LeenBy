// popup.js
// Paramétrage de la fenêtre popup
// Par Nathan TASTET - 2024


export function setupPopup() {

    const choixImage = document.getElementById('choixImage');

    for (let i = 1; i <= 8; i++) {
        const button = document.createElement('button');
        button.className = 'choixImageBtn';
        button.id = `img${i}`;
        button.innerHTML = `<img src="img/preset/img${i}.svg"></span>`;
        button.type = "submit"
        choixImage.appendChild(button);

        // Ajout de l'événement onclick
        button.addEventListener('click', function() {
            // Fermeture de la fenêtre popup
            document.getElementById('popup').style.display = 'none';
        });
    }
}