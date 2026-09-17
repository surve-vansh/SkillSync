import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { HashLink } from "react-router-hash-link";
import {
  FaInstagram,
  FaLinkedin,
  FaDiscord,
  FaGithub,
} from "react-icons/fa";
import logo from "../../assets/Logo.png";
// import GradientWaves from "./GradientWaves";

const Footer = () => {
  const { isDark } = useTheme();
  return (
    <div className={`relative w-full min-h-[500px] overflow-hidden ${isDark ? "bg-[#08081a]" : "bg-white"}`}>

      {/* ── Wave-like animated glow orbs — stays in place, sways gently ── */}
      {isDark && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          {/* Centre orb — large, main glow */}
          <div style={{
            position: "absolute", left: "50%", bottom: "-60px",
            width: "700px", height: "380px",
            marginLeft: "-350px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(82,39,255,0.6) 0%, rgba(82,39,255,0.22) 45%, transparent 72%)",
            filter: "blur(22px)",
            animation: "footerWave1 7s ease-in-out infinite",
          }} />
          {/* Left orb — slow sway */}
          <div style={{
            position: "absolute", left: "8%", bottom: "-30px",
            width: "320px", height: "240px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(120,50,255,0.38) 0%, transparent 72%)",
            filter: "blur(28px)",
            animation: "footerWave2 9s ease-in-out infinite",
          }} />
          {/* Right orb — opposite phase */}
          <div style={{
            position: "absolute", right: "8%", bottom: "-20px",
            width: "280px", height: "220px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(100,30,230,0.32) 0%, transparent 72%)",
            filter: "blur(24px)",
            animation: "footerWave3 11s ease-in-out infinite",
          }} />
          {/* Far-left faint accent */}
          <div style={{
            position: "absolute", left: "-5%", bottom: "20px",
            width: "180px", height: "160px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(80,20,200,0.22) 0%, transparent 70%)",
            filter: "blur(30px)",
            animation: "footerWave2 13s ease-in-out infinite reverse",
          }} />
        </div>
      )}

      <style>{`
        @keyframes footerWave1 {
          0%,100% { transform: translateY(0px) scaleX(1);   opacity: 0.82; }
          33%      { transform: translateY(-18px) scaleX(1.04); opacity: 1;    }
          66%      { transform: translateY(-8px) scaleX(0.97); opacity: 0.9;  }
        }
        @keyframes footerWave2 {
          0%,100% { transform: translateY(0px) translateX(0px);   opacity: 0.7; }
          40%      { transform: translateY(-22px) translateX(12px); opacity: 1;   }
          75%      { transform: translateY(-10px) translateX(-6px); opacity: 0.8; }
        }
        @keyframes footerWave3 {
          0%,100% { transform: translateY(0px) translateX(0px);    opacity: 0.65; }
          30%      { transform: translateY(-14px) translateX(-10px); opacity: 0.9;  }
          70%      { transform: translateY(-24px) translateX(8px);  opacity: 1;    }
        }
      `}</style>

      <div className="absolute inset-0 z-10 flex items-end">
        <footer
          className={`w-full border-t transition-all duration-300 ${isDark
            ? "bg-[#08081a] border-slate-800"
            : "bg-white border-slate-200"
            }`}
        >

          {/* <div className="absolute inset-0 opacity-40">
            <GradientWaves
              lineColor="#8b5cf6"
              backgroundColor="transparent"
              waveSpeedX={0.015}
              waveSpeedY={0.008}
              waveAmpX={35}
              waveAmpY={20}
            />
          </div> */}
          <div className="px-6 mx-auto max-w-7xl py-14">

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">

              {/* Logo */}
              <div className="lg:col-span-2">
                <img
                  src={logo}
                  alt="SkillSync"
                  className="object-contain h-14"
                />

                <p className="max-w-sm mt-5 leading-7 text-slate-600 dark:text-slate-400">
                  Trade skills, build meaningful connections and grow together with
                  students across colleges.
                </p>

                {/* <div className="flex gap-4 mt-6">

                <a
                  href="#"
                  className="flex items-center justify-center transition rounded-full w-11 h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-violet-600 hover:text-white"
                >
                  <FaInstagram />
                </a>

                <a
                  href="#"
                  className="flex items-center justify-center transition rounded-full w-11 h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-violet-600 hover:text-white"
                >
                  <FaLinkedin />
                </a>

                <a
                  href="#"
                  className="flex items-center justify-center transition rounded-full w-11 h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-violet-600 hover:text-white"
                >
                  <FaGithub />
                </a>

                <a
                  href="#"
                  className="flex items-center justify-center transition rounded-full w-11 h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-violet-600 hover:text-white"
                >
                  <FaDiscord />
                </a>

              </div> */}
              </div>

              {/* Platform */}
              <div>
                <h3 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Platform
                </h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li>
                    <HashLink smooth to="/#skills" className="transition hover:text-cyan-500 dark:hover:text-cyan-400">
                      Browse Skills
                    </HashLink>
                  </li>
                  <li>
                    <HashLink smooth to="/#how-it-works" className="transition hover:text-cyan-500 dark:hover:text-cyan-400">
                      How It Works
                    </HashLink>
                  </li>
                  <li>
                    <HashLink smooth to="/#success-story" className="transition hover:text-cyan-500 dark:hover:text-cyan-400">
                      Success Stories
                    </HashLink>
                  </li>
                  <li>
                    <Link to="/register" className="transition hover:text-cyan-500 dark:hover:text-cyan-400">
                      Find Mentors
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Support
                </h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li>
                    <HashLink smooth to="/#FAQ" className="transition hover:text-cyan-500 dark:hover:text-cyan-400">
                      FAQs
                    </HashLink>
                  </li>
                  <li>
                    <HashLink smooth to="/#contact" className="transition hover:text-cyan-500 dark:hover:text-cyan-400">
                      Contact Us
                    </HashLink>
                  </li>
                  <li>
                    <HashLink smooth to="/#about" className="transition hover:text-cyan-500 dark:hover:text-cyan-400">
                      About SkillSync
                    </HashLink>
                  </li>
                </ul>
              </div>

              {/* Get Started */}
              <div>
                <h3 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Get Started
                </h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li>
                    <Link to="/login" className="transition hover:text-cyan-500 dark:hover:text-cyan-400">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="transition hover:text-cyan-500 dark:hover:text-cyan-400">
                      Create Account
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="transition hover:text-cyan-500 dark:hover:text-cyan-400">
                      Become a Mentor
                    </Link>
                  </li>
                </ul>
              </div>

            </div>

            <div className="pt-8 mt-12 border-t border-slate-800">

              <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row text-slate-400">

                <p>
                  © 2026 SkillSync. All Rights Reserved.
                </p>



              </div>

            </div>

          </div>
        </footer>
      </div>
    </div>
  );
};


export default Footer