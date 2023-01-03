const parentContainer = document.getElementById("EcommerceContainer")
const api = 'http://localhost:3000'

window.addEventListener('DOMContentLoaded',()=>{
    axios.get(`${api}/products?page=1`)
    .then((data)=>{
      listProducts(data.data.products)
      showPagination(data.data)
    })
    axios.get(`${api}/cart?page=1`)
    .then((res)=>{
      // console.log(res.data,'cart pagination')
      showCartContainer(res.data)
      cartPagination(res.data)
      
    })
    .catch((err)=>{
      console.log(err)
    })

})

function listProducts(prodcuts){
  const parentSection = document.getElementById('music-content')
      prodcuts.forEach(product => {
        let id = product.id
        let name = product.title
        let imageUrl = product.imageUrl
        let price = product.price
        // console.log(name,imageUrl,price)
        const albumDiv = document.createElement('div');
        albumDiv.id = id
  
        const h3 = document.createElement('h3');
        h3.innerHTML = `${name}`
        albumDiv.appendChild(h3);
  
        const imageContainerDiv = document.createElement('div');
        imageContainerDiv.className = 'image-container';
  
        const img = document.createElement('img');
        img.src = `${imageUrl}`;
        img.alt = `${product.title}`;
        img.className = 'prod-images';
        imageContainerDiv.appendChild(img);
        albumDiv.appendChild(imageContainerDiv);
  
        const prodDetailsDiv = document.createElement('div');
        prodDetailsDiv.className = 'prod-details';
  
        const span = document.createElement('span');
        span.innerHTML = `$<span>${price}</span>`;
        prodDetailsDiv.appendChild(span);
  
        const button = document.createElement('button');
        button.className = 'shop-item-button';
        button.type = 'button';
        button.innerHTML = 'ADD TO CART';
        button.addEventListener('click',(e)=>{
          // console.log('button clicked')
          axios.post('http://localhost:3000/cart',{productId:id})
          .then((res)=>{
            console.log(res)
            if(res.status === 200){
              notifyUsers(`${name} ${res.data.message}`)
            }
            else {
              throw new Error(res.data.message)
            }
          })
          .catch((errMsg)=>{
            notifyUsers(errMsg)
          })
        })
        prodDetailsDiv.appendChild(button); 
        albumDiv.appendChild(prodDetailsDiv);        
        parentSection.appendChild(albumDiv)
      });
}

function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage,firstPage}){
      
      const ParentElement = document.getElementById('pagination')
      currentPage = Number(currentPage)

      if(currentPage !== firstPage && previousPage !== firstPage){
        const btn0 = document.createElement('button')
        btn0.className = 'pageButton'
        btn0.innerHTML = `<h3>First Page</h3>`
        btn0.addEventListener('click',()=>getProducts(firstPage))
        ParentElement.appendChild(btn0)
      }
      if(hasPreviousPage){
        const btn1 = document.createElement('button')
        btn1.className = 'pageButton'
        btn1.innerHTML = '<<'
        btn1.addEventListener('click',()=>getProducts(previousPage))
        ParentElement.appendChild(btn1)
      }
      if(currentPage !== lastPage){
        const btn2 = document.createElement('button')
        btn2.className = 'pageButton'
        btn2.innerHTML = `<h2>${currentPage}</h2>`
        btn2.addEventListener('click',()=>getProducts(currentPage))
        ParentElement.appendChild(btn2)
      }     
      if(hasNextPage && nextPage !== lastPage){
        const btn3 = document.createElement('button')
        btn3.className = 'pageButton'
        btn3.innerHTML = '>>'
        btn3.addEventListener('click',()=>getProducts(nextPage))
        ParentElement.appendChild(btn3)
      }
      if(lastPage){
        const btn4 = document.createElement('button')
        btn4.className = 'pageButton'
        btn4.innerHTML = `<h3>Last Page</h3>`
        btn4.addEventListener('click',()=>getProducts(lastPage))
        ParentElement.appendChild(btn4)
      }
}

function getProducts(page){
  const parentSection = document.getElementById('music-content')
  const ParentElement = document.getElementById('pagination')
  axios.get(`${api}/products?page=${page}`)
  .then((data)=>{
    parentSection.innerHTML=''
    ParentElement.innerHTML=''
    // console.log(data.data.products,'backend data')
    let prodcuts = data.data.products   
    listProducts(prodcuts)
    showPagination(data.data)
  })
  .catch((err)=>{
    console.log(err)
  })
}
function notifyUsers(message){
  const container = document.getElementById("container");
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `<h4>${message}<h4>`;
    container.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2500);
  }

function showCartContainer(data){
  let totalValue = 0
  // console.log(data.items,data.productDetails,'cartContainer')

  const parentCart = document.getElementById('cart-items')
  parentCart.innerHTML=''

  let cartitems = data.items
  let cartproducts = data.productDetails
  console.log(cartitems,cartproducts)

  let matchingProductDetails = cartitems.map(item => {
    return cartproducts.find(product => product.id === item.productId);
  });
  document.querySelector(".cart-number").innerText = matchingProductDetails.length;
  matchingProductDetails.forEach(item=>{
    console.log(item.id,item.imageUrl,item.price,item.cartItem.quantity)
    let id = item.id
    let name = item.title
    let quantity = item.cartItem.quantity
    let price = item.price
    let img = item.imageUrl
    // console.log(id,name,quantity,price,img)
    // console.log(typeof(quantity),typeof(price)) 

      // Create a new div element
      const cartRow = document.createElement('div');
      cartRow.className = 'cart-row';

      let cartItem = document.createElement('span');
      cartItem.classList.add('cart-item', 'cart-column');

      let cartImg = document.createElement('img');
      cartImg.classList.add('cart-img');
      cartImg.src = img;
      cartImg.alt = "";
      cartItem.appendChild(cartImg);        
    
      let cartItemName = document.createElement('span');
      cartItemName.textContent = name;
      cartItem.appendChild(cartItemName);

      cartRow.appendChild(cartItem);
    
      let cartPrice = document.createElement('span');
      cartPrice.classList.add('cart-price', 'cart-column');
      cartPrice.textContent =  `$${Math.ceil(price*quantity)}`
      cartRow.appendChild(cartPrice);
      totalValue += Math.ceil(price*quantity)
      // console.log(totalValue,'total value')

      let cartQuantity = document.createElement('span');
      cartQuantity.classList.add('cart-quantity', 'cart-column');

      let cartQuantityInput = document.createElement('input');
      cartQuantityInput.type = "text";
      cartQuantityInput.value = quantity
      cartQuantity.appendChild(cartQuantityInput);
    
      let cartQuantityButton = document.createElement('button');
      cartQuantityButton.className = 'btn btn-danger'
      cartQuantityButton.textContent = "REMOVE";
      cartQuantityButton.addEventListener('click',(e)=>{
        e.target.parentNode.parentNode.remove()
        console.log(id,'removeItem function called')
        axios.post(`http://localhost:3000/cartdelete/${id}`)
        .then(res=>{
          console.log('delete here')
          console.log(res,'delete button response')
          showCartContainer()
          })
          .catch((err)=>{
            console.log(err,'unable to delete the product from cart')
          })
      })
      cartQuantity.appendChild(cartQuantityButton);
      
      cartRow.appendChild(cartQuantity);

      parentCart.appendChild(cartRow)
      document.querySelector("#total-value").innerText = `${totalValue}`;
  })
}

function cartPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage,firstPage}){
  let cartParentElement = document.getElementById('cartPagination')
  console.log({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage,firstPage})

  if(currentPage !== firstPage && previousPage !== firstPage){
    const btn0 = document.createElement('button')
    btn0.className = 'pageButton'
    btn0.innerHTML = `<p>First Page</p>`
    btn0.addEventListener('click',()=>getCartProducts(firstPage))
    cartParentElement.appendChild(btn0)
  }
  if(hasPreviousPage){
    const btn1 = document.createElement('button')
    btn1.className = 'pageButton'
    btn1.innerHTML = '<<'
    btn1.addEventListener('click',()=>getCartProducts(previousPage))
    cartParentElement.appendChild(btn1)
  }
  if(currentPage !== lastPage){
    const btn2 = document.createElement('button')
    btn2.className = 'pageButton'
    btn2.innerHTML = `<h5>${currentPage}</h5>`
    btn2.addEventListener('click',()=>getCartProducts(currentPage))
    cartParentElement.appendChild(btn2)
  }     
  if(hasNextPage && nextPage !== lastPage){
    const btn3 = document.createElement('button')
    btn3.className = 'pageButton'
    btn3.innerHTML = '>>'
    btn3.addEventListener('click',()=>getCartProducts(nextPage))
    cartParentElement.appendChild(btn3)
  }
  if(lastPage){
    const btn4 = document.createElement('button')
    btn4.className = 'pageButton'
    btn4.innerHTML = `<p>Last Page</p>`
    btn4.addEventListener('click',()=>getCartProducts(lastPage))
    cartParentElement.appendChild(btn4)
  }
}

function getCartProducts(page){
  console.log(page,'invoked')
  const cartParentContainer = document.getElementById('cart-items')
  const cartParentElement = document.getElementById('cartPagination')
  axios.get(`${api}/cart?page=${page}`)
  .then((res)=>{
    cartParentContainer.innerHTML=''
    cartParentElement.innerHTML=''
    // console.log(data.data.products,'backend data')
    showCartContainer(res.data)
    cartPagination(res.data)
  })
  .catch((err)=>{
    console.log(err)
  })
}
parentContainer.addEventListener("click", (e) => {  
  if (
        e.target.className == "cart-btn-bottom" ||
        e.target.className == "cart-bottom" ||
        e.target.className == "cart-holder"
      ) {
       
        document.querySelector("#cart").style = "display:block;"
        // showCartContainer()
      }
      if (e.target.className == "cancel") {
        document.querySelector("#cart").style = "display:none;";
      }
      if (e.target.className == "purchase-btn") {
        if (parseInt(document.querySelector(".cart-number").innerText) === 0) {
          alert("You have Nothing in Cart , Add some products to purchase !");
          return;
        }
        alert("Thanks for the purchase");
        cart_items.innerHTML = "";
      }
})
