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

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/patients");
        const data = await res.json();
        setPatients(data.patients);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="shadow-sm p-6">
        <h1 className="text-xl font-semibold mb-6 tracking-wide">
          Patient Records
        </h1>

        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px] border-collapse">
            <TableCaption className="text-sm text-gray-500 mt-3">
              Example commands: <strong>“delete patient 2”</strong>,{" "}
              <strong>“update patient 4 age 29”</strong>
            </TableCaption>

            <TableHeader className="bg-[var(--data-table-header-back)] text-[var(--data-table-header-fore)]">
              <TableRow>
                <TableHead className="py-3 px-4 text-center w-[10%]">
                  No.
                </TableHead>
                <TableHead className="px-18 text-left w-[50%]">
                  Name
                </TableHead>
                <TableHead className="px-18 text-center w-[20%]">
                  Age
                </TableHead>
                <TableHead className="px-18 text-center w-[20%]">
                  Gender
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {patients.map((p, index) => (
                <TableRow
                  key={p.id}
                  className="bg-[var(--data-table-row-back)] text-[var(--data-table-row-fore)]"
                >
                  <TableCell className="font-semibold text-center px-4">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-left px-18 whitespace-nowrap">
                    {p.fname} {p.lname}
                  </TableCell>
                  <TableCell className="text-center px-18">
                    {p.age}
                  </TableCell>
                  <TableCell className="text-center px-18">
                    {p.gender}
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
