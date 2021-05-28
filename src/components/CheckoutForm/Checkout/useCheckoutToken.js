import {commerce} from '../../../lib/commerce'
import{useState, useEffect} from 'react'
const useCheckoutToken = cart => {
  const [token,setToken] = useState(undefined)
  const id = cart.id;
  useEffect(()=>{
    const generateToken = async () => {
      const token = await commerce.checkout.generateToken(
        id, {type:'cart'}
      )
      console.log('useCheckoutToken',token)
      const countries = await commerce.services.localeListShippingCountries(token.id)
      console.log('useCheckoutToken-countries',countries)
      setToken(token)
    }
    //what if this fails (i think its possible for that to happen)
    generateToken()
    //don't break the deps
  },[id])
  return token
}
export default useCheckoutToken