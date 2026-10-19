import { createClient } from "../utils/supabase/server";

export async function login(email: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithOtp({
            email
        });
        
        if (error) {
            return { 
                success: false, 
                error: error.message || 'An error occurred during login'
            };
        }   

        return { 
            success: true,
            data: data ? {
                user: data.user ? {
                    id: (data.user as any)?.id || '',
                    email: (data.user as any)?.email || ''
                } : null,
                session: data.session ? {
                    access_token: (data.session as any)?.access_token || '',
                    refresh_token: (data.session as any)?.refresh_token || '',
                    expires_at: (data.session as any)?.expires_at || 0
                } : null
            } : null
        };
    } catch (error) {
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

export async function verifyOtp(email: string, token: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'magiclink'
        });
        
        if (error) {
            return { 
                success: false, 
                error: error.message || 'An error occurred during verification'
            };
        }
        
        return { 
            success: true,
            user: data.user ? {
                id: (data.user as any)?.id || '',
                email: (data.user as any)?.email || '',
                created_at: (data.user as any)?.created_at || '',
                updated_at: (data.user as any)?.updated_at || ''
            } : null,
            session: data.session ? {
                access_token: (data.session as any)?.access_token || '',
                refresh_token: (data.session as any)?.refresh_token || '',
                expires_at: (data.session as any)?.expires_at || 0
            } : null
        };
    } catch (error) {
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unexpected error occurred during verification'
        };
    }
}