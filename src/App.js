import React, { Component } from 'react'
import {
  Button,
  Card,
  CardTitle,
  CardText,
  Media,
  MediaOverlay,
} from 'react-md'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import { businesses } from './utils/businessmocklist'

import Header from './components/HeaderNav'

// import './css/oswald.css'
// import './css/open-sans.css'
// import './css/pure-min.css'
// import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      // this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(15, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  render() {
    return (
      <div>
        <div className="container">
          <Header />
        </div>
        <div className="md-grid">
        {
          businesses.map((business)=>{
            return(<Card key={business.id} className="cards__example md-cell md-cell--3 md-cell--8-tablet">
              <Media>
                <img src="http://lorempixel.com/400/200/" alt="Nature from lorempixel" />
                <MediaOverlay>
                  <CardTitle title={business.business_name} subtitle={business.business_address}>
                    <Button className="md-cell--right" icon>star_outline</Button>
                    <Button className="md-cell--right" icon>thumb_up</Button>
                    <Button className="md-cell--right" icon>business</Button>
                  </CardTitle>
                </MediaOverlay>
              </Media>
              <CardText>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </CardText>
            </Card>)
          })
        }
      </div>
      </div>
    );
  }
}

export default App
