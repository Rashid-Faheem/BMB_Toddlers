// app/student/class-assign/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getActiveClasses,
  getActiveSessions,
  getUnassignedStudents,
  insertnewClass,
} from "@/app/actions/fetch";
import { Button } from "@/components/ui/button";
import LoadingForm from "@/app/loading";
import { Student } from  "@prisma/client"

const formSchema = z.object({
  student_id: z.coerce.number().min(1, "Select Student"),
  class_id: z.coerce.number().min(1, "Select Class"),
  session_id: z.coerce.number().min(1, "Select Session"),
  section: z.string().min(1, "Select Section"),
  feeAmt: z.coerce.number().min(0, "Enter Amount"),
});

type FormData = z.infer<typeof formSchema>;

export default function ClassAssignPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
     resolver: zodResolver(formSchema) as Resolver<FormData>,
  });


  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassMaster[]>([]);
  const [sessions, setSessions] = useState<sessionMaster[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // Fetch dropdown data
    const fetchData = async () => {
      setDataLoading(true);

      const [sessions, classes, students] = await Promise.all([
        getActiveSessions(),
        getActiveClasses(),
        getUnassignedStudents(),
      ]);

      setSessions(sessions);
      setClasses(classes);
      setStudents(students);
      setDataLoading(false);
    };

    fetchData();
  }, []);

  const onSubmit = async (formData: FormData) => {
    if (formData.feeAmt === 0  ) {
      alert("Please enter Fees Amount.");
      return;
    }
    try {
      await insertnewClass(formData);

      alert("Assigned Successfully!");
      reset(); // 👈 Reset the form fields
      const updatedStudents = await getUnassignedStudents();
      setStudents(updatedStudents);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } 
  };

  if (dataLoading) {
    return <LoadingForm />;
  }

  return (
    <div className="bg-card text-card-foreground w-120 m-4 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Assign Class to Student</h1>
      <p className="text-muted-foreground mb-6">
        select a student and assign them to a class for the current session.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div >
          <label className="block mb-1 font-medium">Student</label>
          <select
            {...register("student_id", { valueAsNumber: true })}
            className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
          >
            <option value="0">Select Student</option>
            {students.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.student_id && (
            <p className="text-red-500 text-sm">{errors.student_id.message}</p>
          )}
        </div>

        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="w-[40%]">
            <label className="block mb-1 font-medium">Session</label>
            <select
              {...register("session_id", { valueAsNumber: true })}
              className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            >
              <option value="0">Select Session</option>
              {sessions.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.sessionName}
                </option>
              ))}
            </select>
            {errors.session_id && (
              <p className="text-red-500 text-sm">
                {errors.session_id.message}
              </p>
            )}
          </div>

          <div className="w-[40%]">
            <label className="block mb-1 font-medium">Class</label>
            <select
              {...register("class_id", { valueAsNumber: true })}
              className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            >
              <option value="0">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
            {errors.class_id && (
              <p className="text-red-500 text-sm">{errors.class_id.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="w-[40%]">
            <label htmlFor="" className="">
              Section
            </label>

            <select
              {...register("section")}
              className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>

            {errors.section && (
              <p className="text-red-500 text-sm">{errors.section.message}</p>
            )}
          </div>

          <div className="w-[40%]">
            <label className="block mb-1 font-medium">Fee Amount</label>
            <input
              type="number"
              {...register("feeAmt", { valueAsNumber: true })}
              placeholder="Enter Fee Amount"
              defaultValue={0}
              className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            />
            {errors.feeAmt && (
              <p className="text-red-500 text-sm">{errors.feeAmt.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          {/* <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Assign Class
          </button> */}
          <Button
            type="submit"
            className="bg-[var(--color-chart-2)] text-white hover:bg-[color-mix(in oklch, var(--color-chart-2) 80%, black)] px-3 py-2 rounded-md shadow transition-colors"
            size="lg"
          >
            Assign Class
          </Button>
        </div>
      </form>
    </div>
  );
}
