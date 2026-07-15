import Banner from '@/Components/Banner'
import HowWork from '@/Components/HowWork'
import Most from '@/Components/Most'
import Demand from '@/Components/Demand'
import Trust from '@/Components/Trust'
import WhyUs from '@/Components/WhyUs'
import React from 'react'
import Subscribe from '@/Components/Subscribe'
import Footer from '@/Components/Footer'

const page = () => {
  return (
    <div>
      <Banner></Banner>
      <Trust></Trust>
      <WhyUs></WhyUs>
      <Most></Most>
      <Demand></Demand>
      <HowWork></HowWork>
      <Subscribe></Subscribe>
      <Footer></Footer>
    </div>
  )
}

export default page
