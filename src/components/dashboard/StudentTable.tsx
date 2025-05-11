"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/contexts/StudentContext";
import AddStudentDialog from "./AddStudentDialog";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { format } from "date-fns";
import React, { useState } from "react";
import type { Student } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentTable() {
  const { students, deleteStudent, isLoading } = useStudents();
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingStudent(undefined); // Clear student after dialog closes
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-12 w-full" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <AddStudentDialog 
          triggerButton={
            <Button variant="default" className="bg-accent hover:bg-accent/90">
              <UserPlus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          }
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
      {isEditDialogOpen && editingStudent && (
         <AddStudentDialog 
            student={editingStudent} 
            open={isEditDialogOpen}
            onOpenChange={closeEditDialog}
          />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No students found. Add one to get started!
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{format(new Date(student.dateOfBirth), "MMMM d, yyyy")}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(student)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the student record for {student.firstName} {student.lastName}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteStudent(student.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
