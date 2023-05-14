import { type Row } from "@tanstack/react-table";
import { MoreHorizontal, Pen, Tags, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { labels } from "@/components/data";
import { clientSchema } from "@/pages/index";
import { useState } from "react";
import EditTaskModal from "@/components/wrapper/EditTaskModal";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = clientSchema.parse(row.original);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const { refetch: refetchAllClients } = api.client.allClients.useQuery();
  const updateSendEmailMutation = api.client.sendEmail.useMutation();
  const deleteClientMutation = api.client.deleteClient.useMutation();

  async function updateSendEmail(e: React.SyntheticEvent, value: string) {
    e.preventDefault();
    if (value === "true" && task.sendemail === true) {
      toast("Email already set to true", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    if (value === "false" && task.sendemail === false) {
      toast("Email already set to false", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    let sendEmail: boolean;
    if (value === "true") {
      sendEmail = true;
    } else {
      sendEmail = false;
    }
    const res = await updateSendEmailMutation.mutateAsync({
      id: task.id,
      sendemail: sendEmail,
    });
    if (res.success) {
      toast.success("Email updated successfully", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      await refetchAllClients();
    } else {
      console.log(res);
      toast.error("Error updating email", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  }

  async function handleClientDelete(e: React.SyntheticEvent) {
    e.preventDefault();
    const res = await deleteClientMutation.mutateAsync({
      id: task.id,
    });
    if (res.success) {
      toast.success("Client deleted successfully", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      await refetchAllClients();
    } else {
      console.log(res);
      toast.error("Error deleting client", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  }

  return (
    <>
      {showEditModal && (
        <EditTaskModal task={task} onClose={() => setShowEditModal(false)} />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowEditModal(true)}>
            <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Email
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.email}>
                {labels.map((label, index) => (
                  <DropdownMenuRadioItem
                    key={index}
                    onClick={(e) => void updateSendEmail(e, String(label.value))}
                    value={String(label.value)}
                  >
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(e) => void handleClientDelete(e)}>
            <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
