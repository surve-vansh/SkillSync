import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import "./LogoutModal.css";


const LogoutModal = ({ isOpen, onCancel, onConfirm, userName }) => {
  const confirmRef = useRef(null);

  /* Auto-focus confirm button + handle Enter/Escape while open */
  useEffect(() => {
    if (!isOpen) return;
    // Move focus to the confirm button so Enter immediately works
    confirmRef.current?.focus();
    const handler = (e) => {
      if (e.key === "Enter")  { e.preventDefault(); onConfirm(); }
      if (e.key === "Escape") { e.preventDefault(); onCancel();  }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="logout-modal-backdrop"
      onClick={onCancel}           
    >
      <div
        className="logout-modal"
        onClick={(e) => e.stopPropagation()}   
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        <div className="logout-modal-icon">
          <RiLogoutBoxLine />
        </div>

        <h2 id="logout-modal-title">Logout?</h2>
        <p>
          {userName
            ? `Hey ${userName.split(" ")[0]}, are you sure you want to log out of SkillSync?`
            : "Are you sure you want to log out of SkillSync?"}
        </p>

        {/* Buttons */}
        <div className="logout-modal-actions">
          <button
            type="button"
            className="logout-cancel-btn"
            onClick={onCancel}
          >
            Stay
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="logout-confirm-btn"
            onClick={onConfirm}
          >
            <RiLogoutBoxLine />
            Yes, Logout
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutModal;



