import Link from "next/link";

const Navbar = () => (
  <nav className="flex w-full px-28 py-8 items-center">
    <h4 className="flex-grow">SpotTag</h4>
    <a href="/features" className="ml-8 text-[1.5rem]">Features</a>
    <a className="ml-8 py-2 px-4 bg-brand-button text-white text-[1.25rem] rounded-lg">Sign up</a>
  </nav>
);

export default Navbar;