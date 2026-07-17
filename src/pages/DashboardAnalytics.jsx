import React, { useState, useEffect } from 'react';
import './DashboardAnalytics.css';

export default function DashboardAnalytics() {
  const [stats, setStats] = useState({
    totalCases: 45,
    resolvedCases: 28,
    openCases: 12,
    inProgressCases: 5,
    avgResolutionTime: '2.4h',
    totalUsers: 8,
    activeUsers: 7,
    departmentCount: 5
  });

  const [chartData] = useState([
    { week: 'أسبوع 1', cases: 12, resolved: 8 },
    { week: 'أسبوع 2', cases: 15, resolved: 10 },
    { week: 'أسبوع 3', cases: 18, resolved: 14 },
    { week: 'أسبوع 4', cases: 22, resolved: 18 }
  ]);

  const [departmentStats] = useState([
    { name: 'الهندسة', cases: 28, resolution: '2.1h' },
    { name: 'الدعم الفني', cases: 12, resolution: '3.2h' },
    { name: 'الموارد البشرية', cases: 3, resolution: '1.5h' },
    { name: 'إدارة المنتج', cases: 2, resolution: '2.8h' }
  ]);

  return (
    <div className="dashboard-analytics">
      <h1>لوحة التحليلات والإحصائيات 📊</h1>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="إجمالي المشاكل"
          value={stats.totalCases}
          icon="📋"
          color="#2563EB"
          trend="+12%"
        />
        <MetricCard
          title="تم حلها"
          value={stats.resolvedCases}
          icon="✅"
          color="#10B981"
          trend="+8%"
        />
        <MetricCard
          title="مفتوحة"
          value={stats.openCases}
          icon="🔴"
          color="#DC2626"
          trend="-3%"
        />
        <MetricCard
          title="قيد المعالجة"
          value={stats.inProgressCases}
          icon="⏳"
          color="#F59E0B"
          trend="+1"
        />
        <MetricCard
          title="متوسط الحل"
          value={stats.avgResolutionTime}
          icon="⏱️"
          color="#8B5CF6"
          trend="-15m"
        />
        <MetricCard
          title="الموظفون النشطون"
          value={`${stats.activeUsers}/${stats.totalUsers}`}
          icon="👥"
          color="#06B6D4"
          trend="+1"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Weekly Trend */}
        <div className="chart-card">
          <h3>الاتجاه الأسبوعي</h3>
          <div className="chart">
            {chartData.map((data, idx) => (
              <div key={idx} className="chart-bar-group">
                <div className="bar-group">
                  <div
                    className="bar cases"
                    style={{
                      height: `${(data.cases / 25) * 100}%`
                    }}
                    title={`المشاكل: ${data.cases}`}
                  />
                  <div
                    className="bar resolved"
                    style={{
                      height: `${(data.resolved / 20) * 100}%`
                    }}
                    title={`محلول: ${data.resolved}`}
                  />
                </div>
                <span className="week-label">{data.week}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span className="legend-item cases">
              <span className="legend-color"></span>
              المشاكل
            </span>
            <span className="legend-item resolved">
              <span className="legend-color"></span>
              محلول
            </span>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="chart-card">
          <h3>توزيع الحالة</h3>
          <div className="pie-chart">
            <div
              className="pie-segment"
              style={{
                background: `conic-gradient(#10B981 0deg ${
                  (stats.resolvedCases / stats.totalCases) * 360
                }deg, #F59E0B ${
                  (stats.resolvedCases / stats.totalCases) * 360
                }deg ${
                  ((stats.resolvedCases + stats.inProgressCases) / stats.totalCases) * 360
                }deg, #DC2626 ${
                  ((stats.resolvedCases + stats.inProgressCases) / stats.totalCases) * 360
                }deg)`
              }}
            >
              <div className="pie-center">
                <span className="pie-value">{stats.totalCases}</span>
                <span className="pie-label">إجمالي</span>
              </div>
            </div>
            <div className="pie-legend">
              <div className="pie-item">
                <span className="color resolved"></span>
                <span>محلول ({stats.resolvedCases})</span>
              </div>
              <div className="pie-item">
                <span className="color progress"></span>
                <span>قيد المعالجة ({stats.inProgressCases})</span>
              </div>
              <div className="pie-item">
                <span className="color open"></span>
                <span>مفتوح ({stats.openCases})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="department-performance">
        <h3>أداء الأقسام</h3>
        <div className="department-table">
          <div className="table-header">
            <div className="col-name">القسم</div>
            <div className="col-cases">المشاكل</div>
            <div className="col-time">متوسط الحل</div>
            <div className="col-performance">الأداء</div>
          </div>
          {departmentStats.map((dept, idx) => (
            <div key={idx} className="table-row">
              <div className="col-name">{dept.name}</div>
              <div className="col-cases">
                <span className="badge">{dept.cases}</span>
              </div>
              <div className="col-time">{dept.resolution}</div>
              <div className="col-performance">
                <div className="performance-bar">
                  <div
                    className="performance-fill"
                    style={{
                      width: `${Math.random() * 40 + 60}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="top-performers">
        <h3>أفضل الموظفين</h3>
        <div className="performers-list">
          {[
            { name: 'محمد ثروت', solved: 12, points: 1250, icon: '🥇' },
            { name: 'استاذ ابراهيم', solved: 15, points: 1500, icon: '👑' },
            { name: 'عبدالله رضا', solved: 10, points: 980, icon: '🥈' }
          ].map((performer, idx) => (
            <div key={idx} className="performer-card">
              <span className="performer-icon">{performer.icon}</span>
              <div className="performer-info">
                <h4>{performer.name}</h4>
                <p>حل {performer.solved} مشكلة</p>
              </div>
              <div className="performer-points">{performer.points} نقطة</div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <button className="export-btn csv">📄 تصدير CSV</button>
        <button className="export-btn pdf">📋 تصدير PDF</button>
        <button className="export-btn print">🖨️ طباعة</button>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, trend }) {
  return (
    <div className="metric-card" style={{ borderLeftColor: color }}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <p className="metric-title">{title}</p>
        <p className="metric-value">{value}</p>
        <p className="metric-trend" style={{ color: trend.includes('-') ? '#DC2626' : '#10B981' }}>
          {trend}
        </p>
      </div>
    </div>
  );
}
