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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-[#11224E] tracking-wide">
          Appointment Schedule
        </h1>

        <div className="overflow-x-auto">
          <Table className="w-full table-fixed border-collapse">
            <TableCaption className="text-sm text-gray-500 mt-3">
              Example:{" "}
              <strong>
                “add appointment for patient 4 on 2025-03-15 type checkup”
              </strong>
            </TableCaption>

            <TableHeader>
              <TableRow className="bg-[#11224E] rounded-lg hover:bg-[#11224E] transition-colors">
                <TableHead className="text-white py-3 px-4 text-center w-[60px] rounded-l-lg">
                  No.
                </TableHead>
                <TableHead className="text-white px-4 text-left w-[180px]">
                  Patient
                </TableHead>
                <TableHead className="text-white px-4 text-left w-[140px]">
                  Date
                </TableHead>
                <TableHead className="text-white px-4 text-left w-[155px]">
                  Type
                </TableHead>
                <TableHead className="text-white px-4 text-left w-[175px]">
                  Doctor
                </TableHead>
                <TableHead className="text-white px-4 text-left w-[180px] rounded-r-lg">
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
                  className="hover:bg-[#11224E]/5 transition border-b border-gray-100"
                >
                  <TableCell className="font-semibold text-left px-6 w-[70px]">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-left px-4 w-[35%] truncate">
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
