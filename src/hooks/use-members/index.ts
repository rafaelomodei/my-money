'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import type { MemberDTO } from '@/shared/interface/member/member.dto';
import { memberServer } from '@/shared/server';

const memberKeys = {
  all: ['members'] as const,
  list: (userId: string | null) => ['members', userId] as const,
};

interface UseMembersParams {
  userId?: string | null;
  enabled?: boolean;
}

const useMembers = ({
  userId,
  enabled = true,
}: UseMembersParams = {}): UseQueryResult<MemberDTO[]> => {
  const canFetch = Boolean(userId);

  return useQuery({
    queryKey: memberKeys.list(userId ?? null),
    enabled: enabled && canFetch,
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      return memberServer.listByUser(userId);
    },
    placeholderData: [] as MemberDTO[],
  });
};

interface UseCreateMemberParams
  extends Omit<
    UseMutationOptions<MemberDTO, unknown, string, unknown>,
    'mutationFn'
  > {
  userId?: string | null;
}

const useCreateMember = ({
  userId,
  ...options
}: UseCreateMemberParams = {}): UseMutationResult<MemberDTO, unknown, string, unknown> => {
  const queryClient = useQueryClient();

  return useMutation<MemberDTO, unknown, string, unknown>({
    mutationFn: async (memberName: string) => {
      if (!userId) {
        throw new Error('Usuário não autenticado.');
      }

      return memberServer.create({
        name: memberName,
        userId,
      });
    },
    onSuccess: (createdMember, variables, context) => {
      if (userId) {
        queryClient.setQueryData<MemberDTO[]>(
          memberKeys.list(userId),
          (previousMembers = []) => [...previousMembers, createdMember]
        );
      }

      options?.onSuccess?.(createdMember, variables, context);
    },
    ...options,
  });
};

export { useMembers, useCreateMember, memberKeys };
