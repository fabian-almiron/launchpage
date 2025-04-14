import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, RefreshCw } from "lucide-react";

const handleDomainDelete = async () => {
  // ... existing code ...
};

const handleRefreshDNS = async (domainId: string) => {
  try {
    setIsLoading(true);
    const response = await fetch(`/api/domains/refresh-dns/${domainId}`, {
      method: "POST",
    });
    
    if (!response.ok) {
      throw new Error("Failed to refresh DNS verification");
    }
    
    toast.success("DNS verification status refreshed");
    router.refresh();
  } catch (error) {
    console.error("Error refreshing DNS verification:", error);
    toast.error("Failed to refresh DNS verification");
  } finally {
    setIsLoading(false);
  }
};

// ... existing code ...

// ... existing code ...
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDomainDelete()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialog>
                  
                  {domain.recordType && !domain.dnsVerified && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRefreshDNS(domain.id)}
                      disabled={isLoading}
                      title="Refresh DNS verification"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
// ... existing code ... 