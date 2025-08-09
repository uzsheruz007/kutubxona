import { NavLink as RouterNavLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

function PremiumNavLink({ to, scrollTo, children }) {
  // If `scrollTo` is passed, use react-scroll
  if (scrollTo) {
    return (
      <ScrollLink
        to={scrollTo}
        smooth={true}
        offset={-80}
        duration={500}
        spy={true}
        activeClass="text-blue-600"
        className="relative group inline-block px-2 py-1 text-lg font-medium text-gray-800 hover:text-blue-600 transition-all duration-300 cursor-pointer"
      >
        {children}
        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
      </ScrollLink>
    );
  }

  // Otherwise, fallback to react-router-dom NavLink
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative group inline-block px-2 py-1 text-lg font-medium transition-all duration-300",
          isActive ? "text-blue-600" : "text-gray-800 hover:text-blue-600",
        ].join(" ")
      }
    >
      {children}
      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
    </RouterNavLink>
  );
}

export default PremiumNavLink;
