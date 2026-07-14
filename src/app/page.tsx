import Banner from '@/Components/Banner'
import HowWork from '@/Components/HowWork'
import Most from '@/Components/Most'
import Trust from '@/Components/Trust'
import WhyUs from '@/Components/WhyUs'
import React from 'react'

const page = () => {
  return (
    <div>
      <Banner></Banner>
      <Trust></Trust>
      <WhyUs></WhyUs>
      <Most></Most>
      <HowWork></HowWork>
    </div>
  )
}

export default page
