"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2 } from 'lucide-react'
import LoadingForm from "@/app/loading";
import { Button } from "@/components/ui/button";
import { createOrUpdateStudent, getStudentById } from "@/app/actions/fetch";

const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fname: z.string().min(1, "Father Name is required"),
  mname: z.string().optional(),
  contactno: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  dob: z
    .string()
    .refine((val) => !isNaN(new Date(val).getTime()), "Invalid date format"),
  sex: z.enum(["MALE", "FEMALE"]),
  active: z.boolean(),
  donation: z.boolean(),
  fcnic: z
    .string()
    .regex(/^\d{5}-\d{7}-\d{1}$/, "Invalid CNIC format. Use 12345-1234567-1")
    .optional()
    .or(z.literal("")), // allow empty string too
  mcnic: z
    .string()
    .regex(/^\d{5}-\d{7}-\d{1}$/, "Invalid CNIC format. Use 12345-1234567-1")
    .optional()
    .or(z.literal("")),
});

type StudentFormData = z.output<typeof studentSchema>;

export default function StudentFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: { sex: "MALE", active: true, donation: false },
  });
useEffect(() => {
  const loadAllData = async () => {
    try {
      setDataLoading(true)
      

      if (id) {
        const student = await getStudentById(id)
        if (student) {
          // Transform student object to match form types
          reset({
            ...student,
            mname: student.mname ?? "",
            address: student.address ?? "",
            dob: student.dob ? new Date(student.dob).toISOString().slice(0, 10) : "",
            fcnic: student.fcnic ?? "",
            mcnic: student.mcnic ?? "",
          });
        }
        else {
          alert('Student not found')
          router.push('/student')
        }
      }
    } catch (err) {
      console.error('Error loading data:', err)
      alert('Failed to load form data')
    } finally {
      setDataLoading(false)
    }
  }

  loadAllData()
}, [id, reset, router])


const onSubmit = async (formData: StudentFormData) => {
  setLoading(true)

  const transformedData = {
    ...formData,
    name: formData.name.toUpperCase(),
    fname: formData.fname.toUpperCase(),
    mname: formData.mname?.toUpperCase() || '',
    dob: new Date(formData.dob),
  }

  try {
    await createOrUpdateStudent(id, transformedData)
    alert(id ? 'Student updated successfully!' : 'Student created successfully!')
    router.push('/student')
  } catch (err) {
    console.error('Error saving student:', err)
    alert('Failed to save student')
  } finally {
    setLoading(false)
  }
}


  // ✅ Loading UI while fetching sessions, classes, or student
  // if (dataLoading) {
  //   return (
  //     <div className="w-full h-96 flex justify-center items-center text-lg text-muted-foreground">
  //       <Loader2 className="animate-spin mr-2 h-6 w-6" />
  //       Loading form data...
  //     </div>
  //   )
  // }

  if (dataLoading) {
    return <LoadingForm />;
  }

  return (
    <div className="bg-card text-card-foreground w-120 m-4 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Student" : "Add New Student"}
      </h1>
      <p className="text-muted-foreground mb-6">
        {id
          ? "Update the student details below."
          : "Fill in the details below to add a new student."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {[
          { label: "Name", name: "name" },
          { label: "Father Name", name: "fname" },
          { label: "Mother Name", name: "mname" },
          { label: "Contact #", name: "contactno" },
          { label: "Address", name: "address" },
          { label: "Date of Birth", name: "dob", type: "date" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block mb-1 font-medium">{label}</label>
            <input
              type={type || "text"}
              {...register(name as keyof StudentFormData)}
              className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            />
            {errors[name as keyof StudentFormData] && (
              <p className="text-red-500 text-sm">
                {errors[name as keyof StudentFormData]?.message?.toString()}
              </p>
            )}
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Sex</label>
          <select
            {...register("sex")}
            className="border p-2 w-full bg-secondary text-secondary-foreground rounded"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex && (
            <p className="text-red-500 text-sm">{errors.sex.message}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div>
            <label className="block mb-1 font-medium">Active</label>
            <input
              type="checkbox"
              {...register("active")}
              className="border p-2 rounded"
            />
            {errors.active && (
              <p className="text-red-500 text-sm">{errors.active.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Donation</label>
            <input
              type="checkbox"
              {...register("donation")}
              className="border p-2 rounded"
            />
            {errors.donation && (
              <p className="text-red-500 text-sm">{errors.donation.message}</p>
            )}
          </div>
        </div>
        <div className="h-1 bg-primary "></div>
        <div className=" mb-4">
          <p className="text-muted-foreground text-lg font-bold underline">
            Additional Information
          </p>
          {/* <hr className="border-black" /> */}
        </div>

        {[
          { label: "Father CNIC", name: "fcnic" },
          { label: "Mother CNIC", name: "mcnic" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block mb-1 font-medium">{label}</label>
            <input
              type="text"
              {...register(name as keyof StudentFormData)}
              className="border p-2 w-full rounded bg-secondary text-secondary-foreground"
            />
            {errors[name as keyof StudentFormData] && (
              <p className="text-red-500 text-sm">
                {errors[name as keyof StudentFormData]?.message?.toString()}
              </p>
            )}
          </div>
        ))}

       

      

        <div className="flex items-center gap-4 mt-6">
          <Button
            type="submit"
            className="bg-[var(--color-chart-2)] text-white hover:bg-[color-mix(in oklch, var(--color-chart-2) 80%, black)] px-3 py-2 rounded-md shadow transition-colors"
            size="lg"
            disabled={loading}
          >
            {loading
              ? id
                ? "Updating..."
                : "Submitting..."
              : id
              ? "Update"
              : "Submit"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            onClick={() => router.push("/student")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
