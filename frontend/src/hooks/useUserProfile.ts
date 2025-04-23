import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api';

export const useUserProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
        staleTime: Infinity,
        retry: false,
    });
};
