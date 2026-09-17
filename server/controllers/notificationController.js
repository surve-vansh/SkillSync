const Notification = require("../models/Notification");

/* ─────────────────────────────────────────────────────────────
   Helper: create a notification (used internally by all controllers)
   targetRole: "student" | "mentor" | "admin" | null
   null = legacy / backward compat (shows in all role contexts)
   ───────────────────────────────────────────────────────────── */
const createNotification = async ({
    userId,
    title,
    message,
    type       = "System",
    link       = "",
    button     = "View",
    targetRole = null,
}) => {
    try {
        await Notification.create({ user: userId, title, message, type, link, button, targetRole });
    } catch (err) {
        console.error("createNotification error:", err.message);
    }
};

/* Build role-aware Mongo query. Role filter includes:
   - exact targetRole match (e.g. "mentor")
   - null targetRole (legacy notifications visible in all contexts)
   - missing targetRole field (older docs before schema update)  */
const roleQuery = (userId, role) => {
    const q = { user: userId };
    if (role) {
        q.$or = [
            { targetRole: role },
            { targetRole: null },
            { targetRole: { $exists: false } },
        ];
    }
    return q;
};

/* ─────────────────────────────────────────────────────────────
   GET /api/notifications?role=student|mentor|admin
   ───────────────────────────────────────────────────────────── */
const getMyNotifications = async (req, res) => {
    try {
        const query      = roleQuery(req.user._id, req.query.role);
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50);
        const unreadCount   = await Notification.countDocuments({ ...query, isRead: false });
        res.status(200).json({ success: true, notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ── PUT /api/notifications/:id/read ── */
const markAsRead = async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isRead: true }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ── PUT /api/notifications/read-all?role= ── */
const markAllRead = async (req, res) => {
    try {
        const q = { ...roleQuery(req.user._id, req.query.role), isRead: false };
        await Notification.updateMany(q, { isRead: true });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ── GET /api/notifications/unread-count?role= ── */
const getUnreadCount = async (req, res) => {
    try {
        const q     = { ...roleQuery(req.user._id, req.query.role), isRead: false };
        const count = await Notification.countDocuments(q);
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ── DELETE /api/notifications/:id ── */
const deleteNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createNotification,
    getMyNotifications,
    markAsRead,
    markAllRead,
    getUnreadCount,
    deleteNotification,
};
