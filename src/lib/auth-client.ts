import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        inferAdditionalFields({
            user: {
                role: { type: "string" },
                phoneNumber: { type: "string" }
            }
        }),
        jwtClient(),
    ]
});
