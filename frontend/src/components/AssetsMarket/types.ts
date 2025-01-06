export interface Asset {
  _id: string;
  title: string;
  description: string;
  price: number;
  previewImages: string[];
  createdBy: string;
}

export interface AssetOrder {
  _id: string;
  asset: Asset;
  buyer: string;
  orderId: string;
  amount: number;
  paymentStatus: string;
}

export interface AssetSale {
  _id: string;
  asset: string;
  seller: string;
  buyer: string;
  amount: number;
  createdAt: string;
}
