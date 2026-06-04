"use client"

import * as z from "zod/v3"

import { NavBar } from "@/components/custom/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getPasskeyLoginOptions, verifyPasskeyLogin } from "@/lib/utils/auth";
import { startAuthentication } from "@simplewebauthn/browser";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const formScheme = z.object({
    email: z.string().email({ message: "Please enter a valid email." })
})

export default function Page() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const form = useForm<z.infer<typeof formScheme>>({
        resolver: zodResolver(formScheme),
        defaultValues: {
            email: ""
        }
    })

    async function initConditionalUi() {
        try {
            const options = await getPasskeyLoginOptions({ username: undefined })
            const assertionRes = await startAuthentication({
                optionsJSON: options.opts,
                useBrowserAutofill: true
            })

            await verifyPasskeyLogin({ credential_json: assertionRes, login_challange: options.login_challange })
            router.push(searchParams.get("callbackUrl") ?? "/")
        } catch (error) {
            console.log(error)
            toast.error(`${error}`)
        }
    }

    async function onSubmit(data: z.infer<typeof formScheme>) {
        try {
            const options = await getPasskeyLoginOptions({ username: data.email })
            const assertionRes = await startAuthentication({
                optionsJSON: options.opts,
                useBrowserAutofill: true
            })

            await verifyPasskeyLogin({ credential_json: assertionRes, login_challange: options.login_challange })
        } catch (error) {
            console.log(error)
            toast.error(`${error}`)
        }
    }

    useEffect(() => {
        initConditionalUi()
    }, [])

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-2xl">Login</CardHeader>
                <CardContent>
                    <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="example@example.com"
                                            autoComplete="username webauthn"
                                        />
                                        <FieldDescription>Enter your eamil or login with with passkey.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}