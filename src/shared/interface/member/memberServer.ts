import { CreateMemberDTO, MemberDTO } from './member.dto';

export interface MemberServer {
  create(memberData: CreateMemberDTO): Promise<MemberDTO>;
  listByUser(userId: string): Promise<MemberDTO[]>;
}
