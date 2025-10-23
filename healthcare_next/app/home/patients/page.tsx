"use client";
import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export default function Patients() {

    const [patients, setpatients] = useState([])
    
    useEffect (() => {
        const fetchPatients = async () => {
            try{
                const res = await fetch('http://127.0.0.1:8000/patients')
                const data = await res.json()
                setpatients(data.patients);
            
            }catch(err){
                console.error("Failed to fetch patients:", err)
            }
        }
        fetchPatients()
    }, [])

    return (
        <Table>
        <TableCaption>List of Patients</TableCaption>
        <TableHeader>
          <TableRow>
          <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((p) => (
            <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
              <TableCell>{p.fname} {p.lname}</TableCell>
              <TableCell>{p.age}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}