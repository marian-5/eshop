import React from 'react'
import {
  Card, CardMedia, CardContent,
  CardActions, Typography, IconButton
} from '@material-ui/core'
import {AddShoppingCart} from '@material-ui/icons'

import useStyles from './styles'

const Product = ({
  product:{
    id,
    name,
    media:{source:image},
    price:{formatted_with_symbol:price},
    description
  },
  onAddToCart
}) => {
  const classes = useStyles()
  //TODO: consider useCallback
  const addProductToCart = () => onAddToCart(id,1)
  return (
    <Card className={classes.root}>
      {image && (
        //i cant display it if i don't have the image
        <CardMedia
          className={classes.media}
          image={image}
          title={name}
        />
      )}
      <CardContent>
        <div className={classes.cardContent}>
          <Typography variant='h5' gutterBottom>
            {name}
          </Typography>
          <Typography variant='h5'>
            {price}
          </Typography>
        </div>
        <Typography
          variant='body2'
          color='textSecondary'
          dangerouslySetInnerHTML={{
            //TODO: should this be sanitized?
            __html:description
          }}
        />
        <CardActions disableSpacing className={classes.cardActions}>
          <IconButton
            aria-label='Add to Cart'
            onClick={addProductToCart}
          >
            <AddShoppingCart/>
          </IconButton>
        </CardActions>
      </CardContent>
    </Card>
  )
}

export default Product
