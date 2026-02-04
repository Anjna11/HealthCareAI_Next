"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/appointments");
        const data = await res.json();
        setAppointments(data.appointments);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="shadow-sm p-2.5">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px] border-collapse">

            <TableHeader className="bg-[var(--data-table-header-back)] text-[var(--data-table-header-fore)]">
              <TableRow>
                <TableHead className="py-3 px-4 text-center w-[50px]">
                  No.
                </TableHead>
                <TableHead className="px-4 text-left w-[180px]">
                  Patient
                </TableHead>
                <TableHead className="px-4 text-left w-[120px]">
                  Date
                </TableHead>
                <TableHead className="px-4 text-left w-[140px]">
                  Type
                </TableHead>
                <TableHead className="px-4 text-left w-[180px]">
                  Doctor
                </TableHead>
                <TableHead className="px-4 text-left w-[220px]">
                  Doctor specialization
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {appointments.map((a, index) => (
                <TableRow
                  key={a.id}
                  onClick={() => router.push(`/home/appointments/profile?id=${a.id}&patient_name=${a.patient_name}
                    &date=${a.date}&age=${a.age}&gender=${a.gender}`)}
                  className="bg-[var(--data-table-row-back)] text-[var(--data-table-row-fore)]"
                >
                  <TableCell className="font-semibold text-left px-6 w-[70px]">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-left px-4 w-[35%]">
                    {a.patient_name}
                  </TableCell>
                  <TableCell className="text-left px-4 w-[200px]">
                    {a.date}
                  </TableCell>
                  <TableCell className="text-left px-4 w-[200px]">
                    {a.type}
                  </TableCell>
                  <TableCell className="text-left px-4 w-[200px]">
                    {a.doctor_name}
                  </TableCell>
                  <TableCell className="text-left px-4 w-[200px]">
                    {a.doctor_specialization}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
