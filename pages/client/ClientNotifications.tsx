import { useState, useEffect } from "react";
import {
  Bell,
  Package,
  CreditCard,
  ShoppingBag,
  Info,
  Check,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import useNotifications from "@/api/notifications/useNotifications";
import { notificationDetails } from "@/api/types/notifications";
import Modal from "@/components/UI/Modal";

const ClientNotifications: React.FC = () => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<
    "ALL" | "ORDER" | "FINANCE" | "SHOPPING" | "SYSTEM"
  >("ALL");

  const { fetchUserNotifications, updateNoticationStatus } = useNotifications();

  const [notifications, setNotifications] = useState<notificationDetails[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<notificationDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const notificationres = await fetchUserNotifications();
      console.log("res", notificationres);
      setNotifications(notificationres.data.messages);
    } catch (error) {
      showToast("Failed to fetch notifications", "error");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification: notificationDetails) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);

    if (notification.status !== "read") {
      try {
        await updateNoticationStatus({
          user_message_id: notification.id,
          notification_status: "read",
        });
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, status: "read" } : n
          )
        );
      } catch (error) {
        // even if it fails to update status, show the notification
      }
    }
  };

  const markAllRead = async () => {
    const unreadNotifications = notifications.filter(
      (n) => n.status !== "read"
    );
    if (unreadNotifications.length === 0) {
      showToast("All notifications are already marked as read", "info");
      return;
    }

    try {
      await Promise.all(
        unreadNotifications.map((n) =>
          updateNoticationStatus({
            user_message_id: n.id,
            notification_status: "read",
          })
        )
      );
      setNotifications(notifications.map((n) => ({ ...n, status: "read" })));
      showToast("All notifications marked as read", "success");
    } catch (error) {
      showToast("Failed to mark all notifications as read", "error");
    }
  };

  const filteredList = notifications.filter(
    (n) => filter === "ALL" || n.type === filter
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <Package size={20} className="text-blue-600" />;
      case "FINANCE":
        return <CreditCard size={20} className="text-green-600" />;
      case "SHOPPING":
        return <ShoppingBag size={20} className="text-purple-600" />;
      case "SYSTEM":
        return <Info size={20} className="text-slate-600" />;
      default:
        return <Info size={20} className="text-slate-600" />;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
            <p className="text-slate-500 text-sm">
              Stay updated on your shipments and requests.
            </p>
          </div>
          <button
            onClick={markAllRead}
            className="text-sm text-primary-600 font-medium hover:underline flex items-center"
          >
            <Check size={16} className="mr-1" /> Mark all as read
          </button>
        </div>

        <div className="flex space-x-2 border-b border-slate-200 pb-1 overflow-x-auto">
          {["ALL", "ORDER", "FINANCE", "SHOPPING", "SYSTEM"].map((f) => (
            <button
              key={f}
              onClick={() =>
                setFilter(
                  f as "ALL" | "ORDER" | "FINANCE" | "SHOPPING" | "SYSTEM"
                )
              }
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                filter === f
                  ? "bg-slate-100 text-slate-900 border-b-2 border-primary-500"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 divide-y divide-slate-100">
          {filteredList.length > 0 ? (
            filteredList.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 flex items-start hover:bg-slate-50 transition cursor-pointer ${
                  n.status === "read" ? "opacity-70" : "bg-blue-50/30"
                }`}
              >
                <div
                  className={`p-2 rounded-full mr-4 flex-shrink-0 ${
                    n.status === "read"
                      ? "bg-slate-100"
                      : "bg-white shadow-sm border border-slate-200"
                  }`}
                >
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4
                      className={`text-sm font-bold ${
                        n.status === "read"
                          ? "text-slate-700"
                          : "text-slate-900"
                      }`}
                    >
                      {n.title}
                    </h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                    {n.body.replace(/<[^>]*>?/gm, "")}
                  </p>
                </div>
                {n.status !== "read" && (
                  <div className="ml-3 mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
              <Bell size={48} className="mb-4 opacity-20" />
              <p>No notifications found in this category.</p>
            </div>
          )}
        </div>
      </div>
      {selectedNotification && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedNotification.title}
        >
          <div
            className="max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedNotification.body }}
          />
        </Modal>
      )}
    </>
  );
};

export default ClientNotifications;
