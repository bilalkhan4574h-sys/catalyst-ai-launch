import { supabase } from "./client";

export type Message = {
  id?: string;
  created_at?: string;
  name: string;
  email?: string;
  content: string;
};

export async function fetchMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from<Message>("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function insertMessage(msg: Omit<Message, "id" | "created_at">) {
  const { data, error } = await supabase
    .from<Message>("messages")
    .insert(msg)
    .select();

  if (error) throw error;
  return data?.[0] ?? null;
}

type Unsubscribe = { unsubscribe: () => void };

export function subscribeToNewMessages(onInsert: (m: Message) => void): Unsubscribe {
  // Supabase JS v2 realtime channel subscription
  const channel = supabase.channel("public:messages").on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "messages" },
    (payload) => {
      if (payload.eventType === "INSERT") onInsert(payload.new as Message);
    }
  );

  channel.subscribe();

  return {
    unsubscribe: () => {
      channel.unsubscribe();
    },
  };
}

export default {
  fetchMessages,
  insertMessage,
  subscribeToNewMessages,
};
