import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import './NotificationsBell.css';

export default function NotificationsBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    notifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    getUnreadNotifications
  } = useNotifications();

  const unreadCount = getUnreadCount();
  const unreadNotifications = getUnreadNotifications();

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'new_case': '⚠️',
      'case_resolved': '✅',
      'case_updated': '📝',
      'announcement': '📢',
      'article': '📚',
      'reminder': '🔔',
      'permission_change': '🔐',
      'comment': '💬',
      'rating': '⭐'
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      'new_case': '#DC2626',
      'case_resolved': '#10B981',
      'case_updated': '#F59E0B',
      'announcement': '#2563EB',
      'article': '#8B5CF6',
      'reminder': '#EC4899',
      'permission_change': '#7C3AED',
      'comment': '#06B6D4',
      'rating': '#F97316'
    };
    return colors[type] || '#64748B';
  };

  return (
    <div className="notifications-bell" ref={dropdownRef}>
      <button
        className="bell-button"
        onClick={() => setIsOpen(!isOpen)}
        title="الإشعارات"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h3>الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read"
                onClick={markAllAsRead}
                title="تحديد الكل كمقروء"
              >
                ✓ تحديد الكل
              </button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>لا توجد إشعارات</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    borderLeftColor: getNotificationColor(notification.type)
                  }}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <small>{getTimeAgo(notification.timestamp)}</small>
                  </div>
                  <button
                    className="close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    title="حذف"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 10 && (
            <div className="dropdown-footer">
              <a href="/user/notifications">عرض جميع الإشعارات</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const diff = now - new Date(timestamp);
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} د`;
  if (hours < 24) return `منذ ${hours} س`;
  if (days < 7) return `منذ ${days} ي`;
  
  return new Date(timestamp).toLocaleDateString('ar-EG');
}
