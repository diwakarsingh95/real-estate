import { useLocation } from "react-router-dom";
import clsx from "clsx";

const Footer = () => {
  const { pathname } = useLocation();
  const fixedFooter = pathname !== "/" && pathname.indexOf("/listing/") === -1;
  return (
    <footer
      className={clsx(
        "w-full bg-slate-200 shadow-md text-center text-slate-500 font-bold leading-none p-5",
        fixedFooter && "fixed bottom-0"
      )}
    >
      Copyright {new Date().getFullYear()} Real Estate
    </footer>
  );
};

export default Footer;
