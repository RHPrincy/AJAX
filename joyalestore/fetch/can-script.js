fetch('products.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then(json => initialize(json))
    .catch(err => console.error(`Fetch problem: ${err.message}`));

function initialize(products) {
    const categories = document.querySelectorAll('#dropdown-products1 > li > a'); // Sélection des catégories
    console.log("Les categories : ",categories);
    const main = document.querySelector('main'); // Conteneur principal pour l'affichage
    const title = document.querySelector('.title');
    document.querySelector('#singleproductdisplay').innerHTML='';
    
    let lastCategory = ''; // Dernière catégorie sélectionnée
    let categoryGroup;
    let finalGroup;
    finalGroup = products;
    console.log("Les produits : ",products);
    updateDisplay();

    categoryGroup = [];
    finalGroup = [];
    // Écouteur d'événements pour la sélection de catégories
    categories.forEach(category => {
        category.addEventListener('click', function (e) {
            e.preventDefault(); // Empêche le comportement par défaut du lien
            selectCategory(this.textContent.trim());
            console.log("selectCategory : ",this.textContent.trim());
        });
    });

    function selectCategory(categoryName) {
        console.log("categoryName : ",categoryName);
    if (categoryName === lastCategory) {
        return; 
    } else {
        lastCategory = categoryName;
        filterProducts(categoryName);
    }
}


    // Fonction pour filtrer les produits selon la catégorie sélectionnée
    function filterProducts(categoryName) {
        categoryGroup = products.filter(product => product.type === categoryName); // Filtrer par type
        console.log("categoryGroup : ",categoryGroup);
        finalGroup = categoryGroup;
        updateDisplay();
    }

    // Fonction pour mettre à jour l'affichage des produits
    function updateDisplay() {
        // Suppression des éléments précédents dans le conteneur principal
        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }
        title.innerHTML = `categorie : ${lastCategory} <span style="color:black; padding:0px 10px"> &amp;</span> Nombre de produits : ${finalGroup.length}`;
        // Affichage d'un message indiquant qu'aucun résultat n'est disponible
        if (finalGroup.length === 0) {
            const para = document.createElement('p');
            para.textContent = 'Stock épuisé pour ce produits!';
            main.appendChild(para);
        } else {
            // Pour chaque produit filtré, récupérer son image et l'afficher
            for (const product of finalGroup) {
                fetchBlob(product);
            }
        }
    }

    // Fonction pour récupérer l'image d'un produit et l'afficher
    function fetchBlob(product) {
        const url = `images/${product.image}`; // Construction de l'URL de l'image

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                return response.blob(); // Conversion de la réponse en Blob
            })
            .then(blob => showProduct(blob, product)) // Affichage du produit
            .catch(err => console.error(`Fetch problem: ${err.message}`)); // Gestion des erreurs
    }

    // Fonction pour afficher un produit avec son image, son nom et son prix
    function showProduct(blob, product) {
        const objectURL = URL.createObjectURL(blob); // Création d'une URL pour le Blob

        const section = document.createElement('section'); // Section pour le produit
        const heading = document.createElement('h2'); // En-tête pour le nom du produit
        const para = document.createElement('p'); // Paragraphe pour le prix
        const image = document.createElement('img'); // Image du produit

        // section.setAttribute('class', product.type); // Définition de la classe CSS pour le produit

        heading.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase()); // Correction de la casse du nom
        para.textContent = `$${product.price.toFixed(2)}`; // Formatage du prix

        image.src = objectURL; // Affectation de l'URL de l'image
        image.alt = product.name; // Aide à la lisibilité pour les moteurs de recherche

        main.appendChild(section); // Ajout de la section au conteneur principal
        section.appendChild(image); // Ajout de l'image à la section
        section.appendChild(heading); // Ajout de l'en-tête à la section
        section.appendChild(para); // Ajout du paragraphe à la section

        // Ajoutez un gestionnaire d'événements à chaque image affichée pour afficher les détails du produit
        image.addEventListener('click', function () {
            showProductDetails(product);
        });
    }

    // Fonction pour afficher les détails du produit sur une nouvelle page HTML
    function showProductDetails(product) {
        const productDetailPage = `
            <!-- ------------single product detail------------ -->
            <div class="single-product">
                <div class="row">
                    <div class="col2">
                        <img src="images/${product.image}" width="100%" id="ProductImg">
                    </div>
                    <div class="col2">
                        <h1>${product.name}</h1>
                        <p>Prix :</p> 
                        <h4>${product.price} €</h4>
                        <div class="choix">
                            <p>Taille</p>
                            <select name="" id="SM">
                                <option value="S/M">S/M</option>
                            </select>
                        </div>
                        <div class="quantite">
                            <p>Quantité </p>
                            <input type="number" min="1">
                        </div>
                        <button href="" class="btnAdd">Ajouter au panier </button>  
                        <p>Service client au 06 49 54 94 19 </p>
                        <p>Paiements sécurisés & 3x sans frais avec Alma</p>
                        <p>Livraison offerte avec Mondial Relay à partir de 100€</p>
                        <p>Click & Collect à La Grande Motte</p>
                    </div>
                </div>
                <div class="avis">
                    <h1>DETAILS DU PRODUIT / AVIS </h1>
                </div>
            </div>
        `;
        // Remove the content of the main element
        main.innerHTML = '';
        title.innerHTML=product.name;
        document.querySelector('#singleproductdisplay').innerHTML = productDetailPage;

        document.querySelector('.btnAdd').addEventListener('click', function() {
            const quantityInput = document.querySelector('.quantite input[type="number"]'); // Get the quantity input
            const productPriceElement = document.querySelector('.col2 h4'); // Get the product price element
            const commandePrix = document.querySelector('#commande > h2');
            const commandeNom = document.querySelector('#commande > h1');
            const commandeAvis = document.querySelector('#commande > p');
            // Check if quantity and price elements are found
            if (quantityInput && productPriceElement) {
                const quantity = parseFloat(quantityInput.value); // Get the quantity value
                const productPrice = parseFloat(productPriceElement.textContent.replace('€', '')); // Extract and parse price
        
            // Validate quantity (optional)
                if (isNaN(quantity) || quantity <= 0) {
                    alert('Please enter a valid quantity.');
                    return;
                }
        
            const totalPrice = quantity * productPrice; // Calculate total price
        
            // Update price display (replace with your preferred method)
            title.innerHTML="Votre commande";
            document.querySelector('#singleproductdisplay').innerHTML = '';
            commandePrix.textContent = `Prix Total: ${totalPrice.toFixed(2)}€`;  // Update existing price element
            commandeNom.textContent = quantity +' '+ product.name; // Update existing price element
            commandeAvis.innerHTML = "Merci Beaucoup pour votre achat" // Update existing price element
                
            // Incrémenter le compteur global de commandes
            const globalCounter = document.getElementById('globalCounter');
            let currentCount = parseInt(globalCounter.textContent, 10);
            globalCounter.textContent = String(currentCount + 1);
            // Additional actions (optional)
            // - Send product information and quantity to server for cart update
            // - Display confirmation message
        
            } 
            else {
                console.error('Erreur dans la récupération des éléments de quantité et de prix.');
            }
        
        });
    }
}

        