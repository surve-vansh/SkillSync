import { useState } from 'react';
import { RiSearchLine, RiEditLine } from "react-icons/ri";

const ConversationsPanel = ({ conversations, activeId, onSelect, currentUserId, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getOther = (conv, myId) => {
    return conv.student._id === myId ? conv.mentor : conv.student;
  };

  const filteredConversations = conversations?.filter(c => {
    const other = getOther(c, currentUserId);
    return other?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="chat-conversations-panel">
      <div className="chat-conv-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 className="chat-conv-title">Messages</h2>
          <button className="btn-primary" style={{ width: 32, height: 32, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
            <RiEditLine size={16} />
          </button>
        </div>

        <div style={{ position: "relative", marginTop: "1rem" }}>
          <RiSearchLine size={16} className="chat-search-icon" />
          <input
            placeholder="Search conversations..."
            className="chat-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
        {loading ? (
          <div style={{ padding: "1rem", textAlign: "center", color: "#94a3b8" }}>Loading...</div>
        ) : filteredConversations.length === 0 ? (
          <div style={{ padding: "1rem", textAlign: "center", color: "#94a3b8" }}>No conversations found</div>
        ) : (
          filteredConversations.map((c) => {
            const isActive = c._id === activeId;
            const other = getOther(c, currentUserId);
            const myUnread = c.student._id === currentUserId ? c.studentUnread : c.mentorUnread;

            return (
              <div
                key={c._id}
                onClick={() => onSelect(c._id)}
                className={`chat-conv-item${isActive ? " active" : ""}`}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "9999px",
                    background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: "0.875rem",
                  }}>
                    {other?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  {myUnread > 0 && (
                    <span className="chat-online-dot" style={{ backgroundColor: '#ef4444' }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="chat-conv-name">{other?.name}</p>
                    <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{formatTime(c.lastMessageAt)}</span>
                  </div>
                  <p className="chat-conv-preview" style={{ fontWeight: myUnread > 0 ? '700' : 'normal', color: myUnread > 0 ? '#f8fafc' : undefined }}>
                    {c.lastMessage || 'Start a conversation'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationsPanel;

