import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Bell, X, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

// Create Context for Notifications
export const NotificationContext = createContext(null);

// Icons mapping
const icons = {
  default: Bell,
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
};

const Notification = ({
  title = "New Message",
  body = "You have a new notification",
  data = null,
  onClose,
  type = "default",
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const entranceTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(entranceTimer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 400); // Match this with animation duration
  };

  const typeStyles = {
    default: {
      bg: "bg-white",
      icon: "text-blue-500 bg-blue-50",
      border: "border-gray-200",
    },
    success: {
      bg: "bg-white",
      icon: "text-green-500 bg-green-50",
      border: "border-green-100",
    },
    error: {
      bg: "bg-white",
      icon: "text-red-500 bg-red-50",
      border: "border-red-100",
    },
    warning: {
      bg: "bg-white",
      icon: "text-yellow-500 bg-yellow-50",
      border: "border-yellow-100",
    },
  };

  const styles = typeStyles[type];
  const Icon = icons[type];

  return (
    <div
      className={`
        w-80 z-50
        ${
          isExiting
            ? "animate-fadeOut"
            : isVisible
            ? "animate-fadeIn"
            : "opacity-0 translate-x-full"
        }
        transition-all duration-400
        ${styles.bg} border ${styles.border} shadow-lg rounded-lg
      `}
    >
      <div className="flex items-start p-4 gap-3">
        <div
          className={`
          flex-shrink-0 w-10 h-10 rounded-full
          ${styles.icon}
          flex items-center justify-center
        `}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h6 className="text-sm font-semibold text-gray-900 mb-1">{title}</h6>
          <p className="text-sm text-gray-600 line-clamp-2">{body}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{data}</p>
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 h-6 w-6 flex items-center justify-center
            rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(
    ({ title, body, type = "default", duration = 5000 }) => {
      const id = Date.now();
      const notification = { id, title, body, type };

      setNotifications((prev) => [...prev, notification]);

      if (duration) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const value = {
    addNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-4">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
