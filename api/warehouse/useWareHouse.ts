import client from "..";
import {
  WareHouseLocationsAPIResponse,
  WareHouseLocationAPIResponse,
  CreateWareHouseLocationPayload,
  UpdateWareHouseLocationPayload,
  WarehouseRacksAPIResponse,
  WarehouseRackAPIResponse,
  CreateWarehouseRackPayload,
  UpdateWarehouseRackPayload,
  DeleteWarehouseRackPayload,
} from "../types/warehouse";

const useWareHouse = () => {
  // === Warehouse Locations ===
  const fetchWareHouseLocations =
    async (): Promise<WareHouseLocationsAPIResponse> => {
      const { data } = await client.get("/api/settings/locations");
      return data;
    };

  const createWareHouseLocation = async (
    payload: CreateWareHouseLocationPayload
  ): Promise<WareHouseLocationAPIResponse> => {
    const { data } = await client.post("/api/settings/locations", payload);
    return data;
  };

  const updateWareHouseLocation = async (
    id: number,
    payload: UpdateWareHouseLocationPayload
  ): Promise<WareHouseLocationAPIResponse> => {
    const { data } = await client.put(
      `/api/settings/locations/${id}`,
      payload
    );
    return data;
  };

  const deleteWareHouseLocation = async (
    id: number
  ): Promise<WareHouseLocationAPIResponse> => {
    const { data } = await client.delete(`/api/settings/locations/${id}`);
    return data;
  };

  // === Warehouse Racks ===
  const fetchWarehouseRacks = async (): Promise<WarehouseRacksAPIResponse> => {
    const { data } = await client.get("/api/settings/warehouse_racks");
    return data;
  };

  const createWarehouseRack = async (
    payload: CreateWarehouseRackPayload
  ): Promise<WarehouseRackAPIResponse> => {
    const { data } = await client.post("/api/settings/warehouse_racks", payload);
    return data;
  };

  const updateWarehouseRack = async (
    id: number,
    payload: UpdateWarehouseRackPayload
  ): Promise<WarehouseRackAPIResponse> => {
    const { data } = await client.put(
      `/api/settings/warehouse_racks/${id}`,
      payload
    );
    return data;
  };

  const deleteWarehouseRack = async (
    id: number,
    payload: DeleteWarehouseRackPayload
  ): Promise<any> => {
    const { data } = await client.delete(`/api/settings/warehouse_racks/${id}`, {
      data: payload,
    });
    return data;
  };

  return {
    fetchWareHouseLocations,
    createWareHouseLocation,
    updateWareHouseLocation,
    deleteWareHouseLocation,
    fetchWarehouseRacks,
    createWarehouseRack,
    updateWarehouseRack,
    deleteWarehouseRack,
  };
};

export default useWareHouse;

