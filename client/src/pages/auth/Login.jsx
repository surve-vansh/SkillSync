import React from "react";
import LightBanner from "../../assets/LightBanner.png";
import DarkBanner from "../../assets/DarkBanner.jpeg"
import LoginForm from "../../components/landing/LoginForm";
import Navbar from "../../components/landing/Navbar";
import Footer from "../../components/landing/Footer";

const Login = () => {
  return (
    <>
      {/* <Navbar /> */}
    
    <div className="flex min-h-screen overflow-hidden bg-white dark:bg-slate-900">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-white dark:bg-[#0B1120]">

        {/* Light Theme */}
        <img
          src={LightBanner}
          alt="Banner"
          className="block dark:hidden w-[95%] h-[95%] object-contain p-4"
          />

        {/* Dark Theme */}
        <img
          src={DarkBanner}
          alt="Banner"
          className="hidden dark:block w-[95%] h-[95%] object-contain p-4"
        />

      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center w-full lg:w-1/2 px-8 py-8 bg-white dark:bg-[#0F172A]">
        <LoginForm />
      </div>
    </div>
          </>
  );
};

export default Login;

