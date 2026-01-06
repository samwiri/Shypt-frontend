import client from "..";
import { notificationsFetchRes } from "../types/notifications";

const useNotifications = () => {
  const fetchUserNotifications = async (): Promise<notificationsFetchRes> => {
    const { data } = await client.get("/api/settings/notifications");
    return data;
  };
  const updateNoticationStatus = async ({
    notification_status,
    user_message_id,
  }: {
    user_message_id: number;
    notification_status: "read" | "not_read";
  }) => {
    const { data } = await client.patch(
      `/api/settings/notifications/${user_message_id}`,
      {
        notification_status,
      }
    );
    return data;
  };
  return {
    fetchUserNotifications,
    updateNoticationStatus,
  };
};

export default useNotifications;
