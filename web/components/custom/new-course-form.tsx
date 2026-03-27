'use client'

import { ImageIcon, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "../ui/empty"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Controller, UseFormReturn } from "react-hook-form"
import { z } from "zod";
import { courseSchema } from "@/lib/validations/course";
import { Textarea } from "../ui/textarea"

interface NewCourseFormProps {
    form: UseFormReturn<typeof courseSchema, any, typeof courseSchema>
}

export function NewCourseForm({ form }: NewCourseFormProps) {
    return (
        <form id="form-new-course">
            <FieldGroup>
                <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field className="flex" data-invalid={fieldState.invalid}>
                            <FieldLabel>Title</FieldLabel>
                            <Input 
                                {...field}
                                placeholder="Enter title" 
                                id="form-new-course-title"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                        </Field>
                    )}
                />
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field className="flex">
                    <FieldLabel>Description</FieldLabel>
                    <FieldContent>
                        <Textarea 
                            {...field}
                            placeholder="Enter description"
                            id="form-new-course-description"
                            aria-invalid={fieldState.invalid}
                            autoComplete="off" 
                        />
                    </FieldContent>
                </Field>
                    )}
                />
            </FieldGroup>
        </form>
    )
}