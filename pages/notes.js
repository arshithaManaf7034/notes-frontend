import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiRequest } from "../lib/api";

export default function Notes() {
  
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");


  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const colors = ["bg-yellow", "bg-orange", "bg-purple", "bg-green", "bg-blue"];
  const getColor = (index) => colors[index % colors.length];

  function logout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  async function loadNotes() {
    const data = await apiRequest("/notes", "GET", null, token);
    setNotes(data);
  }

  async function createNote() {
    await apiRequest("/notes", "POST", { title, content }, token);
    setTitle("");
    setContent("");
    loadNotes();
  }

  async function deleteNote(id) {
    if (!confirm("Are you sure you want to delete this note?")) return;
    await apiRequest(`/notes/${id}`, "DELETE", null, token);
    loadNotes();
  }
  async function updateNote(id) {
  try {
    await apiRequest(
      `/notes/${id}`,
      "PUT",
      { title: editTitle, content: editContent },
      token
    );

    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    loadNotes();
  } catch (err) {
    alert(err.message);
  }
}

  useEffect(() => {
    if (!token) router.push("/");
    else loadNotes();
  }, []);

  return (
    <div className="container">
      {/* TOP BAR */}
      <div className="topbar">
        <h2>My Notes</h2>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* CREATE NOTE */}
      <div className="form-card">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={createNote}>Create Note</button>
      </div>

      {/* NOTES GRID */}
     
        <div className="notes-grid">
          {notes.map((n, index) => (
          <div key={n.id} className={`note-card ${getColor(index)}`}>
            {editingId === n.id ? (
            <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />

          <button onClick={() => updateNote(n.id)}>Save</button>
          <button onClick={() => setEditingId(null)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{n.title}</h3>
          <p>{n.content}</p>

          <div className="note-footer">
            <small>
              Created:{" "}
              {n.created_at
                ? new Date(n.created_at).toLocaleDateString()
                : "—"}
            </small>

            <div style={{ marginTop: "8px" }}>
              <button
                onClick={() => {
                  setEditingId(n.id);
                  setEditTitle(n.title);
                  setEditContent(n.content);
                }}
              >
                Edit
              </button>

              {" | "}
              <a href={`/versions?noteId=${n.id}`}>View Versions</a>

              {" | "}
              <button
                onClick={() => deleteNote(n.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#dc2626",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  ))}
</div>


      {/* EMPTY STATE */}
      {notes.length === 0 && (
        <p style={{ marginTop: "40px", color: "#64748b" }}>
          You don’t have any notes yet. Create one above ✨
        </p>
      )}
    </div>
  );
}
