import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Navbar/Navbar'
import React from 'react'

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div>
      <Navbar />
        {children}
        <Footer />
    </div>
  )
}

export default RootLayout
