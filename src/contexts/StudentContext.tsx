"use client";

import type { Student } from "@/types";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface StudentContextType {
  students: Student[];
  isLoading: boolean;
  addStudent: (student: Omit<Student, "id">) => Promise<void>;
  updateStudent: (studentId: string, studentData: Partial<Omit<Student, "id">>) => Promise<void>;
  deleteStudent: (studentId: string) => Promise<void>;
  getStudentById: (studentId: string) => Student | undefined;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const MOCK_STUDENTS_DB_KEY = "credentialSafeStudents";

const getMockStudents = (): Student[] => {
  if (typeof window === "undefined") return [];
  const studentsStr = localStorage.getItem(MOCK_STUDENTS_DB_KEY);
  if (!studentsStr) return [];
  const students = JSON.parse(studentsStr);
  // Ensure dateOfBirth is a Date object
  return students.map((s: any) => ({ ...s, dateOfBirth: new Date(s.dateOfBirth) }));
};

const saveMockStudents = (students: Student[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_STUDENTS_DB_KEY, JSON.stringify(students));
};


export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setStudents(getMockStudents());
    setIsLoading(false);
  }, []);

  const addStudent = async (studentData: Omit<Student, "id">) => {
    setIsLoading(true);
    const newStudent: Student = { ...studentData, id: Date.now().toString() };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    saveMockStudents(updatedStudents);
    toast({ title: "Student Added", description: `${newStudent.firstName} ${newStudent.lastName} has been added.` });
    setIsLoading(false);
  };

  const updateStudent = async (studentId: string, studentData: Partial<Omit<Student, "id">>) => {
    setIsLoading(true);
    const updatedStudents = students.map(s =>
      s.id === studentId ? { ...s, ...studentData } : s
    );
    setStudents(updatedStudents);
    saveMockStudents(updatedStudents);
    toast({ title: "Student Updated", description: "Student record has been updated." });
    setIsLoading(false);
  };

  const deleteStudent = async (studentId: string) => {
    setIsLoading(true);
    const studentToDelete = students.find(s => s.id === studentId);
    const updatedStudents = students.filter(s => s.id !== studentId);
    setStudents(updatedStudents);
    saveMockStudents(updatedStudents);
    if (studentToDelete) {
       toast({ title: "Student Deleted", description: `${studentToDelete.firstName} ${studentToDelete.lastName} has been deleted.` });
    }
    setIsLoading(false);
  };
  
  const getStudentById = (studentId: string): Student | undefined => {
    return students.find(s => s.id === studentId);
  };

  return (
    <StudentContext.Provider value={{ students, isLoading, addStudent, updateStudent, deleteStudent, getStudentById }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
};
