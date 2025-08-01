"use client";

import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import LoadingForm from "@/app/loading";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getActiveSessions,
  getActiveClasses,
  getStudent_ClassTransfer,
  promoteStudents,
  //   getStudentsInClass,
  //   promoteStudents,
} from "@/app/actions/fetch";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  fromSession: z.coerce.number().min(1, "Select Session"),
  fromClass: z.coerce.number().min(1, "Select Class"),
  fromsection: z.string().min(1, "Select Section"),
  toSession: z.coerce.number().min(1, "Select Session"),
  toClass: z.coerce.number().min(1, "Select Class"),
  tosection: z.string().min(1, "Select Section"),
  feeAmt: z.coerce.number().min(1, "Enter Fees Amount"),
  studentIds: z.array(z.number()).min(1, "Select at least one student"),
});

type FormData = z.infer<typeof formSchema>;

export default function PromotionPage() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
     resolver: zodResolver(formSchema) as Resolver<FormData>,
    defaultValues: {
      studentIds: [],
    },
  });

  const [sessions, setSessions] = useState<sessionMaster[]>([]);
  const [classes, setClasses] = useState<ClassMaster[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [markAllChecked, setMarkAllChecked] = useState(false); // ✅
  const [dataLoading, setDataLoading] = useState(true);

  const fromSession = watch("fromSession");
  const fromClass = watch("fromClass");
  const fromSection = watch("fromsection");
  const selectedIds = watch("studentIds");

  useEffect(() => {
    const fetchDropdowns = async () => {
      setDataLoading(true);
      const [sessions, classes] = await Promise.all([
        getActiveSessions(),
        getActiveClasses(),
      ]);
      setSessions(sessions);
      setClasses(classes);
      setDataLoading(false);
    };
    fetchDropdowns();
  }, []);
  useEffect(() => {
    if (students.length > 0) {
      setMarkAllChecked(selectedIds.length === students.length);
    }
  }, [selectedIds, students]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (fromSession && fromClass && fromSection) {
        setDataLoading(true);
        const list = await getStudent_ClassTransfer(
          fromSession,
          fromClass,
          fromSection
        );
        setStudents(list);
        setDataLoading(false);
      } else {
        setStudents([]);
      }
    };
    fetchStudents();
  }, [fromSession, fromClass, fromSection]);

  const onSubmit = async (data: FormData) => {
    if (
      data.fromSession + data.fromClass + data.fromsection ===
      data.toSession + data.toClass + data.tosection
    ) {
      alert("Please fill all required fields.");
      return;
    }
    console.log(data);

    setLoading(true);
    try {
      await promoteStudents(data);
      alert("Promotion successful!");
      reset();
    } catch (error) {
      console.error(error);
      alert("Error promoting students.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (id: number) => {
    const current = new Set(selectedIds);
    if (current.has(id)) current.delete(id);
    else current.add(id);
    setValue("studentIds", Array.from(current));
  };

  // ✅ Toggle select/deselect all
  const handleMarkAll = () => {
    if (!markAllChecked) {
      const allIds = students.map((s) => s.id);
      setValue("studentIds", allIds);
    } else {
      setValue("studentIds", []);
    }
    setMarkAllChecked(!markAllChecked);
  };
  if (dataLoading) {
    return  <LoadingForm />;
  }

  return (
    <div className="bg-card text-card-foreground w-180 m-4 p-6 rounded-lg shadow-md  mx-auto">
      <h1 className="text-2xl font-bold mb-4">Promote Students</h1>
      <p className="text-muted-foreground mb-6">
        Select a session, class, section, and students to promote.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 w-full">
            <label>From Session</label>
            <select
              {...register("fromSession", { valueAsNumber: true })}
              className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            >
              <option value="0">Select Session</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.sessionName}
                </option>
              ))}
            </select>
            {errors.fromSession && (
              <p className="text-red-500">{errors.fromSession.message}</p>
            )}
          </div>

          <div className="flex-1 w-full">
            <label>From Class</label>
            <select
              {...register("fromClass", { valueAsNumber: true })}
              className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            >
              <option value="0">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.class_name}
                </option>
              ))}
            </select>
            {errors.fromClass && (
              <p className="text-red-500">{errors.fromClass.message}</p>
            )}
          </div>
          <div className="flex-1 w-full">
            <label>From Section</label>
            <select
              {...register("fromsection")}
              className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            {errors.fromsection && (
              <p className="text-red-500">{errors.fromsection.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 w-full">
            <label>To Session</label>
            <select
              {...register("toSession", { valueAsNumber: true })}
                            className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            >
              <option value="0">Select Session</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.sessionName}
                </option>
              ))}
            </select>
            {errors.toSession && (
              <p className="text-red-500">{errors.toSession.message}</p>
            )}
          </div>

          <div className="flex-1 w-full">
            <label>To Class</label>
            <select
              {...register("toClass", { valueAsNumber: true })}
                            className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            >
              <option value="0">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.class_name}
                </option>
              ))}
            </select>
            {errors.toClass && (
              <p className="text-red-500">{errors.toClass.message}</p>
            )}
          </div>

          <div className="flex-1 w-full">
            <label>To Section</label>
            <select
              {...register("tosection")}
                            className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            {errors.tosection && (
              <p className="text-red-500">{errors.tosection.message}</p>
            )}
          </div>
        </div>

        <div>
          <label>Fee Amount</label>
          <input
            type="number"
            {...register("feeAmt", { valueAsNumber: true })}
                          className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            defaultValue={0}
          />
          {errors.feeAmt && (
            <p className="text-red-500">{errors.feeAmt.message}</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2 flex justify-between items-center">
            <span>Students to Promote</span>
            <Button 
            className="bg-[var(--color-chart-2)] text-white hover:bg-[color-mix(in oklch, var(--color-chart-2) 80%, black)] px-2 py-2 rounded-md shadow transition-colors"
            size="lg" 
            type="button" 
            onClick={handleMarkAll}
            >
          {markAllChecked ? "Unmark All" : "Mark All"}
        </Button>
            
          </h3>

          {students.length === 0 ? (
            <p>No students found for selected session/class.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-300 rounded">
                <thead className=" text-left text-secondary-foreground bg-secondary">
                  <tr>
                    <th className="p-2 text-center">#</th>
                    <th className="p-2 text-center">Select</th>
                    <th className="p-2">Student Name</th>
                    <th className="p-2">Father Name</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id} className="border-t">
                      <td className="p-2 text-center">{index + 1}</td>
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(student.id)}
                          checked={selectedIds?.includes(student.id)}
                        />
                      </td>
                      <td className="p-2">
                        {student.student.name.toUpperCase()}
                      </td>
                      <td className="p-2">
                        {student.student.fname.toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {errors.studentIds && (
            <p className="text-red-500 mt-2">{errors.studentIds.message}</p>
          )}
        </div>

        <Button className="bg-[var(--color-chart-2)] text-white hover:bg-[color-mix(in oklch, var(--color-chart-2) 80%, black)] px-3 py-2 rounded-md shadow transition-colors"
            size="lg" type="submit" disabled={loading}>
          {loading ? "Promoting..." : "Promote Students"}
        </Button>
      </form>
    </div>
  );
}
