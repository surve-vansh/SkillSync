import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import LogoDark from "../../assets/Logo-dark.png";
import LogoLight from "../../assets/Logo-light.png";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
// animation btn
import SpecularButton from './SpecularButton';


export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  /* Determine auth state and the correct dashboard route */
  const isLoggedIn = !!user;
  const dashboardRoute = (() => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/admin";
    const activeRole = localStorage.getItem("activeRole");
    if (user.isMentor && (activeRole === "mentor" || (!activeRole && user.role === "mentor"))) return "/mentor";
    return "/dashboard";
  })();

  const navLinks = [
    { name: "Home", href: "#Hero" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];
 useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navLinks.map((link) => link.href.substring(1));
      let current = "home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Scroll effect & Scroll Spy logic
  

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Smooth scroll handler for anchor links
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
    setIsMobileOpen(false);
  };

  return (
    <nav
      className={`fixed z-50 flex items-center justify-between w-full max-w-6xl px-6 mx-auto rounded-full top-3 left-4 right-4 sm:px-8 navbar-glass transition-all duration-300 ease-in-out ${isScrolled ? "h-16 scrolled" : "h-20"
        }`}
    >
      {/* LEFT: Logo */}
      <Link to="/" className="flex items-center shrink-0">
        <img
          // src={LogoDark}
          src={isDark ? LogoLight : LogoDark}
          alt="SkillSync"
          className="block w-auto h-24 sm:h-36"
        />
      </Link>

      {/* CENTER: Desktop Navigation Links */}
      <ul className="hidden lg:flex items-center justify-center gap-4 flex-1">
        {navLinks.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`navbar-link text-[15px] font-semibold tracking-wide ${activeSection === link.href.substring(1)
                ? "active"
                : "text-gray-700 dark:text-gray-200"
                }`}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      {/* RIGHT: Desktop Actions */}
      <div className="hidden lg:flex items-center gap-4 shrink-0">
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer theme-btn text-amber-400 dark:text-amber-300 transition-all duration-300 hover:scale-110 hover:rotate-45"
        >
          {isDark ? <Moon size={20} fill="currentColor" /> : <Sun size={20} />}
        </button>

        {isLoggedIn ? (
          <Link to={dashboardRoute}>
            <SpecularButton
              size="md"
              radius={18}
              tint={isDark ? "#ffffff" : "#000000"}
              tintOpacity={0}
              blur={0}
              textColor={isDark ? "#f5f5f5" : "#1f2937"}
              lineColor={isDark ? "#ffffff" : "rgba(0, 0, 0, 0.2)"}
              baseColor={isDark ? "#525252" : "rgba(255, 255, 255, 0.6)"}
              intensity={1}
              shineSize={30}
              shineFade={40}
              thickness={1}
              speed={0.35}
              followMouse
              proximity={250}
              autoAnimate={false}
            >
              Dashboard
            </SpecularButton>
          </Link>
        ) : (
          <>
            <Link
              to="/login"
            >
              <SpecularButton
                size="md"
                radius={18}
                tint={isDark ? "#ffffff" : "#000000"}
                tintOpacity={0}
                blur={0}
                textColor={isDark ? "#f5f5f5" : "#1f2937"} /* White text in dark mode, dark gray in light mode */
                lineColor={isDark ? "#ffffff" : "rgba(0, 0, 0, 0.2)"} /* White border in dark mode, subtle gray in light mode */
                baseColor={isDark ? "#525252" : "rgba(255, 255, 255, 0.6)"} /* Your original dark base, semi-transparent white for light mode */
                intensity={1}
                shineSize={30}
                shineFade={40}
                thickness={1}
                speed={0.35}
                followMouse
                proximity={250}
                autoAnimate={false}
              >
                Login
              </SpecularButton>
            </Link>
            <Link
              to="/register"

            >
              <SpecularButton
                size="md"
                radius={18}
                tint={isDark ? "#ffffff" : "#000000"}
                tintOpacity={0}
                blur={0}
                textColor={isDark ? "#f5f5f5" : "#1f2937"} /* White text in dark mode, dark gray in light mode */
                lineColor={isDark ? "#ffffff" : "rgba(0, 0, 0, 0.2)"} /* White border in dark mode, subtle gray in light mode */
                baseColor={isDark ? "#525252" : "rgba(255, 255, 255, 0.6)"} /* Your original dark base, semi-transparent white for light mode */
                intensity={1}
                shineSize={30}
                shineFade={40}
                thickness={1}
                speed={0.35}
                followMouse
                proximity={250}
                autoAnimate={false}
              >
                Get register free
              </SpecularButton>
            </Link>
          </>
        )}
      </div>

      {/* MOBILE: Hamburger & Theme Toggle */}
      <div className="flex items-center gap-3 lg:hidden shrink-0">
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="flex items-center justify-center w-10 h-10 rounded-full theme-btn text-amber-400 dark:text-amber-300 transition-all duration-300 hover:scale-110 hover:rotate-45"
        >
          {isDark ? <Moon size={20} fill="currentColor" /> : <Sun size={20} />}
        </button>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Menu"
          className="text-gray-800 dark:text-white transition-transform duration-300 active:scale-90"
        >
          {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE: Slide-down Menu */}
      <div
        className={`absolute top-[calc(100%+12px)] left-0 right-0 w-full overflow-hidden transition-all duration-300 origin-top rounded-2xl navbar-glass ${isMobileOpen
          ? "opacity-100 scale-y-100 visible shadow-2xl"
          : "opacity-0 scale-y-95 invisible"
          }`}
      >
        <ul className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block w-full text-lg font-semibold transition-colors duration-300 ${activeSection === link.href.substring(1)
                  ? "text-cyan-500 dark:text-cyan-400"
                  : "text-gray-800 dark:text-gray-200"
                  }`}
              >
                {link.name}
              </a>
            </li>
          ))}

          <div className="w-full h-px my-2 bg-gray-300 dark:bg-gray-700/50"></div>

          {isLoggedIn ? (
            <Link
              to={dashboardRoute}
              className="flex justify-center w-full py-3 text-base font-bold text-white rounded-full bg-linear-to-r from-cyan-500 to-blue-600 shadow-[0_4px_14px_rgba(6,182,212,0.4)]"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="flex justify-center w-full py-3 text-base font-bold rounded-full border-2 border-gray-800 dark:border-white text-gray-800 dark:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex justify-center w-full py-3 text-base font-bold text-white rounded-full bg-linear-to-r from-blue-600 to-purple-600 shadow-lg"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
}
