import { MemberServer } from '@/shared/interface/member/memberServer';
import { CreateMemberDTO, MemberDTO } from '@/shared/interface/member/member.dto';
import { appFirebase } from './config';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  Timestamp,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

export class MemberServerFirebaseAdapter implements MemberServer {
  private readonly db;
  private readonly collection;

  constructor() {
    this.db = getFirestore(appFirebase);
    this.collection = collection(this.db, 'members');
  }

  private mapDocumentToMember(
    document: QueryDocumentSnapshot<DocumentData>
  ): MemberDTO {
    const data = document.data();

    return {
      id: document.id,
      userId: data.userId as string,
      name: data.name as string,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    };
  }

  async create(memberData: CreateMemberDTO): Promise<MemberDTO> {
    const timestamps = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(this.collection, {
      ...memberData,
      ...timestamps,
    });

    return {
      id: docRef.id,
      ...memberData,
      createdAt: timestamps.createdAt.toDate(),
      updatedAt: timestamps.updatedAt.toDate(),
    };
  }

  async listByUser(userId: string): Promise<MemberDTO[]> {
    const membersQuery = query(this.collection, where('userId', '==', userId));
    const snapshot = await getDocs(membersQuery);

    return snapshot.docs.map((doc) => this.mapDocumentToMember(doc));
  }
}
