import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateOrderFormData,
  CreateOrderShipmentFormData,
  UpdateOrderFormData,
} from '@/libs/orders/schemas';
import { OrderDetail, OrderSummary } from '@/libs/orders/types';
import { isDev } from '@/utils';
import { generateMockOrderDetail, generateMockOrderSummaries } from '@/libs/orders/mocks';
import {
  addShipment,
  createOrder,
  getMyOrders,
  getOrderDetails,
  updateOrder,
} from '@/libs/orders/api';


export function useMyOrders() {
  return useQuery<OrderSummary[]>({
    queryKey: ['orders'],
    queryFn: isDev ? generateMockOrderSummaries : getMyOrders,
  });
}

export function useOrderDetails(id: number) {
  return useQuery<OrderDetail>({
    queryKey: ['order-detail', id],
    queryFn: () => (isDev ? generateMockOrderDetail() : getOrderDetails(id)),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<OrderDetail, Error, CreateOrderFormData>({
    mutationFn: (data) => (isDev ? generateMockOrderDetail() : createOrder(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrder(id: number) {
  const queryClient = useQueryClient();

  return useMutation<OrderDetail, Error, UpdateOrderFormData>({
    mutationFn: (data) => (isDev ? generateMockOrderDetail() : updateOrder(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-detail', id] });
    },
  });
}

export function useAddShipment(id: number) {
  const queryClient = useQueryClient();

  return useMutation<OrderDetail, Error, CreateOrderShipmentFormData>({
    mutationFn: (data) => (isDev ? generateMockOrderDetail() : addShipment(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-detail', id] });
    },
  });
}
