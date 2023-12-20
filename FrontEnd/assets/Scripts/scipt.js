document.addEventListener("DOMContentLoaded", function() {

    /*Verification du token*/
    const storedToken = sessionStorage.getItem("user");
    console.log("Token dans localStorage sur index.html:", storedToken);
    //

    const sectionBouttons = document.getElementById("bouttons-container");
    const gallery = document.querySelector(".gallery");

    const tousButton = document.createElement("button");
    tousButton.innerHTML = "Tous";
    tousButton.addEventListener("click", function() {
        removeAllButtonBackgrounds();
        this.classList.add("active");
        fetchDataFromApi();
    });
    sectionBouttons.appendChild(tousButton);

    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                const categoryButton = document.createElement("button");
                categoryButton.innerHTML = category.name;

                categoryButton.addEventListener("click", function() {
                    removeAllButtonBackgrounds();
                    this.classList.add("active");
                    if (category.id === 4) {
                        fetchDataFromApi();
                    } else {
                        fetchDataFromApi(category.id);
                    }
                });

                sectionBouttons.appendChild(categoryButton);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la requête pour les catégories :', error.message);
        });

    function removeAllButtonBackgrounds() {
        const buttons = sectionBouttons.getElementsByTagName("button");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active");
        }
    }

    function fetchDataFromApi(categoryId) {
        const apiUrl = `http://localhost:5678/api/works`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (categoryId !== undefined) {
                    const filteredData = data.filter(item => item.categoryId === categoryId);
                    updateImages(filteredData);
                } else {
                    updateImages(data);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la requête pour les œuvres :', error.message);
            });
    }


    function updateImages(images) {
        gallery.innerHTML = "";
    
        images.forEach(image => {
            
            const imgElement = document.createElement("img");
            imgElement.src = image.imageUrl;
            imgElement.alt = image.title;
    
            
            const captionElement = document.createElement("p");
            captionElement.textContent = image.title;
    
            
            const imageContainer = document.createElement("div");
            imageContainer.appendChild(imgElement);
            imageContainer.appendChild(captionElement);
    
            
            gallery.appendChild(imageContainer);
        });
    }

    const sectionImages = document.querySelector(".gallery");

    if (sectionImages) {
        fetch('http://localhost:5678/api/works', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(response => response.json())
        .then(projectsData => {

            projectsData.forEach(project => {
                const projectElement = document.createElement("div");
                projectElement.classList.add("project");

                const imageElement = document.createElement("img");
                imageElement.src = project.imageUrl;

                const titleElement = document.createElement("h3");
                titleElement.textContent = project.title;

                projectElement.dataset.imageId = project.id;

                projectElement.appendChild(imageElement);
                projectElement.appendChild(titleElement);

                sectionImages.appendChild(projectElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la requête API :', error.message);
        });
    } else {
        console.error("Error: Could not find the .gallery element");
    }

    /*Gestion de la connexion*/

    if (storedToken !== null) {
        document.querySelector('.bandereau').style.display = 'flex';
        document.querySelector('#bouttons-container').style.display='none';
        document.querySelector('.modalButton').style.display = 'flex';

    } else {
        document.querySelector('.bandereau').style.display = 'none';
        document.querySelector('#bouttons-container').style.display='flex';
        document.querySelector('.modalButton').style.display = 'none';
    }

    const logoutButton = document.getElementById("logoutButton");

    if (storedToken !== null) {

        logoutButton.textContent = "Logout";
        logoutButton.addEventListener("click", deletetoken);
    } else {

        logoutButton.textContent = "Login";
        logoutButton.addEventListener("click", redirectToLogin);
    }
});

function deletetoken() {
    sessionStorage.removeItem("user");
    window.location.href = "login.html";
}

function redirectToLogin() {
    window.location.href = "login.html";
}
    /*GESTION MODAL*/

    function closeModal() {
        document.querySelector('.overlay').style.display = 'none';
        document.querySelector('.modale__photo').classList.remove('modale__photo--open');
    }
    
    function modalUpload() {
        document.querySelector('.modale').classList.add('modal--open');
    }
    
    function backModal() {
        document.querySelector('.modale').classList.remove('modal--open');
        resetModal();
    }
    
    function close() {
        document.querySelector('.modale').classList.remove('modal--open');
    }
    
    function openModal() {
        document.querySelector('.overlay').style.display = 'block';
        document.querySelector('.modale__photo').classList.add('modale__photo--open');
        updateGalleryModalWithImages();
    }
    
    function closeModal2() {
        document.querySelector('.modale').classList.remove('modal--open');
        resetModal();
    }

    function resetModal() {
        console.log('Resetting modal...');
        let fileInput = document.getElementById('file-input');
        let titleInput = document.getElementById('image-title');
        let categorySelect = document.getElementById('choose');
        let imagePreview = document.getElementById('image-preview');
        let validerButton = document.getElementById('valider-button');
    
        fileInput.value = '';
        titleInput.value = '';
        categorySelect.value = 'default';
        imagePreview.src = 'assets/images/picture-svgrepo-com 1.png';
    

        document.getElementById('upload-button').style.display = 'block';
        document.getElementById('upload-text').style.display = 'block';
    
        imagePreview.src = 'assets/images/picture-svgrepo-com 1.png';
        imagePreview.style.height = '76px';
        imagePreview.style.width = '76px';
        imagePreview.style.marginLeft = '171px';
    
        imagePreview.classList.remove('dynamic-image');
        imagePreview.classList.add('logoPreview');
    
        validerButton.classList.remove('green-button');
    }

    /*VERFICATION DES CHAMPS AVANT UPLOAD*/

    document.addEventListener("DOMContentLoaded", function() {

        let fileInput = document.getElementById('file-input');
        let titleInput = document.getElementById('image-title');
        let categorySelect = document.getElementById('choose');
        let validerButton = document.getElementById('valider-button');
    
        fileInput.addEventListener("change", checkFields);
        titleInput.addEventListener("input", checkFields);
        categorySelect.addEventListener("change", checkFields);
    
        function checkFields() {
            let allFieldsFilled = fileInput.files.length > 0 && titleInput.value && categorySelect.value !== 'default';
            if (allFieldsFilled) {
                validerButton.classList.add('green-button');
            } else {
                validerButton.classList.remove('green-button');
            }
        }    
    });

/* PREVIEW DES IMAGES POUR UPLOAD */

function selectAndPreview() {
    let fileInput = document.getElementById('file-input');
    fileInput.click();

    fileInput.addEventListener("change", function() {
        let file = fileInput.files[0];

        if (file) {
            displayImagePreview(file);

            document.getElementById('upload-button').style.display = 'none';
            document.getElementById('upload-text').style.display = 'none';
        }
    });
}

function displayImagePreview(file) {
    let reader = new FileReader();

    reader.onload = function(e) {
        let imagePreview = document.getElementById('image-preview');
        imagePreview.src = e.target.result;

        imagePreview.style.height = ''; 

        imagePreview.classList.add("dynamic-image");

        let img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            if (img.height > img.width) {
                imagePreview.style.width = '30%';
                imagePreview.style.height = '100%';
                imagePreview.style.marginLeft = '144px';
            } else {
                imagePreview.style.width = '100%';
                imagePreview.style.height = '100%';
                imagePreview.style.marginLeft = '0px';
            }
        };
    };

    reader.readAsDataURL(file);
}



    /*UPLOAD DES IMAGES*/

    function getAccessToken() {
        return sessionStorage.getItem("user");
    }

    function uploadImage() {
        let fileInput = document.getElementById('file-input');
        let titleInput = document.getElementById('image-title');
        let categorySelect = document.getElementById('choose');
        let validerButton = document.getElementById('valider-button');
    
        if (!fileInput.files[0] || !titleInput.value || categorySelect.value === 'default') {
            console.error('Veuillez remplir tous les champs.');
            return;
        }
    
        let token = getAccessToken();
    
        let formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', categorySelect.value);
    
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Cache-Control': 'no-cache',
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur HTTP ' + response.status + ': ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const imageUrl = data.imageUrl;
            const title = data.title;
    
            updateInterfaceWithNewImage(imageUrl, title);
            resetModal();
            validerButton.classList.add('green-button');
            closeModal();
            closeModal2();
        })
        .catch(error => {
            console.error('Erreur lors de la requête vers l\'API :', error);
        });
    }
    
    function updateInterfaceWithNewImage(imageUrl, title) {
        let gallery = document.querySelector(".gallery");
    
        const imgElement = document.createElement("img");
        imgElement.src = imageUrl;
    
        const captionElement = document.createElement("p");
        captionElement.textContent = title;
    
        const imageContainer = document.createElement("div");
        imageContainer.appendChild(imgElement);
        imageContainer.appendChild(captionElement);
    
        gallery.appendChild(imageContainer);
    }

    /*Supression des images*/
    
    function deleteImageFromApi(imageId) {
        const token = getAccessToken();
    
        fetch(`http://localhost:5678/api/works/${parseInt(imageId)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Cache-Control': 'no-cache',
            },
        })
        .then(response => {
            if (response.status === 204) {
                updateGalleryModalWithImages();
                console.log(`Image (ID: ${imageId}) supprimée avec succès.`);
                return response.json();
            } else {
                if (response.status === 401) {
                    throw new Error('Non autorisé - Veuillez vous connecter.');
                } else {
                    throw new Error('Erreur HTTP ' + response.status + ': ' + response.statusText);
                }
            }
        })
        .then(data => {
            console.log('Réponse de l\'API lors de la suppression de l\'image :', data);
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'image depuis l\'API :', error.message);
        });
    }

        function updateGalleryModalWithImages() {
        let galleryImages = document.querySelectorAll('.gallery img');
        let galleryModal = document.querySelector('.gallery__modal');
    
        galleryModal.innerHTML = '';
    
        galleryImages.forEach((image, index) => {
            let imageId = image.parentNode.dataset.imageId;
    
            let imgContainer = document.createElement("div");
            imgContainer.classList.add("modal-image-container");
    
            let imgClone = image.cloneNode(true);
            imgContainer.appendChild(imgClone);
    
            let buttonElement = document.createElement("button");
            buttonElement.style.backgroundImage = 'url("assets/images/trash-can-solid.png")';
            buttonElement.style.border = "none";
            buttonElement.addEventListener("click", function() {
                deleteImageFromApi(imageId);
                galleryImages[index].parentNode.remove();
            });
            imgContainer.appendChild(buttonElement);
    
            galleryModal.appendChild(imgContainer);
        });
    }