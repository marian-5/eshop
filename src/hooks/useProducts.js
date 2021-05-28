import {
  useState,useEffect
} from 'react'
import {commerce} from '../lib/commerce'


const useProducts = () => {
  const [products,setProducts] = useState([])
  useEffect(()=> {
    const fetchProducts = async () => {
      const {data} = await commerce.products.list()
      setProducts(data)
    }
    //TODO: what if this throws?
    fetchProducts()
    //keep the deps correct:
  },[setProducts])
  return products
}
export default useProducts