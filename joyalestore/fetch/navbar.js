    // Définition de la classe MobileNavbar qui gère un menu mobile
    class MobileNavbar {
        // Constructeur de la classe qui initialise les éléments nécessaires
        constructor(mobileMenu, navList, navLinks) {
            // Sélectionne l'élément du menu mobile dans le DOM
            this.mobileMenu = document.querySelector(mobileMenu);
            // Sélectionne l'élément de la liste de navigation dans le DOM
            this.navList = document.querySelector(navList);
            // Sélectionne tous les liens de navigation dans le DOM
            this.navLinks = document.querySelectorAll(navLinks);
            // Définit la classe "active" comme état actif
            this.activeClass = "active";
            // Ajoute une méthode de gestion des clics sur le menu mobile
            this.handleClick = this.handleClick.bind(this);
        }
    
        // Méthode pour animer les liens de navigation lorsqu'ils sont cliqués
        animateLinks() {
            // Parcourt chaque lien de navigation et applique une animation si nécessaire
            this.navLinks.forEach((link, index) => {
                link.style.animation
                  ? (link.style.animation = "") // Si déjà animé, réinitialise l'animation
                    : (link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`); // Sinon, ajoute une nouvelle animation
            });
        }
    
        // Méthode pour gérer le clic sur le menu mobile
        handleClick() {
            // Alterne la présence de la classe "active" sur le menu mobile et la liste de navigation
            this.navList.classList.toggle(this.activeClass);
            this.mobileMenu.classList.toggle(this.activeClass);
            // Anime les liens de navigation après le clic
            this.animateLinks();
        }
    
        // Ajoute un écouteur d'événements au menu mobile pour gérer les clics
        addClickEvent() {
            this.mobileMenu.addEventListener("click", this.handleClick);
        }
    
        // Initialise le menu mobile en ajoutant l'écouteur d'événements
        init() {
            if (this.mobileMenu) { // Vérifie si le menu mobile existe avant d'ajouter l'écouteur d'événements
                this.addClickEvent(); // Ajoute l'écouteur d'événements
            }
            return this; // Retourne l'instance pour permettre la chaînage des méthodes
        }
    }
    
    // Crée une instance de MobileNavbar avec les sélecteurs appropriés
    const mobileNavbar = new MobileNavbar(".mobile-menu", ".nav-list", ".nav-list li");
    // Initialise le menu mobile
    mobileNavbar.init();
    