$(document).ready(function() {
    $('#viewUnsold').click(getUnsold);
    $('#viewProduct').submit(viewProduct);
});

const getUnsold = function(event) {
    $.ajax({
        url: 'http://localhost:3001/unsold',
        method: 'GET',
        accepts: "application/json",
        success: function(data) {
            populateUnsoldProducts(JSON.parse(data));
        },
        error: function(error) {
            alert(JSON.stringify(error));
        }
    });
}

const populateUnsoldProducts = function(products) {
    let plistString = '<ul id="unsoldProductsList">Unsold Products';
    let buyButton = "";
    products.forEach(function(product) {
        productInfo = '<li>Price: ' + product.price + '</li>';
        buyButton = '<form method="POST" class="buy"><input type="hidden" name="vendor" value="' + product.vendor +'"><input type="hidden" name="name" value="' + product.name + '"><button type="submit">Buy</button></form>';
        plistString = plistString + '<li id="' + product.vendor + product.name + '">' + '<ul>' + product.vendor + ' ' + product.name + productInfo + buyButton + '</ul></li>';
    });
    plistString = plistString + '</ul>';

    $('#unsoldProductsDiv').html(plistString);
    $('.buy').submit(buyProduct);
}

const putProduct = function(product) {
    const productInfo = '<li>Price: ' + product.price + '</li><li>Owner: ' + product.owner + '</li><li>Bought: ' + product.bought + '</li>';
    let buyButton = '';
    const productString = '<ul>' + product.vendor + ' ' + product.name + productInfo + '</ul>';
    $('#viewproductdetails').html(productString);
    console.log(product);
    if (product.bought === false) {
        buyButton = '<form method="POST" class="buy"><input type="hidden" name="vendor" value="' + product.vendor +'"><input type="hidden" name="name" value="' + product.name + '"><button type="submit">Buy</button></form>';
        $('#viewproductdetails').append(buyButton);
        $('.buy').submit(buyProduct);
    }
}

const buyProduct = function(event) {
    event.preventDefault();

    const formData = $(this).serializeArray();
    const vendorString = formData[0].value;
    const nameString = formData[1].value;

    $.ajax({
        url: 'http://localhost:3001/buy',
        method: 'POST',
        accepts: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify({
            vendor: vendorString,
            name: nameString,
            newOwner: "buyer"
        }),
        success: function(data) {
            const prod = JSON.parse(data);
            const vendor = prod.vendor;
            const name = prod.name;

            $('#' + vendor + name).remove();
            $('#viewproductdetails').empty();
        },
        error: function(error) {
            console.log(error);
        }
    });
}

const viewProduct = function(event) {
    event.preventDefault();

    const formData = $(this).serialize();
    $.ajax({
        url: 'http://localhost:3001/view?' + formData,
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
