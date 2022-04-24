import React from 'react'
import styled from "styled-components"
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Main() {
  return (
    <>
        <Navbar></Navbar>
        <Appbody>

        <Sidebar></Sidebar>
        
        </Appbody>
        
    </>
  )
}

export default Main

const Appbody = styled.div`
display: flex;
height: 100vh;
`