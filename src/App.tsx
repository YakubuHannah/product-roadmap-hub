import React, { useEffect, useState } from "react";
import "./styles.css";

type Request = {
  id: string;
  title: string;
  priority?: string;
  status: string;
  description?: string;
  submittedBy?: string;
  productArea?: string;
  customerSegment?: string;
};

const AIRTABLE_TOKEN =
  "patpEZ58Yh16n217v.e4d84b534b111b2e3f7c25835f345a192ba7405a47807b5700617a5a1f6dc6f8"; // Replace with your real token
const BASE_ID = "appM8ReWfrdHHrz0H"; // Your Airtable Base ID
const TABLE_NAME = "Feature Requests"; // Your Airtable table name

const statuses = ["Idea", "In Review", "Planned", "In Progress", "Released"];

const App: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(
        TABLE_NAME
      )}`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.records.map((record: any) => ({
          id: record.id,
          title: record.fields["Request Title"] || "Untitled",
          priority: record.fields["Priority"] || "Low",
          status: record.fields["Status"] || "Idea",
          description: record.fields["Description"] || "",
          submittedBy: record.fields["Submitted By"] || "Unknown",
          productArea: record.fields["Product Area"] || "General",
          customerSegment: record.fields["Customer Segment"] || "N/A",
        }));
        setRequests(mapped);
      })
      .catch((error) => console.error("Airtable fetch error:", error));
  }, []);

  return (
    <div className="app">
      <h1 className="heading">Product–Support Roadmap</h1>
      <div className="kanban">
        {statuses.map((status) => (
          <div key={status} className="column">
            <h2>{status}</h2>
            {requests
              .filter((req) => req.status === status)
              .map((req) => (
                <div
                  key={req.id}
                  className={`card priority-${(
                    req.priority || "Low"
                  ).toLowerCase()}`}
                >
                  <h3>{req.title}</h3>
                  <p>
                    <strong>Raised by:</strong> {req.submittedBy}
                  </p>
                  <p>
                    <strong>Why it matters:</strong>
                    <br />
                    {req.description}
                  </p>
                  <p>
                    <strong>Product Impact:</strong>
                    <br />
                    Area: {req.productArea} <br />
                    Segment: {req.customerSegment}
                  </p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
