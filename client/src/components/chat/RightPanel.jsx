import { RiGiftLine } from "react-icons/ri";

const RightPanel = ({ conversation, currentUserId }) => {
  if (!conversation) {
    return (
      <div className="chat-right-panel" style={{ padding: "1.25rem", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        <p>Select a conversation to view details</p>
      </div>
    );
  }

  const getOther = (conv, myId) => {
    return conv.student._id === myId ? conv.mentor : conv.student;
  };

  const otherPerson = getOther(conversation, currentUserId);

  return (
    <div className="chat-right-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
      
      {/* Profile Info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <div style={{ position: "relative", marginBottom: '1rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: "9999px",
            background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: "2rem",
          }}>
            {otherPerson?.name?.charAt(0)?.toUpperCase()}
          </div>
          <span className="chat-online-dot" style={{ width: 16, height: 16, bottom: 4, right: 4 }} />
        </div>
        
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>{otherPerson?.name}</h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
          {otherPerson?.isMentor ? 'Mentor' : 'Student'}
        </p>
        
        {otherPerson?.skills_offered && otherPerson.skills_offered.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {otherPerson.skills_offered.slice(0, 3).map((skill, i) => (
              <span key={i} style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', border: '1px solid rgba(139,92,246,0.2)' }}>
                {skill.name || skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }}></div>

      {/* Invite card */}
      <div className="chat-invite-card">
        <RiGiftLine size={22} style={{ color: "#a78bfa" }} />
        <p className="chat-invite-title">Invite &amp; Earn</p>
        <p className="chat-invite-desc">Invite your friends and earn Skill Coins!</p>
        <button className="btn-primary" style={{ width: "100%", marginTop: "0.75rem", justifyContent: "center", padding: "0.5rem" }}>
          Invite Now
        </button>
      </div>
    </div>
  );
};

export default RightPanel;


