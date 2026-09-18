import "../../styles/Mentor/Earnings.css";

import {
  RiArrowUpLine,
} from "react-icons/ri";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const trendData = [
  { name: "T1", coins: 100 },
  { name: "T2", coins: 150 },
  { name: "T3", coins: 120 },
  { name: "T4", coins: 200 },
  { name: "T5", coins: 180 },
  { name: "T6", coins: 250 },
];

const earningHistory = [
  {
    id: 1,
    emoji: "🎁",
    title: "Welcome Bonus",
    desc: "Welcome to SkillSync!",
    date: "7/22/2026",
    amount: "+100",
    type: "credit",
  },
  {
    id: 2,
    emoji: "📚",
    title: "Session Completed",
    desc: "React Development · Rahul Sharma",
    date: "8/01/2026",
    amount: "+80",
    type: "credit",
  },
  {
    id: 3,
    emoji: "⭐",
    title: "Review Bonus",
    desc: "5-Star review received",
    date: "8/05/2026",
    amount: "+20",
    type: "credit",
  },
  {
    id: 4,
    emoji: "📚",
    title: "Session Completed",
    desc: "Node.js Basics · Karan Mehta",
    date: "8/10/2026",
    amount: "+80",
    type: "credit",
  },
  {
    id: 5,
    emoji: "🔄",
    title: "Coins Transferred",
    desc: "Transfer to wallet",
    date: "8/12/2026",
    amount: "−30",
    type: "debit",
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="earnings-tooltip">
        <p>{payload[0].payload.name}</p>
        <span>🪙 {payload[0].value} Coins</span>
      </div>
    );
  }
  return null;
};

const MentorEarnings = () => {
  return (
    <div className="mentor-earnings-page">

      {/* ── HEADER ── */}
      <div className="earnings-topbar">
        <div>
          <h1>🪙 My Earnings</h1>
          <p>Your Skill Coin earning history</p>
        </div>
      </div>

      {/* ── BALANCE CARD ── */}
      <div className="earnings-balance-card">
        <div className="earnings-balance-label">Current Balance</div>
        <div className="earnings-balance-row">
          <span className="earnings-coin-icon">🪙</span>
          <span className="earnings-balance-amount">1,250</span>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="earnings-stats">

        <div className="earnings-stat-card">
          <div className="earnings-stat-value">
            <span>+100</span>
            <span className="stat-coin">🪙</span>
          </div>
          <div className="earnings-stat-label">All Time</div>
        </div>

        <div className="earnings-stat-card">
          <div className="earnings-stat-value">
            <span>+100</span>
            <span className="stat-coin">🪙</span>
          </div>
          <div className="earnings-stat-label">This Month</div>
        </div>

        <div className="earnings-stat-card">
          <div className="earnings-stat-value">
            <span>+0</span>
            <span className="stat-coin">🪙</span>
          </div>
          <div className="earnings-stat-label">This Week</div>
        </div>

      </div>

      {/* ── EARNINGS TREND ── */}
      <div className="earnings-trend-card">
        <div className="earnings-card-title">📈 Earnings Trend</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(139,92,246,0.2)" }} />
            <Line
              type="monotone"
              dataKey="coins"
              stroke="#fbbf24"
              strokeWidth={2.5}
              dot={{ fill: "#fbbf24", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "#fbbf24" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── EARNING HISTORY ── */}
      <div className="earnings-history-card">
        <div className="earnings-card-title">💰 Earning History</div>
        <div className="earnings-history-list">
          {earningHistory.map((item) => (
            <div key={item.id} className="earnings-history-item">
              <div className={`history-icon-wrap${item.type === "debit" ? " debit" : ""}`}>
                {item.type === "credit" ? <RiArrowUpLine /> : "↓"}
              </div>
              <div className="history-info">
                <h4>{item.emoji} {item.title}</h4>
                <span>{item.desc}<br />{item.date}</span>
              </div>
              <div className={`history-amount${item.type === "debit" ? " debit" : ""}`}>
                {item.amount}
                <span className="h-coin">🪙</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MentorEarnings;


