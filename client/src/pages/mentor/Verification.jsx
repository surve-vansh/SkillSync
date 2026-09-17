import "../../styles/Mentor/Verification.css";
import { RiCheckLine } from "react-icons/ri";

const benefits = [
  "Verified badge on your profile",
  "Priority placement in mentor listings",
  "Increased trust from students",
  "Access to premium student requests",
  "Mentor of the Month eligibility",
  "SkillSync Certified certificate",
];

const MentorVerification = () => {
  return (
    <div className="mentor-verification-page">

      <div className="verified-main-card">

        {/* Big checkmark icon */}
        <div className="verified-icon-wrap">
          <RiCheckLine />
        </div>

        {/* Title */}
        <h2 className="verified-title">Verified Mentor!</h2>

        {/* Subtitle */}
        <p className="verified-subtitle">
          Your profile has been verified by the SkillSync team. You now have access to
          all premium mentor features.
        </p>

        {/* Benefits grid */}
        <div className="verified-benefits-grid">
          {benefits.map((benefit) => (
            <div key={benefit} className="verified-benefit-item">
              <RiCheckLine />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default MentorVerification;
