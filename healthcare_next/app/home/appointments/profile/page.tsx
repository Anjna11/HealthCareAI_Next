"use client";
import { useSearchParams } from "next/navigation";
import { User2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const patient_name = searchParams.get("patient_name");
  const age = searchParams.get("age");
  const gender = searchParams.get("gender");

  const initials = patient_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "";

  const [visits, setVisits] = useState([]);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");

  const toggleVisit = (index) => {
    setExpandedVisit(expandedVisit === index ? null : index);
    setActiveTab("notes"); 
  };

  useEffect(() => {
    if (!id) return;
  
    console.log("ID sent to backend:", id);
  
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/get_allAppointments/${id}`);
        const data = await res.json();

        console.log("Fetched appointments:", data.allAppointments_list); 
        setVisits(data.allAppointments_list || []);
      
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };
  
    fetchAppointments();
  }, [id]);
  

  return (
    <div className="p-8 max-w-5xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ==== Patient Info ==== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
        <div className="bg-[#7b3e57] text-white w-14 h-14 rounded-md flex items-center justify-center text-xl font-bold">
          {initials}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">{patient_name}</h1>
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <User2 size={14} /> {gender}
            </span>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
              Active Visit
            </span>
          </div>

          <div className="text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-3">
            <span className="bg-gray-100 px-2 py-0.5 rounded">
              DHANOMI ID: <strong className="font-mono">{id}</strong>
            </span>
            <span>Age: {age}</span>
          </div>
        </div>
      </div>

      {/* ==== Modern Visits Section ==== */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-5">Visits</h2>

        {visits.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No visits recorded for this patient.</div>
        ) : (
          visits.map((v, index) => (
            <div
              key={index}
              className={`border rounded-xl mb-4 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer
                ${expandedVisit === index ? "border-[#F87B1B]" : "border-gray-100"}`}
            >
              <div
                className="flex justify-between items-center bg-gray-50 px-4 py-2"
                onClick={() => toggleVisit(index)}
              >
                <span className="text-gray-800 font-medium text-lg">{v.date}</span>
                <span className="text-gray-600 text-sm">{v.startTime} - {v.endTime}</span>
              </div>

              {expandedVisit === index && (
                <div className="bg-white p-5 border-t border-gray-200">

                  <div className="flex gap-6 border-b border-gray-200 mb-4">
                    {["notes", "medications", "reports"].map((tab) => (
                      <button
                        key={tab}
                        className={`pb-2 text-lg font-medium ${
                          activeTab === tab
                            ? "border-b-2 border-[#F87B1B] text-[#F87B1B]"
                            : "text-gray-500 hover:text-gray-700"
                        } transition`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="text-gray-700 mt-2 space-y-2">
                    {activeTab === "notes" && (
                      <p className="text-gray-600">{v.notes || "No notes available."}</p>
                    )}

                    {activeTab === "medications" && (
                      <ul className="list-disc ml-5 text-gray-600">
                        {(v.medication || []).length > 0
                          ? v.medication.map((m, i) => <li key={i}>{m}</li>)
                          : <li>No medications.</li>}
                      </ul>
                    )}

                    {activeTab === "reports" && (
                      <ul className="list-disc ml-5 text-gray-600">
                        {(v.reports || []).length > 0
                          ? v.reports.map((r, i) => <li key={i}>{r.type}: {r.result}</li>)
                          : <li>No reports.</li>}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
