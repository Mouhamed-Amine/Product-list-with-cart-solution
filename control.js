'use strict';

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      displayData(data);
    })
    .catch(error => console.error('Error fetching data:', error));
});

let cart = {}; // Global cart object

function displayData(data) {
  let card = document.querySelector('.cards');

  data.forEach((element, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('items');

    const imgElement = document.createElement('img');
    imgElement.classList.add('thumbnail_card');
    imgElement.setAttribute('alt', 'main_image');
    imgElement.setAttribute('srcset', `
      ${element.image.mobile} 792w,
      ${element.image.tablet} 1024w,
      ${element.image.desktop} 1200w
    `);
    imgElement.setAttribute('sizes', `
      (max-width: 792px) 100vw, 
      (max-width: 1200px) 1024px, 
      1200px
    `);
    imgElement.setAttribute('src', element.image.desktop); // Default image

    itemDiv.innerHTML = `
      <div class="thumbnail_btn">
        <a class="btn" data-index="${index}">
          <img src="assets/images/icon-add-to-cart.svg" alt="store" />
          Add to Cart
        </a>
      </div>
      <p class="Type">${element.category}</p>
      <h5 class="Title">${element.name}</h5>
      <span class="price">$${element.price}</span>
    `;
    itemDiv.insertBefore(imgElement, itemDiv.firstChild);

    card.appendChild(itemDiv);
  });
  console.log(cart);
  addToCart(data);
}

function addToCart(data) {
  let buttons = document.querySelectorAll('.btn');

  buttons.forEach((Node) => {
    Node.addEventListener("click", (event) => {
      const Index = event.target.closest('.btn').getAttribute('data-index');
      const Item = data[Index];

      if (cart[Item.name]) {
        cart[Item.name].quantity += 1;
      } else {
        cart[Item.name] = {
          Item: Item,
          quantity: 1
        };
      }
      
      event.target.innerHTML = `
        <div class="hover-after">
          <img class="icons" src="assets/images/icon-decrement-quantity.svg" alt="previous" class="decrement-icon"/>
          ${cart[Item.name].quantity}
          <img class="icons" src="assets/images/icon-increment-quantity.svg" alt="next" class="increment-icon"/>
        </div>
      `;

      // Style of button after click
      const parent = event.target.parentElement;
      parent.style.backgroundColor = 'hsl(14, 86%, 42%)';
      parent.style.color = 'white';

      updateCart();
    });
  });
}

function updateCart() {
  const cartElement = document.querySelector('.cartContent');
  const OrderNumber = document.querySelector('.your-cart');
  cartElement.innerHTML = "";
  let TotalOrder = 0;
  let count = 0;

  // Loop within cart
  for (const element in cart) {
    const cartItem = cart[element];
    let priceOfElement = cartItem.Item.price * cartItem.quantity;
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('cart-item');
    TotalOrder += priceOfElement;
    count++;
    contentDiv.innerHTML = `
      <h5>${cartItem.Item.name}</h5>
      <span class="span-Qt">${cartItem.quantity}x</span>
      <span>@ ${cartItem.Item.price.toFixed(2)}</span>
      <span class="span-Pr">${priceOfElement.toFixed(2)}</span>
      <img class="cancel-item" src="assets/images/icon-remove-item.svg" alt="remove" />
    `;

    cartElement.appendChild(contentDiv);
    contentDiv.querySelector('.cancel-item').addEventListener('click', (e) => {
      e.preventDefault();
      TotalOrder -= cartItem.Item.price * cartItem.quantity;

      delete cart[cartItem.Item.name];
      contentDiv.remove();

      // Update the total order display
      document.querySelector('.order-total span:last-child').textContent = `$${TotalOrder.toFixed(2)}`;

      // Update the cart count display
      document.querySelector(".your-cart").innerHTML = `Your Cart(${--count})`;
      updateCart();
    });
  }
  OrderNumber.innerHTML = `Your Cart(${count})`;
  const orderElement = document.createElement('div');
  orderElement.classList.add('order-total');
  orderElement.innerHTML = `
    <span class="order">Order Total</span>
    <span>$${TotalOrder.toFixed(2)}</span>
  `;
  const confirmOrder = document.createElement('div');
  confirmOrder.classList.add('order-confirm');
  confirmOrder.innerHTML = `
    <div class="carbon">
      <img src="assets/images/icon-carbon-neutral.svg" alt="carbon_note" />
      <span>This is a <b>carbon-neutral</b> delivery</span>
    </div>
    <div>
      <a class="confirm-btn">Confirm Order</a>
    </div>
  `

  cartElement.appendChild(orderElement);
  cartElement.appendChild(confirmOrder);

  const confirmBtn = document.querySelector(".confirm-btn");
  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let TotalOrder = 0;

    // Create confirmation popup container
    const confirmation = document.createElement('div');
    confirmation.classList.add('popup');

    // Create inner content container
    const innerContent = document.createElement('div');
    innerContent.classList.add('inner-content');

    // Header section
    innerContent.innerHTML = `
      <img src="assets/images/icon-order-confirmed.svg" alt="validation"/>
      <h1>Order Confirmed</h1>
      <span>We hope you enjoy your food!</span>
    `;

    // Order details section
    for (const [key, cartItem] of Object.entries(cart)) {
      let priceOfElement = cartItem.Item.price * cartItem.quantity;
      TotalOrder += priceOfElement;

      const itemDetails = `
        <div class="item-details">
          <h5>${cartItem.Item.name}</h5>
          <span class="span-Qt">${cartItem.quantity}x</span>
          <span>@ $${cartItem.Item.price.toFixed(2)}</span>
          <span class="span-Pr">$${priceOfElement.toFixed(2)}</span>
        </div>
      `;

      innerContent.innerHTML += itemDetails;
    }

    // Order total section
    innerContent.innerHTML += `
      <div class="confirmation-total">
        <span>Order Total</span>
        <span><b>$${TotalOrder.toFixed(2)}</b></span>
      </div>
      <button class="start-new-order-btn">Start New Order</button>
    `;

    confirmation.appendChild(innerContent);
    document.body.appendChild(confirmation);

    document.querySelector('.main-content').style.filter = 'blur(5px)';

    const goToBtn = document.querySelector('.start-new-order-btn');
    goToBtn.addEventListener('click', (e) => {
      e.preventDefault();
      location.reload();
    });
  });
}
