import {
  useState, useEffect, useCallback
} from 'react'
import {commerce} from '../lib/commerce'


//returns either undefined or a
//[cart,updateCart]
const useCart = () => {
  /*should i even be specifying the deps? i mean how often is App re-rendered? every time u add something to the cart? (AFAIK yes, but possibly even more times)*/
  
  const [cart,setCart] = useState(undefined)
  useEffect(()=>{
    const fetchCart = async () => setCart(
      /*i don't know commerce.js, but this probably shouldn't happen on every re-render, if so, then am i wrong in thinking deps are just an optimization and aren't guaranteed to work or is the tutorial incorrect?*/
      await commerce.cart.retrieve()
    )
    //TODO: what if this throws?
    fetchCart()
    
    //keep the deps correct:
  },[setCart])


  const add = useCallback(async (
    productId, quantity
  ) => {
    const {cart} = await commerce.cart.add(
      productId, quantity
    );
    console.log('cart changed to', cart)
    setCart(cart)
    //keep the deps correct:
  },[setCart])

  const setQuantity = useCallback(async (
    productId, quantity
  )=> {
    const {cart} = await commerce.cart.update(
      productId, {quantity}
    );
    setCart(cart)
    //keep the deps correct:
  },[setCart])

  const removeItem = useCallback(async productId => {
    const {cart} = await commerce.cart.remove(productId)
    setCart(cart)
    //keep the deps correct:
  },[setCart])

  const clear = useCallback(async ()=> {
    const {cart} = await commerce.cart.empty()
    setCart(cart)
    //keep the deps correct
  },[setCart])

  const refresh = useCallback(async () => {
    const newCart = await commerce.cart.refresh()
    setCart(newCart)
  },[setCart])

  return (
    cart === undefined
    ? undefined
    : [cart,{add,remove:removeItem,setQuantity,clear,refresh}]
  )
}

export default useCart