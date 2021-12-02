import Head from 'next/head'
import Image from 'next/image'
import profilePic from 'public/bhimraj_yadav.jpg'
export default function Home() {
  return (
    <div className="flex flex-col items-center bg-white justify-center min-h-screen ">
      <Head>
      <title>Software Developer | AI Enthusiast | Bhimraj Yadav</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="application-name" content="Bhimraj Yadav" />
      </Head>
      <main className="relative w-full max-w-lg"> 
      <div className="absolute top-4 left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob" ></div>
      <div className="absolute top-0 right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000" ></div>
      <div className="absolute top-20 left-28  w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000" ></div>
      <div className="bg-gray-100/20 backdrop-blur-md rounded-2xl w-full h-full items-center flex flex-col p-8 space-y-2">
        <Image src={profilePic} alt="Bhimraj Yadav" width={300} height={300} priority loading="eager" className="rounded-full filter saturate-100 drop-shadow-sm object-center"/>
        <h1 className="text-5xl text-gray-800 font-semibold pt-4 pb-2">Bhimraj Yadav</h1>
        <p className="text-lg text-gray-700 font-light">Software Developer | AI Enthusiast</p>
        <small className="text-gray-500 py-4 md:hidden">!!! Website Launching Soon !!!</small>
        
         <div className="md:flex hidden">
           <nav className="flex">
             <ul className="grid  grid-cols-3 text-center space-x-2 text-base font-medium text-gray-600 transition-all">
               <li className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-100/10 shadow-sm hover:text-gray-700 cursor-pointer backdrop-blur">Home</li>
               <li className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-100/10 shadow-sm hover:text-gray-700 cursor-pointer backdrop-blur">Blog</li>
               <li className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-100/10 shadow-sm hover:text-gray-700 cursor-pointer backdrop-blur">Contact</li>
             </ul>
           </nav>

         </div>
      </div>
      </main>
      
    </div>
  )
}
