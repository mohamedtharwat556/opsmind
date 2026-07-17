import React, { useState } from 'react';
import './CalendarView.css';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 20));
  const [events] = useState([
    {
      date: '2024-01-20',
      title: 'مراجعة المشكلة #407',
      type: 'review',
      priority: 'عالية'
    },
    {
      date: '2024-01-22',
      title: 'موعد نهائي: تسليم الحل',
      type: 'deadline',
      priority: 'حرجة'
    },
    {
      date: '2024-01-25',
      title: 'اجتماع فريق الهندسة',
      type: 'meeting',
      priority: 'متوسطة'
    }
  ]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="calendar-view">
      <h1>عرض التقويم 📅</h1>

      {/* Calendar Header */}
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-btn">←</button>
        <div className="month-year">
          <h2>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={handleToday} className="today-btn">اليوم</button>
        </div>
        <button onClick={handleNextMonth} className="nav-btn">→</button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        <div className="calendar">
          {/* Day Headers */}
          <div className="calendar-row header">
            {dayNames.map(day => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          {[...Array(Math.ceil(days.length / 7))].map((_, weekIdx) => (
            <div key={weekIdx} className="calendar-row">
              {days.slice(weekIdx * 7, (weekIdx + 1) * 7).map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className={`calendar-day ${day ? 'active' : 'empty'} ${
                    day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? 'today' : ''
                  }`}
                >
                  {day && (
                    <>
                      <div className="day-number">{day}</div>
                      <div className="day-events">
                        {getEventsForDate(day).map((event, idx) => (
                          <div key={idx} className={`event-dot ${event.type}`} title={event.title} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="calendar-sidebar">
          <h3>الأحداث القادمة</h3>
          <div className="events-list">
            {events.length === 0 ? (
              <p className="no-events">لا توجد أحداث</p>
            ) : (
              events
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((event, idx) => (
                  <div key={idx} className={`event-item ${event.type}`}>
                    <div className="event-icon">
                      {event.type === 'deadline' && '⏰'}
                      {event.type === 'meeting' && '👥'}
                      {event.type === 'review' && '👁️'}
                      {event.type === 'other' && '📌'}
                    </div>
                    <div className="event-details">
                      <h4>{event.title}</h4>
                      <p className="event-date">{event.date}</p>
                      <span className={`event-priority ${getPriorityClass(event.priority)}`}>
                        {event.priority}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            <h4>المفتاح</h4>
            <div className="legend-items">
              <div className="legend-item">
                <span className="event-dot deadline"></span>
                <span>تاريخ نهائي</span>
              </div>
              <div className="legend-item">
                <span className="event-dot meeting"></span>
                <span>اجتماع</span>
              </div>
              <div className="legend-item">
                <span className="event-dot review"></span>
                <span>مراجعة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPriorityClass(priority) {
  const classes = {
    'عالية': 'high',
    'حرجة': 'critical',
    'متوسطة': 'medium',
    'منخفضة': 'low'
  };
  return classes[priority] || 'medium';
}
