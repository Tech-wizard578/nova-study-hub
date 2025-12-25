
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uploadFile, createMaterial } from '@/services/materialsService'
import { toast } from 'sonner'
import { Upload as UploadIcon, FileText, X } from 'lucide-react'

const Upload = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        category: '',
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !user) return

        setLoading(true)
        try {
            // 1. Upload file
            const { path, publicUrl } = await uploadFile(file)

            // 2. Create database record (store path and public URL)
            await createMaterial({
                title: formData.title,
                category: formData.category,
                file_url: publicUrl,
                file_path: path,
                uploaded_by: user.id
            })

            toast.success('Material uploaded successfully!')
            navigate('/dashboard')
        } catch (error: any) {
            console.error('Upload failed:', error)
            toast.error(error.message || 'Failed to upload material')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background p-4 flex items-center justify-center">
            <div className="w-full max-w-md glass-card p-6 rounded-xl space-y-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                        <UploadIcon className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold">Upload Material</h1>
                    <p className="text-muted-foreground">Share knowledge with your batchmates</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            placeholder="e.g., Data Structures Notes Unit 1"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Notes">Notes</SelectItem>
                                <SelectItem value="Assignment">Assignment</SelectItem>
                                <SelectItem value="Lab Record">Lab Record</SelectItem>
                                <SelectItem value="Question Paper">Question Paper</SelectItem>
                                <SelectItem value="Textbook">Textbook</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">File</label>
                        <div className="border-2 border-dashed border-border rounded-xl p-6 hover:bg-muted/50 transition-colors text-center cursor-pointer relative">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                required
                            />
                            {file ? (
                                <div className="flex items-center justify-center gap-2 text-primary font-medium">
                                    <FileText className="w-4 h-4" />
                                    <span className="truncate max-w-[200px]">{file.name}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 ml-2 z-10"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setFile(null)
                                        }}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-muted-foreground">
                                    <p>Click to upload or drag and drop</p>
                                    <p className="text-xs mt-1">PDF, DOC, PPT up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => navigate('/dashboard')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading || !file}>
                            {loading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Upload
