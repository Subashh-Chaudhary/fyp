import { API_ENDPOINTS } from '../config/api.config';
import { User } from '../interfaces/entities.types';
import { httpClient } from './http.client';

export interface UpdateProfilePayload {
  id: string;
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  is_verified?: boolean;
  is_active?: boolean;
  is_admin?: boolean;
}

export interface UploadAvatarResponse {
  avatar_url: string | null;
  user: User | null;
}

export class UserService {
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const response = await httpClient.put<Record<string, any>>(API_ENDPOINTS.USER.UPDATE_PROFILE, payload);

    // Prefer data.user or data
    const data = (response as any).data ?? response;
    const user = (data?.user as User) ?? (data as User);
    return user;
  }

  async uploadAvatar(userId: string, file: { uri: string; name?: string; type?: string; }): Promise<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append('id', userId);
    // Ensure we have name and type
    const name = file.name || `avatar_${userId}.jpg`;
    const type = file.type || 'image/jpeg';
    // React Native FormData requires casting to any for the file object shape
    formData.append('avatar', {
      uri: file.uri,
      name,
      type,
    } as any);

    const response = await httpClient.post<Record<string, any>>(API_ENDPOINTS.PROFILE.AVATAR_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = (response as any).data ?? response;
    return {
      avatar_url: (data?.avatar_url as string) ?? null,
      user: (data?.user as User) ?? null,
    };
  }
}

export const userService = new UserService();
