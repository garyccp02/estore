$(document).ready(function() {
    $('#viewUnsold').click(getUnsold);
    $('#releaseProduct').submit(releaseProduct);
    $('#viewProduct').submit(viewProduct);
});

const getUnsold = function(event) {
    $.ajax({
        url: 'http://localhost:3000/unsold',
        method: 'GET',
        accepts: "application/json",
        success: function(data) {
            populateUnsoldProducts(data);
        },
        error: function(error) {
            alert(JSON.stringify(error));
        }
    });
}

const populateUnsoldProducts = function(products) {
    let plistString = '<ul id="unsoldProductsList">Unsold Products';
    products.forEach(function(product) {
        productInfo = '<li>Price: ' + product.price + '</li>';
        plistString = plistString + '<li id="' + product.vendor + product.name + '">' + '<ul>' + product.vendor + ' ' + product.name + productInfo + '</ul></li>';
    });
    plistString = plistString + '</ul>';

    $('#unsoldProductsDiv').html(plistString);
}

const appendProduct = function(product) {
    let plist = $('#unsoldProductsList').html();
    const productInfo = '<li>Price: ' + product.price + '</li>';
    let productString = '<li id="' + product.vendor + product.name + '">';
    productString = productString + '<ul>' + product.vendor + ' ' + product.name + productInfo + '</ul></li>';
    $('#unsoldProductsList').html(plist + productString);
}

const releaseProduct = function(event) {
    event.preventDefault();

    const formData = $('#releaseProduct').serializeArray();
    const companyString = formData[0].value;
    const nameString = formData[1].value;
    const priceString = formData[2].value;
    $.ajax({
        url: 'http://localhost:3000/release',
        method: 'POST',
        data: JSON.stringify({
            vendor: companyString,
            name: nameString,
            price: priceString
        }),
        contentType: 'application/json',
        success: function(data) {
            appendProduct(JSON.parse(data));
        },
        error: function(error) {
            console.log(error);
        }
    });
}

const putProduct = function(product) {
    const productInfo = '<li>Price: ' + product.price + '</li><li>Owner: ' + product.owner + '</li><li>Bought: ' + product.bought + '</li>';
    const productString = '<ul>' + product.vendor + ' ' + product.name + productInfo + '</ul>';
    $('#viewproductdetails').html(productString);
}

const viewProduct = function(event) {
    event.preventDefault();

    const formData = $(this).serialize();
    $.ajax({
        url: 'http://localhost:3000/view?' + formData,
        method: 'GET',
        accepts: 'application/json',
        success: function(data) {
            putProduct(JSON.parse(data));
        },
        error: function(error) {
            console.log(error);
        }
    });
}
