import React, {useState,useEffect} from 'react'
import {
  InputLabel, Select, MenuItem,
  Button, Grid, Typography
} from '@material-ui/core'
import { useForm, FormProvider} from 'react-hook-form'
import TextField from './TextField'
import { commerce } from '../../../lib/commerce'
import {Link} from 'react-router-dom'
const fields = [
  ['firstName','First name'       ],
  ['lastName' ,'LastName'         ],
  ['address1' ,'Address'          ],
  ['email'    ,'Email'            ],
  ['city'     ,'City'             ],
  ['zip'      ,'ZIP / Postal code'],
].map(([name,label])=>({name,label}))


const useAsyncInit = (uninit,fn,deps) => {
  const [value,setValue] = useState(uninit)
  useEffect(()=>{
    fn().then(value=>setValue(value))
  },deps)
  return value
}

const objToArr = obj =>(
  Object.entries(obj)
  .map(([id,label])=>({id,label}))
)

const AddressForm = ({token,next}) => {
  const [shippingCountry,setShippingCountry] = useState(undefined)
  const [shippingSubdivision,setShippingSubdivision] = useState(undefined)
  const [shippingOption,setShippingOption] = useState(undefined)

  const shippingCountries = useAsyncInit([],async ()=> {
    const {countries} = await(
      commerce.services
      .localeListShippingCountries(token.id)
    )
    return objToArr(countries)
  },[token])
  const shippingSubdivisions = useAsyncInit([],async ()=> {
    if(shippingCountry!==undefined) {
      const {subdivisions} = await(
        commerce.services
        .localeListSubdivisions(shippingCountry)
      )
      return objToArr(subdivisions)
    }
    else return []
  },[shippingCountry])
  const shippingOptions = useAsyncInit([],async ()=> {
    if(shippingCountry !== undefined
       && shippingSubdivision !== undefined) {
      const options =await commerce.checkout.getShippingOptions(
        token.id,
        {
          country:shippingCountry,
          region:shippingSubdivision
        }
      )
      console.log('shippingOptions',options)
      return options
      .map(so=>({
        id:so.id,
        label: `${so.description} - (${
                so.price.formatted_with_symbol})`
      }))
    }
    else return []
  },[token,shippingCountry,shippingSubdivision])

  const methods = useForm()
  return (
    <>
      <Typography variant='h6' gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(data=>next({...data, shippingCountry, shippingSubdivision, shippingOption}))}>
          <Grid container spacing={3}>
            {fields.map(({name,label}) =>(
              <TextField
                key={name}
                required
                name={name}
                label={label}
              />
            ))}
            <Grid item xs={12} sm={6}>
              <InputLabel>
                Shipping Country
              </InputLabel>
              <Select
                value={
                  shippingCountry !== undefined
                  ? shippingCountry
                  : ''
                }
                fullWidth
                onChange={
                  e=>{
                    setShippingCountry(e.target.value)
                    setShippingSubdivision(undefined)
                    setShippingOption(undefined)
                  }
                }
              >{
                shippingCountries.map(({id,label})=>(
                  <MenuItem key={id} value={id}>
                    {label}
                  </MenuItem>
                ))
              }</Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>
                Shipping Subdivisions
              </InputLabel>
              <Select
                value={
                  shippingSubdivision !== undefined
                  ? shippingSubdivision
                  : ''
                }
                fullWidth
                onChange={
                  e=>{
                    setShippingOption(undefined)
                    setShippingSubdivision(e.target.value)
                  }
                }
              >{
                shippingSubdivisions.map(({id,label})=>(
                  <MenuItem key={id} value={id}>
                    {label}
                  </MenuItem>
                ))
              }</Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>
                Shipping Options
              </InputLabel>
              <Select
                value={
                  shippingOption !== undefined
                  ? shippingOption
                  : ''
                }
                fullWidth
                onChange={
                  e=>setShippingOption(e.target.value)
                }
              >{
                shippingOptions.map(({id,label})=>(
                  <MenuItem key={id} value={id}>
                    {label}
                  </MenuItem>
                ))
              }</Select>
            </Grid>

          </Grid>
          <br />
          <div
            style={{
              display:'flex',
              justifyContent:'space-between'
            }}
          >
            <Button
              component={Link}
              to='/cart'
              variant='outlined'
            >
              Back to Cart
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='primary'
            >
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default AddressForm
