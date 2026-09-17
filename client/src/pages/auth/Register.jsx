import LightBanner from "../../assets/LightBannerRegistration.png";
import DarkBanner from "../../assets/DarkBannerRegistration.jpeg";
import RegisterForm from "../../components/landing/RegisterForm";


const CreateAccount = () => {
  return (
    <>
    {/* <Navbar /> */}
    <div className="flex min-h-screen">
      {/* Register Form */}
      <div className="flex items-center justify-center w-full px-8 py-4  bg-white dark:bg-slate-900 lg:w-1/2">
        <RegisterForm />
      </div>

      {/* Register Banner */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-white dark:bg-[#0B1120]">
        <img
          src={LightBanner}
          alt="Light Banner"
          className="block dark:hidden w-full h-full object-contain"
        />

        <img
          src={DarkBanner}
          alt="Dark Banner"
          className="hidden dark:block w-full h-full object-contain"
        />
      </div>
    </div>
    </>

  );
};

export default CreateAccount;

