import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { RiExchangeLine } from "react-icons/ri";
import "./LogoutModal.css"; // reuse existing modal CSS

/**
 * SwitchRoleModal
 * Props:
 *   isOpen       – boolean
 *   currentRole  – "student" | "mentor"
 *   onCancel     – fn()
 *   onConfirm    – fn()   called after user clicks "Switch"
 */
const SwitchRoleModal = ({ isOpen, currentRole, onCancel, onConfirm }) => {
  const confirmRef = useRef(null);

  /* Auto-focus confirm button + handle Enter/Escape while open */
  useEffect(() => {
    if (!isOpen) return;
    confirmRef.current?.focus();
    const handler = (e) => {
      if (e.key === "Enter")  { e.preventDefault(); onConfirm(); }
      if (e.key === "Escape") { e.preventDefault(); onCancel();  }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  const targetRole   = currentRole === "student" ? "Mentor" : "Student";
  const currentLabel = currentRole === "student" ? "Student" : "Mentor";

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
        aria-labelledby="switch-role-title"
      >
        {/* Icon — reuse logout-modal-icon but override colour inline */}
        <div
          className="logout-modal-icon"
          style={{
            background: "rgba(124, 58, 237, 0.12)",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            color: "#a78bfa",
          }}
        >
          <RiExchangeLine />
        </div>

        <h2 id="switch-role-title">Switch Role?</h2>
        <p>
          You are currently in <strong>{currentLabel} mode</strong>.<br />
          Do you want to switch to <strong>{targetRole} mode</strong>?
        </p>

        <div className="logout-modal-actions">
          <button
            type="button"
            className="logout-cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="logout-confirm-btn"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}
            onClick={onConfirm}
          >
            <RiExchangeLine />
            Switch
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SwitchRoleModal;
