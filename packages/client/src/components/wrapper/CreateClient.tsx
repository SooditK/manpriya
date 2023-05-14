import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { Icons } from "../icons";
import { toast } from "react-hot-toast";
import { useAtom, useAtomValue } from "jotai";
import {
  createClientAtom,
  createClientAtomDate,
} from "@/jotai/createClientAtom";
import { api } from "@/utils/api";

export function CreateClientDialog() {
  const [data, setData] = useAtom(createClientAtom);
  const date = useAtomValue(createClientAtomDate);
  const [loading, setLoading] = useState(false);
  const createClientMutation = api.client.createClient.useMutation();
  const { refetch: refetchAllClients } = api.client.allClients.useQuery();

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!data.name || !data.email || !date) {
      toast.error("Please fill in all fields");
      return;
    } else {
      setLoading(true);
      const createClient = await createClientMutation.mutateAsync({
        date: date,
        email: data.email,
        name: data.name,
        invoice: data.invoice,
      });
      if (createClient.success) {
        setLoading(false);
        toast.success("Client Created Successfully", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        await refetchAllClients();
      } else {
        setLoading(false);
        toast.error("Error creating client", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Create Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
          <DialogDescription>
            Fill in the form below to create a new client
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="invoice" className="text-right">
              Invoice
            </Label>
            <Input
              id="invoice"
              value={data.invoice}
              onChange={(e) => setData({ ...data, invoice: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <DatePicker />
          </div>
        </div>
        <DialogFooter>
          {loading ? (
            <Button disabled>
              <Icons.spinner className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button onClick={(e) => void handleSubmit(e)}>Create Client</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
