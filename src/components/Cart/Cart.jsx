import React from 'react'
import {
  Container, Typography, Button, Grid
} from '@material-ui/core'
import useStyles from './useStyles'
import CardItem from './CartItem/CartItem'
import {Link} from 'react-router-dom'

const EmptyCart = () => {
  const classes = useStyles()
  return(
  <Typography
    variant='subtitle1'
  >
    You have no items in your shopping cart,
    <Link to='/' className={classes.link}>
      start adding some!
    </Link>
  </Typography>
)};
const FilledCart = ({cart, updateCart}) => {
  const classes = useStyles()
  const buttonProps = {
    size:'large',
    type:'button',
    variant:'contained'
  }
  if(cart === undefined || cart.line_items ===undefined) {
    console.log('card undefined?',cart)
    return <p>error</p>
  }

  return(
  <>
    <Grid container spacing={3}>{
      cart.line_items.map(item => (
        <Grid item xs={12} sm={4} key={item.id}>
          <CardItem
            item={item}
            updateCart={
              updateCart
              /*TODO: project it to a
              [quantity,setQuantity]*/
            }
          />
        </Grid>
      ))
    }</Grid>
    <div className={classes.cardDetails}>
      <Typography variant= 'h4'> {
        `Subtotal: ${
          cart.subtotal.formatted_with_symbol
        }`
      }</Typography>
      <div>
        <Button
          key='empty cart'
          className={classes.emptyButton}
          color='secondary'
          onClick={updateCart.clear}
          {...buttonProps}
        >
          Empty Cart
        </Button>
        <Button
          component={Link}
          to={'/checkout'}
          key='checkout'
          className={classes.checkoutButton}
          color='primary'
          {...buttonProps}
        >
          Checkout
        </Button>
      </div>
    </div>
  </>
)}

const Cart = ({cart, updateCart}) => {
  const isEmpty = cart.line_items.length === 0
  const classes = useStyles()
  return (
    <Container>
      <div className={classes.toolbar}/>
      <Typography
        className={classes.title}
        variant='h3'
        gutterBottom
      >
        Your Shopping Cart
      </Typography>
      { isEmpty ? <EmptyCart /> : (
        <FilledCart
          cart={cart}
          updateCart = {updateCart}
        />
      )}
    </Container>
  )
}

export default Cart
