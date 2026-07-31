import { use } from "react";

export function toAuthUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
}

export function toProfileUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription_plan: user.subscription_plan,
        created_at: user.created_at        
    };
}