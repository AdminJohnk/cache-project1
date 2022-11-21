import React, { Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import AssociativeMapping from './Component/AssociativeMapping/AssociativeMapping'
import DirectMapping from './Component/DirectMapping/DirectMapping'
import Navbar from './Component/Navbar/Navbar'
import TwoWaySA from './Component/TwoWaySA/TwoWaySA'
import FourWaySA from './Component/FourWaySA/FourWaySA'

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar/>
        {/* <DirectMapping/> */}
        {/* <AssociativeMapping/> */}
        {/* <TwoWaySA/> */}


        <Routes>
          <Route path='/' element={<DirectMapping/>}/>
          <Route path='/Fully-Associative-Cache' element={<AssociativeMapping/>}/>
          <Route path='/2-Way-SA' element={<TwoWaySA/>}/>
          <Route path='/4-Way-SA' element={<FourWaySA/>}/>
        </Routes>
      </div>
    )
  }
}
