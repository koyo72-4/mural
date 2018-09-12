fetch('/images')
.then(response => response.json())
.then(displayImagesInSquares);

function displayImagesInSquares(images) {
    buildGrid(images.length);

    images.forEach((image, index) => {
        let img = document.createElement('img');
        img.setAttribute('src', image.src);
        img.setAttribute('alt', 'user-selected image');
        let imageSquare = document.getElementById('square' + index);
        imageSquare.style.borderColor = image.borderColor;
        imageSquare.appendChild(img);
        eventListenersForSquares(image, imageSquare);
    });
}

function buildGrid(numberOfSquares) {
    for (let i = 0; i < numberOfSquares; i++) {
        let square = document.createElement('div');
        square.classList.add('square');
        square.id = 'square' + i;
        document.getElementById('squares-div').appendChild(square);
    }
}

function eventListenersForSquares(image, imageSquare) {
    imageSquare.addEventListener('mouseover', () => {
        imageSquare.style.backgroundColor = image.borderColor.replace(/(rgba\(\d+, \d+, \d+,) 1\)/, '$1 0.5)');
    });

    imageSquare.addEventListener('mouseleave', () => {
        imageSquare.style.backgroundColor = 'white';
        let colorButtons = document.getElementsByClassName('colorButton');
        for (let button of colorButtons) {
            button.remove();
        }
    });

    imageSquare.addEventListener('click', addColorButton);

    function addColorButton() {
        if (hasColorButton(imageSquare)) {
            return;
        } else {
            let button = document.createElement('button');
            button.classList.add('colorButton');
            button.textContent = 'Click here to change border color';
            button.addEventListener('click', function() {
                changeColor(image);
            });
            imageSquare.appendChild(button);
        }
    }
}

function hasColorButton(imageSquare) {
    let childElements = Array.from(imageSquare.childNodes);
    let childElementTags = childElements.map(element => element.nodeName);
    if (childElementTags.includes('BUTTON')) {
        return true;
    } else {
        return false;
    }
}

function changeColor(image) {
    let colors = [
        'rgba(255, 0, 0, 1)', 
        'rgba(0, 255, 0, 1)',
        'rgba(0, 0, 255, 1)'   
    ];
    let currentColorIndex = colors.indexOf(image.borderColor);
    let nextColor = colors[(currentColorIndex + 1) % colors.length];

    let params = new URLSearchParams();
    params.append('imageId', image['_id']);
    params.append('color', nextColor);

    fetch('/color', {
        method: 'POST',
        body: params
    })
    .then(response => response.json())
    .then(images => {
        document.getElementById('squares-div').innerHTML = '';
        displayImagesInSquares(images);
    });
}
