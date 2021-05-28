import React, {useState, useEffect, Fragment} from 'react'
import {commerce} from '../../../lib/commerce'
import {
  InputLabel, Select, MenuItem,
  Button, Grid, Typography
} from '@material-ui/core'

const fns = [
  async token => {
    const {countries} = await (
      commerce.services
      .localeListShippingCountries(token.id)
    )
    return Array.from(
      Object.entries(countries),
      ([id,label])=>({id,label})
    )
  },
  async (token,country) => {
    const {subdivisions} = await (
      commerce.services
      .localeListSubdivisions(country.id)
    )
    return Array.from(
      Object.entries(subdivisions),
      ([id,label])=>({id,label})
    ) 
  },
  async (token,country,region) => {
    const shippingOptions = await (
      commerce.checkout
      .getShippingOptions(
        token.id,
        {country:country.id,region:region.id}
      )
    )
    return shippingOptions.map(o=>({id:o,label:o}))
  }
].map((fn,i)=>async(...args)=>{
  console.log('fn-args',i,args)
  const ret = await fn(...args)
  console.log('fn-ret',i,ret)
  return ret
})

const InputLabels = [
  undefined,
  'Shipping Country',
  'Shipping Subdivisions',
  'Shipping Options',
]
const last = (arr) => {
  const lastInd = arr.length -1
  return [arr[lastInd],lastInd]
}

const range = (from,to) => Array.from(
  function* (from,to) {
    for(let i=from;i<to;i++) {
      yield i
    }
  }
)


const ChainSelect = ({token}) => {
  const [chainSelect,setChainSelect] = useState(
    [{selected:token, options:undefined}]
  )
  console.log('chainSelect',chainSelect)

  useEffect(()=>{
    const [{selected, options},index] = (
      last(chainSelect)
    )
    if(
      selected !== undefined
      && options === undefined
      && index < fns.length
    ) {
      fns[index](
        ...chainSelect.map(l=>l.selected)
      ).then(fetchedOptions=>
        setChainSelect(chainSelect2=>{
          const [{selected2,options2},index2] =(
            last(chainSelect2)
          )
          //we need to check that it hasn't changed
          if(
            selected === selected2
            && index === index2
            && options === options2
          ) {
            return [
              ...chainSelect2,
              {
                selected:undefined,options:fetchedOptions
              }
            ]
          } else {
            return chainSelect2
          }
        })
      )
    }
  })

  const select = index => e => (
    setChainSelect(chainSelect=>{
      if(chainSelect.length <= index) {
        return chainSelect
      }
      const newChain = chainSelect.slice(0,index+1)
      newChain[index] = {
        option:newChain[index].option,
        selected:e.target.value
      }
      return newChain
  }))
  return (
    <Grid item xs={12} sm={6}>{
      chainSelect.slice(1).map(({selected,options},index)=>(
        <Fragment key={index}>
          <InputLabel>{
            InputLabels[index]
          }</InputLabel>
          <Select
            value={
              selected !== undefined
              ? selected
              : ''
            }
            fillWidth
            onChange={select(index)}
          >{
            options.map(option=>(
              <MenuItem
                key={option.id}
                value={option}
              >{
                option.label
              }</MenuItem>
            ))
          }</Select>
        </Fragment>
      ))
    }</Grid>
  )
}

export default ChainSelect
