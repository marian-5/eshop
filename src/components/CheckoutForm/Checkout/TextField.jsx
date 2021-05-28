import React from 'react'
import {
  TextField as MuiTextField, Grid
} from '@material-ui/core'
import {useFormContext, Controller} from 'react-hook-form'

const TextField = ({name,label,required}) => {
  const {control} = useFormContext()
  return (
    <Grid item xs={12} sm={6}>
      {/*
      <Controller
        as={MuiTextField}
        control={control}
        
        fullWidth
        name={name}
        label={label}
        required={required}
      />

      */}
      <Controller
        name={name}
        control={control}
        render={({field:{onChange,value,name,/*onBlur*/}}) =>(
          <MuiTextField
            onChange={onChange}
            value={value}
            name={name}
            fullWidth
            label={label}
            required={required}
          />
        )}
      />
    </Grid>
  )
}

export default TextField
