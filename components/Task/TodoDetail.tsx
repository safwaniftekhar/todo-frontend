"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, UserPlus, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createApi, deleteApi, getApi, patchApi } from "@/app/api/api";
import Swal from "sweetalert2";
import { CollaboratorsList } from "./CollaboratorsList";

export default function TodoDetail() {
  const params = useParams();
  const id = params.id as string;

  const [todoList, setTodoList] = useState<{
    id: string;
    title: string;
    tasks: Array<{
      id: string;
      title: string;
      completed: boolean; // we'll derive from status
      dueDate?: string;
      priority?: number;
    }>;
    collaborators: Array<any>;
  }>({
    id,
    title: "Loading...",
    tasks: [],
    collaborators: [],
  });

  const [newTask, setNewTask] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [priority, setPriority] = useState(3); // Default to 3 or any other default you prefer
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // format: YYYY-MM-DD

  const [users, setUsers] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const [role, setRole] = useState("");

  const [editingTask, setEditingTask] = useState<null | {
    id: string;
    title: string;
    dueDate?: string;
    priority?: number;
  }>(null);

  const canEdit =
    role?.toLowerCase() === "owner" || role?.toLowerCase() === "editor";

  const canDelete = role?.toLowerCase() === "owner";

  const handleToggleTask = async (
    taskId: string,
    currentCompleted: boolean
  ) => {
    const newStatus = currentCompleted ? "IN_PROGRESS" : "COMPLETED";

    try {
      await patchApi(`tasks/${taskId}/status`, { status: newStatus });
      fetchData(); // Refresh the task list
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
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
      await deleteApi(`tasks/${taskId}`);
      await fetchData();
      Swal.fire("Deleted!", "Task has been deleted.", "success");
    } catch (error) {
      console.error("Failed to delete list:", error);
      Swal.fire("Error!", "Failed to delete the list.", "error");
    }
  };

  //     if (inviteEmail.trim()) {
  //       const newCollaborator = {
  //         id: `user-${Date.now()}`,
  //         name: inviteEmail.split("@")[0],
  //         email: inviteEmail,
  //         role: inviteRole,
  //       };

  //       setTodoList({
  //         ...todoList,
  //         collaborators: [...todoList.collaborators, newCollaborator],
  //       });

  //       setInviteEmail("");
  //       setInviteRole("viewer");
  //       setIsInviteDialogOpen(false);
  //     }
  //   };

  const handleChangeRole = (userId: string, newRole: string) => {
    const updatedCollaborators = todoList.collaborators.map((user) =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setTodoList({ ...todoList, collaborators: updatedCollaborators });
  };

  const handleRemoveCollaborator = (userId: string) => {
    const updatedCollaborators = todoList.collaborators.filter(
      (user) => user.id !== userId
    );
    setTodoList({ ...todoList, collaborators: updatedCollaborators });
  };

  const fetchData = async () => {
    try {
      const response = await getApi(`tasks/${id}`);
      const tasks = response?.tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        completed: task.status === "COMPLETED", // map status to boolean
        dueDate: task.dueDate,
        priority: task.priority,
      }));

      setRole(response?.access?.role);

      setTodoList((prev) => ({
        ...prev,
        id,
        title: `ToDo List (${id})`, // You can customize or fetch title from another endpoint
        tasks,
      }));
    } catch (error) {
      console.error("Failed to fetch todo list tasks:", error);
      setTodoList((prev) => ({
        ...prev,
        title: "Failed to load tasks",
      }));
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const body = {
        title: newTask,
        // status: "IN_PROGRESS",
        priority: Number(priority),
        dueDate: new Date(dueDate).toISOString(),
      };

      const createdTask = await createApi(`tasks/${id}`, body);

      if (createdTask) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getApi("users");
        // const data = await response.json();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleInviteUser = async () => {
    if (!selectedUserId || !inviteRole) {
      Swal.fire({
        icon: "warning",
        title: "Missing Info",
        text: "Please select a user and permission role.",
      });
      return;
    }

    try {
      console.log("handleInviteUser", selectedUserId, inviteRole);

      const payload = {
        email: selectedUserId, // Assuming selectedUserId holds email
        role: inviteRole,
      };

      const createdInvite = await createApi(`memberships/${id}`, payload);

      if (createdInvite) {
        await fetchData(); // optional if fetchData returns a Promise

        Swal.fire({
          icon: "success",
          title: "User Invited",
          text: "The user has been successfully invited.",
        });

        setIsInviteDialogOpen(false);
        setSelectedUserId("");
        setInviteRole("");
      }
    } catch (error) {
      console.error("Invite failed:", error);

      Swal.fire({
        icon: "error",
        title: "Invitation Failed",
        text: "Something went wrong while inviting the user.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-semibold text-xl">{todoList.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Dialog
              open={isInviteDialogOpen}
              onOpenChange={setIsInviteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button disabled={!canDelete} variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Collaborator</DialogTitle>
                  <DialogDescription>
                    Add a team member to collaborate on this ToDo list.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="user">Select User</Label>
                    <Select
                      value={selectedUserId}
                      onValueChange={setSelectedUserId}
                    >
                      <SelectTrigger id="user">
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.email}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Permission</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EDITOR">
                          Editor (can edit tasks)
                        </SelectItem>
                        <SelectItem value="VIEWER">
                          Viewer (read-only)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsInviteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleInviteUser}>Invite</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Tabs defaultValue="tasks">
          <TabsList className="mb-6">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger disabled={!canDelete} value="collaborators">
              Collaborators
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <form
                  onSubmit={handleAddTask}
                  className="flex items-center space-x-2"
                >
                  <Input
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />

                  <Select
                    value={priority.toString()}
                    onValueChange={(val) => setPriority(Number(val))}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-[140px]"
                  />

                  <Button type="submit" size="sm" disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {todoList.tasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No tasks yet. Add your first task above.
                </div>
              ) : (
                todoList.tasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={task.id}
                          checked={task.completed}
                          onCheckedChange={() =>
                            handleToggleTask(task.id, task.completed)
                          }
                          disabled={!canEdit}
                        />
                        <label
                          htmlFor={task.id}
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {task.title}{" "}
                          {task.dueDate && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (Due:{" "}
                              {new Date(task.dueDate).toLocaleDateString()})
                            </span>
                          )}
                          {task.priority !== undefined && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Priority: {task.priority}
                            </Badge>
                          )}
                        </label>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setEditingTask({
                              id: task.id,
                              title: task.title,
                              dueDate: task.dueDate,
                              priority: task.priority,
                            })
                          }
                          disabled={!canEdit}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={!canDelete}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="collaborators">
            <CollaboratorsList
              appId={id}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await patchApi(`tasks/${editingTask.id}`, {
                      title: editingTask.title,
                      dueDate: new Date(editingTask.dueDate!).toISOString(),
                      priority: editingTask.priority,
                    });
                    setEditingTask(null);
                    fetchData();
                  } catch (error) {
                    console.error("Failed to update task:", error);
                  }
                }}
                className="space-y-4"
              >
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={editingTask.dueDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        dueDate: new Date(e.target.value).toISOString(),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select
                    value={editingTask.priority?.toString() || ""}
                    onValueChange={(value) =>
                      setEditingTask({
                        ...editingTask,
                        priority: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
