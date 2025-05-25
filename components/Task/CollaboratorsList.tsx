"use client";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
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
import { getApi } from "@/app/api/api";
// import { getApi } from "@/lib/api"; // Replace with your actual API utility

interface Collaborator {
  membershipId: string;
  userId: string;
  email: string;
  name: string;
  role: "owner" | "editor" | "viewer";
}

interface CollaboratorsListProps {
  appId: string;
  handleChangeRole: (membershipId: string, role: "editor" | "viewer") => void;
  handleRemoveCollaborator: (membershipId: string) => void;
}

export const CollaboratorsList: React.FC<CollaboratorsListProps> = ({
  appId,
  handleChangeRole,
  handleRemoveCollaborator,
}) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await getApi(`memberships/${appId}`);
        const formatted = response.map((member: any) => ({
          membershipId: member.id,
          userId: member.user.id,
          email: member.user.email,
          name: member.user.email.split("@")[0], // fallback name
          role: member.role.toLowerCase(), // normalize "EDITOR" -> "editor"
        }));
        setCollaborators(formatted);
      } catch (error) {
        console.error("Failed to fetch collaborators:", error);
      }
    };

    fetchCollaborators();
  }, [appId]);

  return (
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
                        handleChangeRole(user.membershipId, value as "editor" | "viewer")
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
                      onClick={() => handleRemoveCollaborator(user.membershipId)}
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
  );
};
