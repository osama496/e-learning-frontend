import React from 'react'
import {Outlet} from 'react-router-dom'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
function Layout() {
  return (
    <Elements stripe={stripePromise}>
    <Outlet/>
    </Elements>
  )
}

export default Layout