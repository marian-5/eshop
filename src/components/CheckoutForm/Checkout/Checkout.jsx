import React, {useState} from 'react'
import {
  Paper, Stepper, Step, StepLabel,
  Typography, CircularProgress,
  Divider, Button, CssBaseline
} from '@material-ui/core'

import useStyles from './useStyles'
import PaymentForm from './PaymentForm'
import AddressForm from './AddressForm'
import useCheckoutToken from './useCheckoutToken'
import {Link} from 'react-router-dom'


const Checkout = ({cart,order,onCaptureCheckout,error}) => {
  const classes = useStyles()
  const [shippingData,setShippingData] = useState({})
  //index to steps
  const [activeStep,setActiveStep] = useState(0)
  
  const maybeToken = useCheckoutToken(cart);
  if(maybeToken === undefined) {
    return <p>loading...</p>
  }
  const token = maybeToken
  const Confirmation=() => order.customer ? (
    <>
      <div>
        <Typography variant='h5'>
          Thank you for your purchase, {order.customer.firstname},{order.customer.lastname}
          <Divider className={classes.divider}/>
          <Typography variant='subtitle2'>
            Order ref: {order.customer_reference}
          </Typography>
        </Typography>
      </div>
      <br />
      <Button component={Link} to='/' variant='outlined' type='button'>
        Back to Home
      </Button>
    </>
  ) : (
    <div className={classes.spinner}>
      <CircularProgress/>
    </div>
  )
  
  
  const steps = [
    {
      form: AddressForm,
      name: 'Shipping address'
    },
    {
      form: PaymentForm,
      name: 'PaymentDetails'
    },
    {
      form: Confirmation,
    }
  ]
  if(error) return (
    <>
      <Typography variant='h5'> Error: {error}</Typography>
      <br/>
      <Button component={Link} to='/' variant='outlined' type='button'>
        Back to Home
      </Button>
    </>
  )

  const nextStep = () => setActiveStep(step => step+1)
  const backStep = () => setActiveStep(step => step -1)
  const next = data => {
    setShippingData(data)
    nextStep()
  }
  const StepForm = steps[activeStep].form
  return (
    <>
    <CssBaseline/>
      <div className={classes.toolbar}/>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography
            variant='h4'
            align='center'
          >
            Checkout
          </Typography>
          <Stepper
            activeStep={activeStep}
            className={classes.stepper}
          >{
            steps
            .map(step=>step.name)
            .filter(step=>step!==undefined)
            .map(step=>(
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))
          }</Stepper>
          <StepForm token={token} next={next} backStep={backStep} nextStep={nextStep} onCaptureCheckout={onCaptureCheckout} shippingData={shippingData}/>
        </Paper>
      </main>
    </>
  )
}

export default Checkout
