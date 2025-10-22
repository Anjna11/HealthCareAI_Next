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

    const patients_ls = [
        {
            name: "ABC",
            age: 12
        },
        {
            name: "XYZ",
            age: 12
        },
        {
            name: "XYZ",
            age: 12
        }
    ]

    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    patients_ls.map((item, index) => {
                      return (
                        <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.age}</TableCell>
                        </TableRow>
                      )  
                    })
                }
            </TableBody>
        </Table>
    )
}