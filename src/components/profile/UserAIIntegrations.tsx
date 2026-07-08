import React, { useState, useEffect } from "react";
import { Plus, Key, Copy, CheckCircle2, Trash2, KeyRound } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ApiKey {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

const UserAIIntegrations = () => {
  const { toast } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await axiosInstance.get("/user/mcp-keys");
      setKeys(response.data);
    } catch (error) {
      console.error("Failed to fetch keys", error);
    }
  };

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      toast({ title: "Error", description: "Key name is required", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/user/mcp-keys", { name: newKeyName });
      setGeneratedKey(response.data.key);
      toast({ title: "Success", description: "API Key generated successfully." });
      fetchKeys();
      setNewKeyName("");
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate key", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this key? It will immediately stop working.")) return;
    
    try {
      await axiosInstance.patch(`/user/mcp-keys/${id}/revoke`);
      toast({ title: "Success", description: "API Key revoked successfully." });
      fetchKeys();
    } catch (error) {
      toast({ title: "Error", description: "Failed to revoke key", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Integrations (MCP)</h1>
          <p className="text-[#6B7280]">
            Manage Model Context Protocol (MCP) API keys to connect FlashSpace with Claude, Cursor, and other AI clients.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2D3F33] text-white hover:bg-[#213025]">
              <Plus className="w-4 h-4 mr-2" />
              Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New MCP API Key</DialogTitle>
              <DialogDescription>
                This key will grant access to your FlashSpace data through MCP. Keep it secure.
              </DialogDescription>
            </DialogHeader>
            
            {!generatedKey ? (
              <div className="py-4">
                <Input 
                  placeholder="Key Name (e.g. Claude Desktop, Cursor)" 
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <div className="p-4 bg-muted rounded-lg flex justify-between items-center break-all gap-4 border border-[#2D3F33]/20">
                  <code className="text-sm font-mono">{generatedKey}</code>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedKey)}>
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-sm text-red-500 font-medium">
                  Please copy this key now. You will not be able to see it again!
                </p>
                <div className="mt-4 space-y-3">
                  <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-[#0F172A]">URL to use for OpenClaw/Cursor/Claude</h4>
                    <div className="p-2 bg-white border rounded flex justify-between items-center break-all gap-2">
                      <code className="text-[11px] font-mono text-[#0F172A] select-all">https://mcp.flashspace.ai/openclaw-bridge/</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copyToClipboard('https://mcp.flashspace.ai/openclaw-bridge/')}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-[#0F172A]">MCP URL</h4>
                    <div className="p-2 bg-white border rounded flex justify-between items-center break-all gap-2">
                      <code className="text-[11px] font-mono text-[#0F172A] select-all">https://mcp.flashspace.ai/</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copyToClipboard('https://mcp.flashspace.ai/')}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              {!generatedKey ? (
                <Button onClick={handleGenerateKey} disabled={isLoading} className="bg-[#2D3F33] text-white hover:bg-[#213025]">
                  {isLoading ? "Generating..." : "Generate Key"}
                </Button>
              ) : (
                <Button onClick={() => {
                  setGeneratedKey("");
                  setIsDialogOpen(false);
                }} className="bg-[#2D3F33] text-white hover:bg-[#213025]">
                  Done
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 mt-8">
        <h2 className="text-xl font-semibold text-[#2D3F33]">Active API Keys</h2>
        {keys.filter(k => k.isActive).length === 0 ? (
          <Card className="border-[#2D3F33]/10">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <KeyRound className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-muted-foreground mb-4">No active API keys found.</p>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="border-[#2D3F33] text-[#2D3F33] hover:bg-[#2D3F33] hover:text-white">
                Generate your first key
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {keys.filter(k => k.isActive).map((key) => (
              <Card key={key._id} className="relative overflow-hidden group border border-[#2D3F33]/10 hover:border-[#2D3F33]/30 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-[#2D3F33]">
                    <Key className="w-4 h-4" />
                    {key.name}
                  </CardTitle>
                  <CardDescription>Created: {new Date(key.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleRevokeKey(key._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Revoke
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAIIntegrations;
