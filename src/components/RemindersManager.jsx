import React, { useState } from 'react';
import './RemindersManager.css';

export default function RemindersManager() {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'تابع المشكلة #407',
      dueDate: '2024-01-22T09:00:00Z',
      priority: 'عالية',
      completed: false,
      type: 'case'
    }
  ]);

  const [newReminder, setNewReminder] = useState({
    title: '',
    dueDate: '',
    priority: 'عادية'
  });

  const addReminder = () => {
    if (newReminder.title && newReminder.dueDate) {
      setReminders([
        {
          id: Date.now(),
          ...newReminder,
          completed: false
        },
        ...reminders
      ]);
      setNewReminder({ title: '', dueDate: '', priority: 'عادية' });
    }
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'عالية': '#DC2626',
      'متوسطة': '#F59E0B',
      'عادية': '#3B82F6'
    };
    return colors[priority] || '#3B82F6';
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="reminders-manager">
      <h3>نظام التذكيرات ⏰</h3>

      {/* Add New Reminder */}
      <div className="add-reminder">
        <input
          type="text"
          placeholder="عنوان التذكير..."
          value={newReminder.title}
          onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newReminder.dueDate}
          onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
        />
        <select
          value={newReminder.priority}
          onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value })}
        >
          <option>عالية</option>
          <option>متوسطة</option>
          <option>عادية</option>
        </select>
        <button onClick={addReminder}>إضافة تذكير</button>
      </div>

      {/* Reminders List */}
      <div className="reminders-list">
        {reminders.length === 0 ? (
          <p className="no-reminders">لا توجد تذكيرات</p>
        ) : (
          reminders.map(reminder => (
            <div
              key={reminder.id}
              className={`reminder-item ${reminder.completed ? 'completed' : ''} ${
                isOverdue(reminder.dueDate) && !reminder.completed ? 'overdue' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={reminder.completed}
                onChange={() => toggleReminder(reminder.id)}
              />
              <div className="reminder-content">
                <h4>{reminder.title}</h4>
                <div className="reminder-meta">
                  <span
                    className="priority"
                    style={{ backgroundColor: getPriorityColor(reminder.priority) }}
                  >
                    {reminder.priority}
                  </span>
                  <span className="due-date">
                    📅 {formatDate(reminder.dueDate)}
                  </span>
                </div>
              </div>
              <button
                className="delete-reminder"
                onClick={() => deleteReminder(reminder.id)}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* Upcoming Reminders */}
      {reminders.filter(r => !r.completed).length > 0 && (
        <div className="upcoming-reminders">
          <h4>القادم قريباً:</h4>
          <ul>
            {reminders
              .filter(r => !r.completed)
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 3)
              .map(r => (
                <li key={r.id}>
                  <span className="icon">📍</span>
                  {r.title} - {formatDateShort(r.dueDate)}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateShort(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `بعد ${days} أيام`;
  if (hours > 0) return `بعد ${hours} ساعات`;
  return 'قريباً جداً';
}
