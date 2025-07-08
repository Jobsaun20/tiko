export interface Fine {
  id: string;
  reason: string;
  amount: number;
  sender_id: string;
  sender_name: string;
  sender_phone?: string;
  sender_email: string;
  recipient_id: string;
  recipient_name: string;
  recipient_email: string;
  date: string;
  status: 'paid' | 'pending';
  type: string;
}
