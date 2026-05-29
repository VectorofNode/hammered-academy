"use client"

import * as z from "zod/v3"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRegisterationInfo } from "@/lib/models/user";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserKey } from "lucide-react";
import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";
import { getPasskeySignupOptions, verifyPasskeyRegisteration } from "@/lib/utils/auth";
import { startRegistration } from "@simplewebauthn/browser";
import { toast } from "sonner";

const formScheme = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
    full_name: z.string().min(1, "Please enter your full name."),
    device_name: z.string()
})

export default function Page() {
    const [info, setInfo] = useState("")

    const form = useForm<z.infer<typeof formScheme>>({
        resolver: zodResolver(formScheme),
        defaultValues: {
            email: "",
            full_name: "",
            device_name: ""
        }
    })

    function onSubmit(data: z.infer<typeof formScheme>) {
        handleRegistration(data.email, data.full_name, data.device_name != "" ? data.device_name : info)
    }

    async function handleRegistration(email: string, fullName: string, deviceName: string) {
        try {
            const options = await getPasskeySignupOptions({ email: email, full_name: fullName, avatar_url: "" })

            const credential_res = await startRegistration({ optionsJSON: options })
            await verifyPasskeyRegisteration({
                username: email, device_name: deviceName, credential_json: credential_res
            })

            toast.success("Passkey registered, please login again.")
        } catch (error: any) {
            if (error.name === "NotAllowedError") {
                toast.error("User cancelled the registeration.")
            } else {
                toast.error(`Unknown error when registering passkey: ${error}`)
            }
        }
    }

    useEffect(() => {
        const parser = new UAParser(navigator.userAgent)
        setInfo(`${parser?.getBrowser().name}-${parser?.getOS().name}-${Math.random().toString(36).substring(2, 12)}`)
    }, [])

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Sign up for new account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="form-signup">
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
                                        />
                                        <FieldDescription>Enter your eamil to sign up an account.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="full_name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <FieldDescription>Enter your full name.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="device_name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Device Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder={info}
                                            autoComplete="false"
                                        />
                                        <FieldDescription>Name your first passkey, or use the generated name.</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex">
                    <Button type="submit" className="w-full" form="form-signup">
                        <UserKey />
                        Sign up with passkey
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}