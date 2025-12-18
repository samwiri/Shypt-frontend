import client from "..";
import { Counters } from "../types/dashboard";

const useDashboard = () => {
  const fetchDashboard = async (): Promise<Counters> => {
    const { data } = await client.get("/api/delivery/dashboard");
    return data;
  };
  return { fetchDashboard };
};

export default useDashboard;
