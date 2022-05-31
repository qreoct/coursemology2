import { Permissions } from 'types';
import { AchievementListData, AchievementMiniEntity } from './achievements';
import { CourseUserData } from './course_users';

export type UserPermissions = Permissions<
  'canCreate' | 'canManage' | 'canReorder'
>;

/**
 * Data types for achievement data retrieved from backend through API call.
 */

export interface UserListData {
  id: number;
  name: string;
  imageUrl?: string;
  //   permissions: UserListDataPermissions;
}

export interface UserData extends CourseUserData {
  role: string;
  achievementCount?: number;
  achievements?: AchievementListData[];
  email: string;
  experiencePointsRecordsUrl?: string;
  manageEmailSubscriptionUrl: string;
}

export interface UserMiniEntity {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface UserEntity extends UserMiniEntity {
  role: string;
  achievementCount?: number;
  achievements?: AchievementMiniEntity[];
  email: string;
  experiencePointsRecordsUrl?: string;
  manageEmailSubscriptionUrl: string;
}
