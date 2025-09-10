"use client";

import { Building2, List, Loader2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useListSelect } from "@/hooks/data/lists/useListSelect";
import { useSharedLists } from "@/hooks/data/lists/useSharedLists";

export default function SelectBoardPage() {
  const { boards, isLoading, error, refetch } = useSharedLists();
  const { selectBoard, isSelecting, error: selectError } = useListSelect();
  const [selectedBoardList, setSelectedBoardList] = useState<{
    boardId: string;
    listId: string;
    boardName: string;
    listName: string;
  } | null>(null);

  const displayError = error?.message || selectError;

  const handleListSelect = (
    boardId: string,
    boardName: string,
    listId: string,
    listName: string
  ) => {
    setSelectedBoardList({ boardId, listId, boardName, listName });
  };

  const handleConfirmSelection = () => {
    if (selectedBoardList) {
      selectBoard(
        selectedBoardList.boardId,
        selectedBoardList.boardName,
        selectedBoardList.listId,
        selectedBoardList.listName
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading shared boards...</span>
        </div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{displayError}</p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              No Shared Boards Found
            </h3>
            <p className="text-muted-foreground mb-4">
              No creator management boards have been shared with you.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact your account manager to get access to boards.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Select Your Project Board</h1>
          <p className="text-muted-foreground">
            Choose a board to access your creator management dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {boards.map((board) => {
            return (
              <Card
                key={board.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: board.workspace.color }}
                    />
                    <span>{board.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {board.workspace.name} • {board.lists.length} lists
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Lists Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      Available Lists
                    </h4>
                    <div className="grid gap-2">
                      {board.lists.map((list) => {
                        const isSelected =
                          selectedBoardList?.listId === list.id;
                        return (
                          <Button
                            key={list.id}
                            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors bg-black/20 hover:bg-black/10
                            `}
                            onClick={() =>
                              handleListSelect(
                                board.id,
                                board.name,
                                list.id,
                                list.name
                              )
                            }
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm text-black ${
                                  isSelected ? "font-medium" : ""
                                }`}
                              >
                                {list.name}
                              </span>
                              {isSelected && (
                                <Badge variant="default" className="text-xs">
                                  Selected
                                </Badge>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {list.task_count} tasks
                            </Badge>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground mb-3">
                      Click a list above to select it for your dashboard
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center space-y-4">
          {selectedBoardList && (
            <div className="border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
              <h3 className="font-semibold mb-2">Selected:</h3>
              <p className="text-sm">
                <strong>Board:</strong> {selectedBoardList.boardName}
              </p>
              <p className="text-sm">
                <strong>List:</strong> {selectedBoardList.listName}
              </p>
              <Button
                onClick={handleConfirmSelection}
                disabled={isSelecting}
                className="w-full mt-3"
              >
                {isSelecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accessing...
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
