import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((
    message,
    type = 'info',
    duration = 4000,
    title = null
  ) => {
    const id = Date.now().toString();

    setToasts(prev => [...prev, {
      id,
      message,
      type,
      duration,
      title
    }]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = (message, title = '✅ نجح') => {
    return addToast(message, 'success', 3000, title);
  };

  const error = (message, title = '❌ خطأ') => {
    return addToast(message, 'error', 5000, title);
  };

  const warning = (message, title = '⚠️ تحذير') => {
    return addToast(message, 'warning', 4000, title);
  };

  const info = (message, title = 'ℹ️ معلومة') => {
    return addToast(message, 'info', 3000, title);
  };

  const showToast = (message, type = 'info') => {
    if (type === 'success') {
      return success(message);
    } else if (type === 'error') {
      return error(message);
    } else if (type === 'warning') {
      return warning(message);
    } else {
      return info(message);
    }
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    showToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastContext;
