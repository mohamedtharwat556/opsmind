/**
 * Analytics Utilities - تتبع الأحداث والأخطاء
 */

class Analytics {
  constructor() {
    this.events = [];
    this.errors = [];
    this.pageViews = [];
    this.sessionStart = Date.now();
    this.userId = this.getUserId();
  }

  getUserId() {
    let userId = localStorage.getItem('analyticsUserId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('analyticsUserId', userId);
    }
    return userId;
  }

  /**
   * Track Page View
   */
  pageView(pageName, metadata = {}) {
    const pageViewData = {
      id: this.pageViews.length + 1,
      userId: this.userId,
      pageName,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.sessionStart,
      metadata
    };

    this.pageViews.push(pageViewData);
    console.log(`📊 Page View: ${pageName}`, pageViewData);

    // Send to backend (optional)
    this.sendToBackend('pageView', pageViewData);

    return pageViewData;
  }

  /**
   * Track Event
   */
  event(eventName, eventData = {}, category = 'general') {
    const event = {
      id: this.events.length + 1,
      userId: this.userId,
      eventName,
      category,
      timestamp: new Date().toISOString(),
      data: eventData
    };

    this.events.push(event);
    console.log(`📌 Event: ${eventName}`, event);

    // Send to backend
    this.sendToBackend('event', event);

    return event;
  }

  /**
   * Track Error
   */
  error(errorMessage, errorDetails = {}, severity = 'error') {
    const errorLog = {
      id: this.errors.length + 1,
      userId: this.userId,
      errorMessage,
      severity,
      timestamp: new Date().toISOString(),
      details: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...errorDetails
      }
    };

    this.errors.push(errorLog);
    console.error(`❌ Error Tracked: ${errorMessage}`, errorLog);

    // Send to backend
    this.sendToBackend('error', errorLog);

    return errorLog;
  }

  /**
   * Track Performance
   */
  performance(metricName, duration, metadata = {}) {
    const metric = {
      id: Date.now(),
      userId: this.userId,
      metricName,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      metadata
    };

    console.log(`⚡ Performance: ${metricName} (${duration}ms)`, metric);

    // Send to backend
    this.sendToBackend('performance', metric);

    return metric;
  }

  /**
   * Track User Action
   */
  userAction(actionName, actionDetails = {}) {
    return this.event(`user_${actionName}`, actionDetails, 'user_action');
  }

  /**
   * Get Analytics Summary
   */
  getSummary() {
    return {
      userId: this.userId,
      sessionDuration: Date.now() - this.sessionStart,
      pageViewCount: this.pageViews.length,
      eventCount: this.events.length,
      errorCount: this.errors.length,
      mostVisitedPages: this.getMostVisitedPages(),
      topEvents: this.getTopEvents(),
      errorsSummary: this.getErrorsSummary()
    };
  }

  getMostVisitedPages() {
    const pageCount = {};
    this.pageViews.forEach(pv => {
      pageCount[pv.pageName] = (pageCount[pv.pageName] || 0) + 1;
    });

    return Object.entries(pageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }));
  }

  getTopEvents() {
    const eventCount = {};
    this.events.forEach(e => {
      eventCount[e.eventName] = (eventCount[e.eventName] || 0) + 1;
    });

    return Object.entries(eventCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([event, count]) => ({ event, count }));
  }

  getErrorsSummary() {
    const severities = {};
    this.errors.forEach(err => {
      severities[err.severity] = (severities[err.severity] || 0) + 1;
    });
    return severities;
  }

  /**
   * Send to Backend
   */
  async sendToBackend(type, data) {
    try {
      // يمكن تفعيل هذا لاحقاً
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type, data })
      // });
    } catch (error) {
      console.error('Analytics send error:', error);
    }
  }

  /**
   * Export Analytics Data
   */
  exportData() {
    return {
      pageViews: this.pageViews,
      events: this.events,
      errors: this.errors,
      summary: this.getSummary()
    };
  }

  /**
   * Clear Analytics
   */
  clear() {
    this.events = [];
    this.errors = [];
    this.pageViews = [];
  }
}

// Singleton instance
export const analytics = new Analytics();

// React Hook for Analytics
export const useAnalytics = () => {
  return {
    pageView: (name, meta) => analytics.pageView(name, meta),
    event: (name, data, category) => analytics.event(name, data, category),
    error: (msg, details, severity) => analytics.error(msg, details, severity),
    performance: (name, duration, meta) => analytics.performance(name, duration, meta),
    userAction: (name, details) => analytics.userAction(name, details)
  };
};

export default analytics;
