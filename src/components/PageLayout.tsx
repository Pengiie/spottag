import Navbar from "./Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => (
  <>
    <Navbar />
    {children}
  </>
);

export default PageLayout;