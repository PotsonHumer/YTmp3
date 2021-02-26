import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import reducers from '../reducers/reducers'

import 'bootstrap/dist/css/bootstrap.css'
import '../styles/fontawesome.min.css'
import '../styles/svg-with-js.min.css'

const store = createStore(reducers, applyMiddleware(thunk))

// eslint-disable-next-line react/prop-types
const MyApp = ({ Component, pageProps }) => (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
)

export default MyApp
