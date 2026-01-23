import client from "..";
import {
  ShippingAddress,
  PaginatedShippingAddressesResponse,
  CreateShippingAddressPayload,
  UpdateShippingAddressPayload,
  MessageResponse,
} from "../types/shippingAddress";

const useShippingAddress = () => {
  const fetchShippingAddresses = async (page = 1) => {
    const { data: response } =
      await client.get<PaginatedShippingAddressesResponse>(
        `/api/shipping-addresses?page=${page}`,
      );
    return response;
  };

  const fetchShippingAddress = async (id: number) => {
    const { data: response } = await client.get<ShippingAddress>(
      `/api/shipping-addresses/${id}`,
    );
    return response;
  };

  const createShippingAddress = async (payload: CreateShippingAddressPayload) => {
    const { data: response } = await client.post<ShippingAddress>(
      "/api/shipping-addresses",
      payload,
    );
    return response;
  };

  const updateShippingAddress = async (
    id: number,
    payload: UpdateShippingAddressPayload,
  ) => {
    const { data: response } = await client.put<ShippingAddress>(
      `/api/shipping-addresses/${id}`,
      payload,
    );
    return response;
  };

  const deleteShippingAddress = async (id: number) => {
    const { data: response } = await client.delete<MessageResponse>(
      `/api/shipping-addresses/${id}`,
    );
    return response;
  };

  return {
    fetchShippingAddresses,
    fetchShippingAddress,
    createShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
  };
};

export default useShippingAddress;
