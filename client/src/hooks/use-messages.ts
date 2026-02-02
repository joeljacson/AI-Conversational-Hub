import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type CreateMessageRequest, type Message } from "@shared/schema";

export function useMessages() {
  return useQuery({
    queryKey: [api.messages.list.path],
    queryFn: async () => {
      const res = await fetch(api.messages.list.path);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
    // Poll for new messages (simulate real-time for now if no WS)
    refetchInterval: 2000, 
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateMessageRequest) => {
      const res = await fetch(api.messages.create.path, {
        method: api.messages.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      return api.messages.create.responses[201].parse(await res.json());
    },
    onMutate: async (newMessage) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: [api.messages.list.path] });
      const previousMessages = queryClient.getQueryData<Message[]>([api.messages.list.path]);

      if (previousMessages) {
        // Create a temporary optimistic message
        const optimisticMessage: Message = {
          id: Date.now(), // Temporary ID
          role: "user",
          content: newMessage.content,
          metadata: null,
          createdAt: new Date(),
        };
        
        queryClient.setQueryData<Message[]>([api.messages.list.path], [
          ...previousMessages,
          optimisticMessage
        ]);
      }

      return { previousMessages };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData([api.messages.list.path], context?.previousMessages);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [api.messages.list.path] });
    },
  });
}

export function useClearMessages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.messages.clear.path, {
        method: api.messages.clear.method,
      });
      if (!res.ok) throw new Error("Failed to clear history");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.messages.list.path], []);
    },
  });
}
