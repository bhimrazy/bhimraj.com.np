import Head from 'next/head'
import Image from 'next/image'
import profilePic from '../public/bhimraj_yadav.jpg'
export default function Home() {
  return (
    <div className="flex flex-col items-center bg-white justify-center min-h-screen ">
      <Head>
      <title>Software Developer | AI Enthusiast | Bhimraj Yadav</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="application-name" content="Bhimraj Yadav" />
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"/> 
      </Head>
      <main className="relative w-full max-w-lg"> 
      <div className="absolute top-4 left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob" ></div>
      <div className="absolute top-0 right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000" ></div>
      <div className="absolute top-20 left-28  w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000" ></div>
      <div className="bg-gray-100/20 backdrop-blur-md rounded-2xl w-full h-full items-center flex flex-col p-8">
        <Image src={profilePic} alt="Bhimraj Yadav" width={300} height={300} priority loading="eager" className="rounded-full filter saturate-100 drop-shadow-sm object-center"/>
        <h1 className="text-5xl text-gray-800 font-semibold pt-4 pb-2">Bhimraj Yadav</h1>
        <p className="text-lg text-gray-700 font-light">Software Developer | AI Enthusiast</p>
        <small className="text-gray-500 py-4">!!! Website Launching Soon !!!</small>
      </div>
      </main>
      
    </div>
  )
}
