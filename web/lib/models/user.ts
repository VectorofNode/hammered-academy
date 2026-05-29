import { RegistrationResponseJSON } from "@simplewebauthn/browser";

export interface UserRegisterationInfo {
    email: string
    full_name: string
    avatar_url: string
}

export interface UserRegisterationVerificationInfo {
    username: string
    credential_json: RegistrationResponseJSON
    device_name: string
}