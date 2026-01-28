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
    <div className="p-8 max-w-5xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-[#11224E] tracking-wide">
          Patient Records
        </h1>

        <div className="overflow-x-auto">
          <div className="max-h-[65vh] overflow-y-auto relative border border-gray-100 rounded-lg">
            <Table className="w-full min-w-[600px] border-collapse">
              <TableCaption className="text-sm text-gray-500 mt-3">
                Example commands: <strong>“delete patient 2”</strong>,{" "}
                <strong>“update patient 4 age 29”</strong>
              </TableCaption>

              <TableHeader className="bg-[#11224E] rounded-lg hover:bg-[#11224E] transition-colors">
                <TableRow>
                  <TableHead className="text-white py-3 px-4 text-center w-[10%] rounded-l-lg">
                    No.
                  </TableHead>
                  <TableHead className="text-white px-18 text-left w-[50%]">
                    Name
                  </TableHead>
                  <TableHead className="text-white px-18 text-center w-[20%]">
                    Age
                  </TableHead>
                  <TableHead className="text-white px-18 text-center w-[20%] rounded-r-lg">
                    Gender
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {patients.map((p, index) => (
                  <TableRow
                    key={p.id}
                    className="hover:bg-[#11224E]/5 transition border-b border-gray-100"
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
    </div>
  );
}
