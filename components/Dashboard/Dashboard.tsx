"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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
import { Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/shared/Header";
import { createApi, deleteApi, getApi } from "@/app/api/api";
import { getSubFromJWT } from "@/app/utils/utils";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [todoLists, setTodoLists] = useState<any[]>([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Rename state
  const [renamingList, setRenamingList] = useState<any | null>(null);
  const [renameTitle, setRenameTitle] = useState("");

  const userId = getSubFromJWT(localStorage.getItem("access_token") || "");

  console.log("userId", userId);

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;

    try {
      const payload = { name: newListTitle };
      const response = await createApi("todo-apps", payload);

      if (response) {
        Swal.fire("Created!", "New List Created!", "success");
        setNewListTitle("");
        setIsDialogOpen(false);
        fetchData(); // Refresh the list from backend
      } else {
        Swal.fire("Error!", "Failed to create list!", "error");
      }
    } catch (error) {
      console.error("Error creating list:", error);
      Swal.fire("Error!", "Failed to create list!", "error");
    }
  };

  const fetchData = async () => {
    try {
      const response = await getApi("todo-apps");
      if (Array.isArray(response)) {
        const formatted = response.map((item: any) => ({
          id: item.id,
          title: item.name,
          ownerId: item?.ownerId,
        }));
        setTodoLists(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch todo lists:", error);
    }
  };

  // Inside the Dashboard component
  const handleDeleteList = async (listId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteApi(`todo-apps/${listId}`);
      await fetchData();
      Swal.fire("Deleted!", "Your list has been deleted.", "success");
    } catch (error) {
      console.error("Failed to delete list:", error);
      Swal.fire("Error!", "Failed to delete the list.", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My ToDo Lists</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New ToDo List</DialogTitle>
                <DialogDescription>
                  Give your new ToDo list a name to get started.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="list-title">List Title</Label>
                  <Input
                    id="list-title"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="e.g., Project Tasks"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateList}>Create List</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todoLists.map((list) => (
            <Card
              key={list.id}
              className="h-full hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <Link href={`/todo/${list.id}`}>
                  <CardTitle>{list.title}</CardTitle>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      disabled={list?.ownerId !== userId}
                      className="text-destructive"
                      onClick={() => handleDeleteList(list.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
