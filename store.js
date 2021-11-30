if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
} else{
    ready()
}

let cartNumb = 0

//const itemNames = JSON.parse(localStorage.itemNames || '[]');
let itemNames = []
let itemQuants = []
let itemPrices = []
let itemSources = []

function ready() {
    var removeCartButtons = document.getElementsByClassName('btn-remove')
    console.log(removeCartButtons)
    for (var i = 0; i< removeCartButtons.length; i++){
        var button = removeCartButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++){
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
    
}

function purchaseClicked(){

    var cartItems = document.getElementsByClassName('cart-items')[0]
    
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')

    for(i=0;i<cartRows.length;i++){
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var title = cartRow.getElementsByClassName('cart-item-title')[0].innerText
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var imageSrc = cartRow.getElementsByClassName('cart-item-image')[0].id
        var quantity = quantityElement.value
        itemNames.push(title)
        itemQuants.push(quantity)
        itemPrices.push(price)
        itemSources.push(imageSrc)
    }
    localStorage.setItem("prices", JSON.stringify(itemPrices));
    localStorage.setItem("names", JSON.stringify(itemNames));
    localStorage.setItem("quants", JSON.stringify(itemQuants));
    localStorage.setItem("srcs", JSON.stringify(itemSources));

       
    }

function checkout(){

    var storedNames = JSON.parse(localStorage.getItem("names"));
    var storedQuants = JSON.parse(localStorage.getItem("quants"));
    var storedPrices = JSON.parse(localStorage.getItem("prices"));
    var storedSources = JSON.parse(localStorage.getItem("srcs"));


    for(var i = 0;i<storedNames.length;i++)fillCart(storedNames[i], storedPrices[i], storedQuants[i], storedSources[i], i)

    fillForm(storedNames, storedQuants)
}

function fillCart(title, price, quant, src, count){
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.innerText = title
    var cartItems = document.getElementsByClassName('checkout-items')[0]
    var cartRowContent =`
    <div class="cart-item cart-column ">
        <div class="cart-item-image" id="${src}" width="100" height="100"></div>
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <span class="checkout">${quant}</span>
        </div>`
    cartRow.innerHTML = cartRowContent
    cartItems.append(cartRow)

    

    var form = document.getElementById('checkoutForm')
    
    if(count==0){
        var totalValue = localStorage.getItem(total)
        var total = document.createElement('input')
        total.classList.add('checkoutTotal')
        total.type='hidden'
        total.name="total"
        total.value=localStorage.total
        form.append(total)
        document.getElementsByClassName('purchaseTotal')[0].innerText = '$' + localStorage.total

    }
    
}

function fillForm(names, quants){
    var form = document.getElementById('checkoutForm')

    var itemName = document.createElement('input')
    itemName.name="items"
    itemName.type='hidden'
    itemName.value=names

    var itemQuant = document.createElement('input')
    itemQuant.name="quantities"
    itemQuant.type='hidden'
    itemQuant.value=quants


    form.append(itemName)
    form.append(itemQuant)
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1

        alert("There's a remove button for a reason")
    }
    else if (input.value >= 13){
        input.value = 12
        alert("You can only order 12 of each cookie")
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    //event.target
    var button = event.target
    //.parentElement is like cd.. in powershell
    var shopItem = button.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].id
    cartNumb ++
    // console.log(title, price, imageSrc)
    addItemToCart(title, price, imageSrc, cartNumb)
    updateCartTotal()

    document.getElementsByClassName('btn-checkout')[0].addEventListener('click', purchaseClicked)
}

function addItemToCart(title, price, imageSrc){
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.innerText = title
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++){
        if(cartItemNames[i].innerText == title){
        //make so clicks increase number by 1
            var q = document.getElementById(title+'-quant')
                q.value ++
            if(q.value>=13){
                alert("You can only order 12 of each cookie")
                q.value --
            }            
            return
        }
    }
    
    var cartRowContent =`
    <div class="cart-item cart-column ">
        <div class="cart-item-image" id="${imageSrc}"></div>
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input id="${title}-quant" class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger" type="button">REMOVE</button>
    </div>`
    cartRow.innerHTML = cartRowContent
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click',
    removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener
    ('change', quantityChanged)
}

function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++){
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var title = cartRow.getElementsByClassName('cart-item-title')[0].innerText
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        // console.log(price * quantity)
        // console.log(quantity)
        // console.log(title)
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
    localStorage.setItem("total", total)
}
