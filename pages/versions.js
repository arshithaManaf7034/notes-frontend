import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiRequest } from "../lib/api";

export default function Versions() {
  const router = useRouter();
  const { noteId } = router.query;

  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function loadVersions() {
    try {
      const data = await apiRequest(
        `/notes/${noteId}/versions`,
        "GET",
        null,
        token
      );
      setVersions(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function restoreVersion(versionNumber) {
    try {
      await apiRequest(
        `/notes/${noteId}/versions/${versionNumber}/restore`,
        "POST",
        null,
        token
      );
      alert(`Restored to version ${versionNumber}`);
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    if (noteId) {
      loadVersions();
    }
  }, [noteId]);

  if (loading) return <p>Loading versions...</p>;

  return (
    <div>
      <h1>Version History (Note {noteId})</h1>

      {versions.length === 0 && <p>No versions found</p>}

      <ul>
        {versions.map((v) => (
          <li key={v.id} style={{ marginBottom: "10px" }}>
            <strong>Version {v.version_number}</strong>
            <br />
            <pre>{v.content}</pre>
            <button onClick={() => restoreVersion(v.version_number)}>
              Restore this version
            </button>
          </li>
        ))}
      </ul>

      <button onClick={() => router.push("/notes")}>Back to Notes</button>
    </div>
  );
}
