export interface MemberDTO {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberDTO {
  userId: string;
  name: string;
}
