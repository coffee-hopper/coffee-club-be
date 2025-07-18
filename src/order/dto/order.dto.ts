export class OrderResponseDto {
  id: number;
  username: string;
  payment: number;
  totalAmount: number;
  status: string;
  items: { productId: number; quantity: number }[];

  constructor(order: any) {
    this.id = order.id;
    this.username = order.user.username;
    this.payment = order.payment?.id;
    this.totalAmount = order.totalAmount;
    this.status = order.status;
    this.items = order.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
  }
}

export class FindAllOrdersDto {
  orders: OrderResponseDto[];

  constructor(orders: any[]) {
    this.orders = orders.map((order) => new OrderResponseDto(order));
  }
}

export class CancelOrderDto {
  id: number;
}
