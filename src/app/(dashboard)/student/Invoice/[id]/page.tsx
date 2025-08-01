"use client";
/*
// app/student/invoice/[id]/page.tsx

import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getStudentInvoiceData } from "@/app/actions/fetch";
import React from "react";

export default function InvoicePage({ params }: { params: { id: string } }) {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const [data, setData] = React.useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await getStudentInvoiceData(Number(params.id)); // You should define this
      setData(res);
    }
    fetchData();
  }, [params.id]);

  if (!data) return <p>Loading invoice...</p>;

  return (
    <div className="p-8">
      <button
        onClick={handlePrint}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Print Invoice
      </button>

      <div ref={printRef} className="bg-white p-6 shadow-md max-w-xl mx-auto border">
        <h2 className="text-2xl font-bold mb-4 text-center">Student Invoice</h2>

        <div className="space-y-2 text-sm">
          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Student Name:</strong> {data.student.name}</p>
          <p><strong>Class:</strong> {data.class.class_name}</p>
          <p><strong>Session:</strong> {data.session.sessionName}</p>
          <p><strong>Section:</strong> {data.section}</p>
          <p><strong>Fee Amount:</strong> Rs. {data.feeAmt}</p>
        </div>

        <hr className="my-4" />

        <p className="text-xs text-gray-600 text-center">Thank you for your payment.</p>
      </div>
    </div>
  );
}
*/

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
const data = {
  student: "GHAZALA RAMZAN",
  father: "MOHAMMAD RAMZAN",
  class: "CLASS I",
  section: "A",
  amount: 1200,
};

export default function PrintableInvoice() {
  const printRef = useRef(null);

//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//   });
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });


  return (
    <div className="p-4">
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Print Invoice
      </button>

      <div ref={printRef} className="border p-4 max-w-5xl mx-auto text-sm font-sans">
        <div className="flex justify-between text-xs mb-2">
          <span>{new Date().toLocaleString()}</span>
          <span>Printed By: RASHID</span>
        </div>

        <div className="flex border-t border-black pt-2">
          {/* Left Copy */}
          <div className="w-1/2 pr-4 border-r border-dotted border-black">
            <div className="text-center font-bold">
              <p className="text-lg">B.M.B. TODDLERS</p>
              <p className="uppercase text-sm">Girls Primary & Secondary School</p>
              <p className="text-xs">
                NARAIN DAS BUILDING A.M.4.<br />
                FRERE ROAD, KARACHI. TEL: 021-32211003
              </p>
              <p className="mt-2 text-blue-600 font-semibold">FOR OFFICE USE ONLY</p>
            </div>

            <div className="mt-4">
              <p><strong>Slip #</strong> 1003</p>
              <p><strong>Date:</strong> 21-Aug-2020</p>
              <p><strong>Name of Student:</strong> {data.student}</p>
              <p><strong>Father's Name:</strong> {data.father}</p>
              <p><strong>Class:</strong> {data.class}</p>
              <p><strong>Section:</strong> {data.section}</p>
              <p><strong>Amount in Rupees:</strong> {data.amount.toLocaleString()}</p>
            </div>

            <table className="mt-4 w-full border border-collapse">
              <thead>
                <tr className="border">
                  <th className="border p-1">feetype</th>
                  <th className="border p-1">Month</th>
                  <th className="border p-1">Session</th>
                  <th className="border p-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">TUITION FEES</td>
                  <td className="border p-1">August-2020</td>
                  <td className="border p-1">2020-2021</td>
                  <td className="border p-1">{data.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between mt-6 text-xs">
              <span>Printed By: RASHID</span>
              <span>Authorized Signature</span>
            </div>
          </div>

          {/* Right Copy */}
          <div className="w-1/2 pl-4">
            <div className="text-center font-bold">
              <p className="text-lg">B.M.B. TODDLERS</p>
              <p className="uppercase text-sm">Girls Primary & Secondary School</p>
              <p className="text-xs">
                NARAIN DAS BUILDING A.M.4.<br />
                FRERE ROAD, KARACHI. TEL: 021-32211003
              </p>
            </div>

            <div className="mt-4">
              <p><strong>Slip #</strong> 1003</p>
              <p><strong>Date:</strong> 21-Aug-2020</p>
              <p><strong>Name of Student:</strong> {data.student} {data.father}</p>
              <p><strong>Amount in Rupees:</strong> {data.amount.toLocaleString()}</p>
              <p><strong>Class:</strong> {data.class} - {data.section}</p>
              <p><strong>Amount in Words:</strong> ONE THOUSAND TWO HUNDRED ONLY</p>
            </div>

            <table className="mt-4 w-full border border-collapse">
              <thead>
                <tr className="border">
                  <th className="border p-1">Fee Type</th>
                  <th className="border p-1">Month</th>
                  <th className="border p-1">Session</th>
                  <th className="border p-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">TUITION FEES</td>
                  <td className="border p-1">August-2020</td>
                  <td className="border p-1">2020-2021</td>
                  <td className="border p-1">{data.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <p className="text-center text-xs italic mt-6">
              This is a computer generated bill and does not require any signature and stamp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
