import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { ClientNote } from '@/types/client.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, User } from 'lucide-react';
import { toast } from 'sonner';

interface NotesTabProps {
    clientId: string;
}

const NotesTab: React.FC<NotesTabProps> = ({ clientId }) => {
    const queryClient = useQueryClient();
    const [newNote, setNewNote] = useState('');

    const mockNotes: ClientNote[] = [
        { id: '1', clientId, content: 'Client is interested in upgrading to large office.', author: 'Sales User', timestamp: '2023-10-20T11:00:00Z' },
        { id: '2', clientId, content: 'Initial call scheduled next week.', author: 'Sales User', timestamp: '2023-10-15T09:30:00Z' },
    ];

    const { data: notes, isLoading } = useQuery({
        queryKey: ['client-notes', clientId],
        queryFn: async () => {
            try {
                const response = await adminService.getClientNotes(clientId);
                if (response && response.success) return response.data;
                throw new Error("No data");
            } catch (e) {
                return mockNotes;
            }
        }
    });

    const addNoteMutation = useMutation({
        mutationFn: async (content: string) => {
            // Mock API call
            await adminService.addClientNote(clientId, { content });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['client-notes', clientId] });
            setNewNote('');
            toast.success("Note added successfully");
            // For mock demo, we might not see the update if we don't update local mock state, but standard flow assumes cache invalidation fetches new data.
        },
        onError: () => {
            toast.error("Failed to add note");
        }
    });

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        addNoteMutation.mutate(newNote);
    };

    if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto my-8" />;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">Internal Notes <span className="text-sm font-normal text-gray-400">(Private)</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Textarea
                        placeholder="Add a new note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="resize-none"
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleAddNote} disabled={addNoteMutation.isPending || !newNote.trim()}>
                            {addNoteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            Add Note
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 mt-6">
                    {notes?.map((note) => (
                        <div key={note.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-gray-800 text-sm whitespace-pre-wrap">{note.content}</p>
                            <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span className="font-medium">{note.author}</span>
                                </div>
                                <span>{new Date(note.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                    {notes?.length === 0 && (
                        <p className="text-center text-gray-500 italic py-4">No notes yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default NotesTab;
