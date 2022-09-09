import Link from "next/link";
import { useSignIn } from "../hooks/signIn";

const Navbar = () => {
  const signIn = useSignIn();

  return (
    <nav className="flex w-full px-28 py-8 items-center">
      <Link href="/"><h4 className="flex-grow hover:cursor-pointer">SpotTag</h4></Link>
      <Link href="/features"><a className="ml-8 text-[1.5rem]">Features</a></Link>
      <a className="ml-8 py-2 px-4 bg-brand-button text-white text-[1.25rem] rounded-lg" onClick={signIn}>Sign up</a>
    </nav>
  )
};

export default Navbar;