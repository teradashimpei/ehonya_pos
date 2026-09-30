export type Product = {
  product_code: string;
  name: string;
  unit_price: number;
};

export type Member = {
  member_id: string;
  name: string;
};

export type Customer =
  | { kind: "member"; memberId: string; name: string }
  | { kind: "guest" };

export type PurchaseLine = {
  lineId: string;
  productCode: string;
  name: string;
  unitPrice: number;
};