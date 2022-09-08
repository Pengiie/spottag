import type { NextPage } from 'next'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { trpc, trpcClient } from '../utils/trpc'
import { got } from 'got';


const Home: NextPage = () => {
  return ( 
    <main className="px-28 pt-48 flex flex-col w-full">
      <h1>Set the mood.</h1>
      <h5 className="text-black-75 w-5/12">Create playlists with your friends, start online sessions, and tag your music with certain moods.</h5>
      <div className="flex items-center bg-brand-button rounded-lg w-fit py-4 px-8 mt-2" onClick={() => {
        
      }}>
        <p className="  text-white text-[1.125rem] ">Sign up with Spotify</p>
        <AiOutlineArrowRight className="text-white w-6 h-6 ml-4" />
      </div>
      <p className="text-black-50">*Requires Spotify Premium</p>
    </main>
  )
}

export default Home
