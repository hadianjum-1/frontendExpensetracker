import React from 'react'
import { Layout } from "antd";
const {Header} =   Layout;

const Meader = () => {
  return (
    <Layout>
    <Header className='bg-black mx-auto w-[100vw] flex justify-between items-center '>
            <div className="lgo text-amber-50">Expense Tracker</div>
            <nav>
                <ul className='flex justify-center items-center gap-2 text-amber-50 cursor-pointer'>
                    <li>About</li>
                    <li>Pricing</li>
                    <li>Contact</li>
                </ul>
            </nav>
        </Header>
        
</Layout>
  )
}

export default Meader
