import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useAtomValue } from "jotai";
import { createClientAtomDate } from "@/jotai/createClientAtom";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { toast } from "react-hot-toast";
import { Client } from "@/pages/index";

type EditTaskModalProps = {
  task: Client;
  onClose: () => void;
};

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose }) => {
  const date = useAtomValue(createClientAtomDate);
  const updateClientMutation = api.client.updateClient.useMutation();
  const { refetch: refetchAllClients } = api.client.allClients.useQuery();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: task.name,
    email: task.email,
    invoice: task.invoice,
  });

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!data.name || !data.email || !date) {
      toast.error("Please fill in all fields");
      return;
    } else {
      const updateClient = await updateClientMutation.mutateAsync({
        date: date,
        email: data.email,
        id: task.id,
        name: data.name,
        invoice: data.invoice,
        sendemail: task.sendemail,
      });
      setLoading(false);
      if (updateClient.success) {
        toast.success("Client Updated Successfully", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        await refetchAllClients();
        onClose();
      } else {
        toast.error("Error updating client", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur backdrop-filter">
        <div className="rounded bg-white p-8 shadow-lg">
          <div className="mb-4 text-xl font-bold text-black">
            Edit {task.name}
          </div>
          <div className="mb-4 text-gray-600">
            This action cannot be undone.
          </div>
          <div className="grid max-w-sm gap-4 py-4">
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
          <div className="flex justify-end gap-x-2">
            {loading ? (
              <>
                <Button variant="secondary" disabled>
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                </Button>
                <Button disabled>
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={(e) => void handleSubmit(e)}>
                  Edit Client
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTaskModal;
