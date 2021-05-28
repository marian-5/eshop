import React, {useState} from 'react'
import {
  BrowserRouter as Router, Switch, Route
} from 'react-router-dom'

import {
  Products, Navbar, Cart, Checkout
} from './components'
import {
  useProducts, useCart
} from './hooks'
import {commerce} from './lib/commerce'



const App = () => {
  const products = useProducts()
  console.log('products',products)
  const [order,setOrder] = useState({})
  const [errorMessage,setErrorMessage] = useState({})
  const maybeCart = useCart()
  if (maybeCart === undefined) {
    return (<p>loading...</p>)
  }
  const [cart,updateCart] = maybeCart;
  const handleCaptureCheckout = async (token,newOrder) =>{
    try {
      const incomingOrder = await commerce.checkout.capture(token,newOrder)
      setOrder(incomingOrder)
      updateCart.refresh()
    }
    catch (error) {
      setErrorMessage(error.data.error.message)
    }
  }
  console.log('cart',cart)
  return (
    <Router>
      <div>
        <Navbar itemsInCart={cart.total_items}/>
        <Switch>
          <Route exact path='/'>
            <Products
              products={products}
              onAddToCart={updateCart.add}
            />
          </Route>
          <Route exact path='/cart'>
            <Cart cart={cart} updateCart={updateCart}/>
          </Route>
          <Route exact path='/checkout'>
            <Checkout cart ={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage}/>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
