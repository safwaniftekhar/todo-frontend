"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteApi, getApi, patchApi } from "@/app/api/api";
import Swal from "sweetalert2";
import { Spin } from "antd";
interface Collaborator {
  membershipId: string;
  userId: string;
  email: string;
  name: string;
  role: "owner" | "editor" | "viewer";
}

interface CollaboratorsListProps {
  appId: string;
}

export const CollaboratorsList: React.FC<CollaboratorsListProps> = ({
  appId,
}) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCollaborators = async () => {
    try {
      setIsLoading(true);
      const response = await getApi(`memberships/${appId}`);
      const formatted = response.map((member: any) => ({
        membershipId: member.id,
        userId: member.user.id,
        email: member.user.email,
        name: member.user.email.split("@")[0], // fallback name
        role: member.role.toLowerCase(), // normalize "EDITOR" -> "editor"
      }));
      setCollaborators(formatted);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.error("Failed to fetch collaborators:", error);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, [appId]);

  const handleChangeRole = async (
    membershipId: string,
    role: "editor" | "viewer"
  ) => {
    try {
      setIsLoading(true);

      let response = await patchApi(`memberships/${appId}/${membershipId}`, {
        role: role.toUpperCase(),
      });

      if (response?.ok) {
        Swal.fire({
          icon: "success",
          title: "Role updated",
          text: `The role has been changed to ${role}.`,
        });
        setIsLoading(false);

        fetchCollaborators();
      } else {
        setIsLoading(false);
        Swal.fire("Error!", "Something went wrong", "error");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update role",
        text: "Please try again later.",
      });
    }
  };

  const handleRemoveCollaborator = async (membershipId: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove the collaborator from this project.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });

    if (!confirm.isConfirmed) return;

    try {
      setIsLoading(true);

      let response = await deleteApi(`memberships/${appId}/${membershipId}`);
      if (response?.ok) {
        Swal.fire({
          icon: "success",
          title: "Removed",
          text: "The collaborator has been removed.",
        });
        setIsLoading(false);

        fetchCollaborators();
      } else {
        setIsLoading(false);
        Swal.fire("Error!", "Something went wrong", "error");
      }
    } catch (error) {
      console.error("Failed to remove collaborator:", error);
      Swal.fire({
        icon: "error",
        title: "Removal failed",
        text: "Could not remove the collaborator.",
      });
      setIsLoading(false);
    }
  };

  return (
    <Spin spinning={isLoading}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-4">
            {collaborators.map((user) => (
              <div
                key={user.membershipId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {user.role === "owner" ? (
                    <Badge>Owner</Badge>
                  ) : (
                    <>
                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          handleChangeRole(
                            user.membershipId,
                            value as "editor" | "viewer"
                          )
                        }
                      >
                        <SelectTrigger className="w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveCollaborator(user.membershipId)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Spin>
  );
};
