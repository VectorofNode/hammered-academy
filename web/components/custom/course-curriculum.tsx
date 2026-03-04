import { CourseFull } from "@/lib/models/course";
import { SectionWithLessons } from "@/lib/models/section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { FileText } from "lucide-react";

interface CourseCurriculumProps {
    sections: SectionWithLessons[]
}

export function CourseCurriculum({sections}: CourseCurriculumProps) {
    return(
        <>
            <div className="text-2xl">Curriculum</div>
            <Accordion type={"multiple"}>
                {sections.map((section, s_index) => 
                    <AccordionItem value={`${s_index}`} key={s_index}>
                        <AccordionTrigger className="text-xl">{section.title}</AccordionTrigger>
                        <AccordionContent>
                            {section.lessons.map((lesson, l_index) =>
                                <ul key={l_index} className="flex flex-row space-x-4 items-center">
                                    <FileText size={16} />
                                    <div>{lesson.title}</div>
                                </ul>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </>
    )
}