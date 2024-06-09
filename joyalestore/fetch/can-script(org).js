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
      console.log(categories);
      const main = document.querySelector('main'); // Conteneur principal pour l'affichage
      console.log(main);
      const title = document.querySelector('.title');
      console.log(title);
      const search = document.querySelector ('.topnav');
      console.log(search);

      let lastCategory = 'All'; // Dernière catégorie sélectionnée
      console.log(lastCategory)
      let lastSearch = ''; // Dernier terme de recherche
      console.log(lastSearch)

      let categoryGroup;
      let finalGroup;

      finalGroup = products;
      updateDisplay();

      categoryGroup = [];
      console.log(categoryGroup)
      console.log(finalGroup)
      finalGroup = [];

      // Écouteur d'événements pour la sélection de catégories
      categories.forEach(category => {
        category.addEventListener('click', function(e) {
          e.preventDefault(); // Empêche le comportement par défaut du lien
          selectCategory(this.textContent.trim());
        });
      });
      //----------------------------------------------------------

      //----------------------------------------------------------

      // Fonction appelée lorsque la catégorie change
      function selectCategory(categoryName) {
        console.log(`Category selected: ${categoryName}`);
        if (categoryName === lastCategory) {
          return; // Sortie précoce si rien n'a changé
        } else {
          lastCategory = categoryName;
          lastSearch = '';
          filterProducts(categoryName);
        }
      }

      // Fonction pour filtrer les produits selon la catégorie sélectionnée
      function filterProducts(categoryName) {
        console.log(`Filtering products for category: ${categoryName}`);
        if (categoryName === 'All') {
          categoryGroup = products; // Tous les produits
        } else {
          categoryGroup = products.filter(product => product.type === categoryName); // Filtrer par type
        }
        console.log(`Filtered products: `, categoryGroup);
        // selectProducts();
        finalGroup = categoryGroup;
        updateDisplay();
      }
      // Fonction pour mettre à jour l'affichage des produits
      function updateDisplay() {
        // Suppression des éléments précédents dans le conteneur principal
        while (main.firstChild) {
          main.removeChild(main.firstChild);
        }
        title.innerHTML = "Nombre de produits : "+ finalGroup.length;
        // Affichage d'un message indiquant qu'aucun résultat n'est disponible
        if (finalGroup.length === 0) {
          const para = document.createElement('p');
          
          para.textContent = 'No results to display!';
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

        section.setAttribute('class', product.type); // Définition de la classe CSS pour le produit

        heading.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase()); // Correction de la casse du nom
        para.textContent = `$${product.price.toFixed(2)}`; // Formatage du prix

        image.src = objectURL; // Affectation de l'URL de l'image
        image.alt = product.name; // Aide à la lisibilité pour les moteurs de recherche

        main.appendChild(section); // Ajout de la section au conteneur principal
        section.appendChild(image); // Ajout de l'image à la section
        section.appendChild(heading); // Ajout de l'en-tête à la section
        section.appendChild(para); // Ajout du paragraphe à la section
      }
    }