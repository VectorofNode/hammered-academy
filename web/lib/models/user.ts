import { AuthenticationResponseJSON, RegistrationResponseJSON } from "@simplewebauthn/browser";

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

export interface PasskeyLoginGrantOptionInfo {
    username: string | undefined
}

export interface PasskeyLoginVerificationInfo {
    credential_json: AuthenticationResponseJSON,
    login_challange: string
}

export interface PasskeyLoginGrantOptionResponse {
    login_challange: string
    opts: any
}