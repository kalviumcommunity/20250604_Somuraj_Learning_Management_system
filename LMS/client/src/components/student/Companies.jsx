import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='pt-16'>
      <p className='text-base text-gray-500 '> Trusted by learners from </p>
      <div className='flex flex-wrap items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5'>
        <img src={assets.kalvium_logo} alt="Kalvium" className='w-20 md:2-28'/>
        <img src={assets.udemy_logo} alt="Udemy" className='w-20 md:2-28'/>
        <img src={assets.coursera_logo} alt="Coursera" className='w-20 md:2-28'/>
        <img src={assets.linkedin_logo} alt="LinkedIn" className='w-20 md:2-28'/>
        <img src={assets.talentlms_logo} alt="TalentLMS" className='w-20 md:2-28'/>
      </div>
    </div>
  )
}

export default Companies
