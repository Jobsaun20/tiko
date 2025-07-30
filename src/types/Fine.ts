export interface Fine {
  id: string;
  reason: string;
  amount: number;
  sender_id: string;
  sender_name: string;
  sender_phone?: string;
  sender_email: string;
  sender_username?: string;           // NUEVO: nombre de usuario (opcional)
  sender_avatar_url?: string;         // NUEVO: avatar URL (opcional)
  recipient_id: string;
  recipient_name: string;
  recipient_email: string;
  recipient_username?: string;        // NUEVO: nombre de usuario (opcional)
  recipient_avatar_url?: string;      // NUEVO: avatar URL (opcional)
  date: string;
  status: 'paid' | 'pending';
  type: string;
  group_id?: string;
}
