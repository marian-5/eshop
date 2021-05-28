import React from 'react'
import {
  Typography, Button, Card, CardActions,
  CardContent, CardMedia
} from '@material-ui/core'

import useStyles from './useStyles'

const CartItem = ({
  item:{
    media:{source:image},
    name,
    line_total:{formatted_with_symbol:total},
    quantity,
    id
  },
  updateCart
}) => {
  const classes = useStyles()
  return (
    <Card>
      {image !== undefined && (
        <CardMedia
          image={image}
          alt={name}
          className={classes.media}
        />
      )}
      <CardContent className={classes.cardContent}>
        <Typography variant='h4'>{
          name
        }</Typography>
        <Typography variant='h5'>{
          total
        }</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <div className={classes.buttons}>
          <Button
            type='button'
            size='small'
            onClick={()=>updateCart.setQuantity(
              id, //i may be skipping clicks this way
              quantity - 1
            )}
          >
            -
          </Button>
          <Typography>{quantity}</Typography>
          <Button
            type='button'
            size='small'
            onClick={()=>updateCart.setQuantity(
              id,
              quantity + 1
            )}
          >
            +
          </Button>
        </div>
        <Button
          variant='contained'
          type='button'
          color='secondary'
          onClick={()=>updateCart.remove(id)}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  )
}
export default CartItem
