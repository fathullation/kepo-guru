export type UserRole = 'admin' | 'guru' | 'wali_kelas' | 'guru_wali' | 'guru_bk';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}