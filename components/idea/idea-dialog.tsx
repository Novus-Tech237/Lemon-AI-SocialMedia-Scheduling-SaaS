import { useEffect, useState } from "react"
import { Shapes } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageObject } from "@/types/post.type"
import { IdeaType } from "@/types/idea.type"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import ContentTextarea from "../content-textarea"


type IdeaDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    idea?: IdeaType
    selectedColumnId: string
    isSaving?: boolean
    onSave: (idea: IdeaType) => void
    columns?: { id: string; title: string }[]
}

const IdeaDialog = ({
    open,
    onOpenChange,
    idea,
    selectedColumnId,
    isSaving,
    columns,
    onSave,
}: IdeaDialogProps) => {
    const isEdit = !!idea?.id;
    const [title, setTitle] = useState(idea?.title ?? "")
    const [description, setDescription] = useState(idea?.description ?? "")
    const [images, setImages] = useState<ImageObject[]>(idea?.images ?? [])
    const [selectedColumn, setSelectedColumn] = useState(idea?.columnId ?? selectedColumnId)
    const [showAI, setShowAI] = useState<boolean>(false)

    useEffect(() => {
        setTitle(idea?.title ?? "")
        setDescription(idea?.description ?? "")
        setImages(idea?.images ?? [])
        setSelectedColumn(idea?.columnId ?? selectedColumnId);
        setShowAI(false)
    }, [idea, selectedColumnId])


    const handleSave = () => {
        onSave({
            id: idea?.id,
            title: title,
            description,
            images,
            columnId: selectedColumn,
            sortOrder: idea?.sortOrder
        })
    }

    const handleOpenChange = (open: boolean) => {
        onOpenChange(open)
    }


    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className={cn(
                    `flex gap-0 p-0 overflow-hidden sm:w-[95%] sm:min-w-[550px] h-auto!`,
                    showAI && "sm:max-w-[900px]"
                )}
            >
                <div className="flex flex-1">
                    <div className="flex flex-1 flex-col w-full">
                        <DialogHeader className="flex flex-row items-center justify-between px-5 py-4">
                            <DialogTitle className="text-base font-semibold">
                                {isEdit ? "Edit Idea" : "Create Idea"}
                            </DialogTitle>
                            <div>
                                <Select value={selectedColumn}
                                    onValueChange={setSelectedColumn}>
                                    <SelectTrigger className="min-w-[100px] 
            max-w-[135px] gap-1! mr-5 text-sm">
                                        <Shapes />
                                        <SelectValue placeholder="Select column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columns?.map((column) => (
                                            <SelectItem key={column.id} value={column.id}>
                                                {column.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </DialogHeader>

                        <div className="flex flex-1 flex-col gap-px
       overflow-y-auto px-5 py-2">

                            <Input
                                value={title}
                                placeholder="Give your idea a title"
                                onChange={(e) => setTitle(e.target.value)}
                                className="border-0 px-0 text-xl! font-semibold
          shadow-none placeholder:font-semibold  bg-transparent!
          focus-visible:ring-0"
                            />

                            <ContentTextarea
                                value={description}
                                onChange={setDescription}
                                placeholder="Everything begins with an idea"
                                images={images}
                                onImagesChange={setImages}
                                showAIAssistant={true}
                                onAIAssistantClick={() => setShowAI((value) => !value)}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
                            <Button
                                size="lg"
                                disabled={isSaving || !title.trim()}
                                onClick={handleSave}
                            >
                                {isSaving && <Spinner />}
                                Save Idea</Button>
                        </div>
                    </div>


                    {showAI && (
                        <div className="w-[340px] shrink-0 border-l border-border
                        bg-muted/30
                        ">
                            <div className="p-4">
                                {/* <AIAssistant  
                                  content={`${title}\n\n${description}`}
                                  onGenerate={(content) => {
                                    setDescription(content)
                                  }}
                                /> */}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default IdeaDialog