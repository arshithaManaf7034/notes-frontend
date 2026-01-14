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
  }

  useEffect(() => {
    if (!token) router.push("/");
    else loadNotes();
  }, []);

  return (
    <div className="notes-page">
      {/* HEADER */}
      <header className="notes-header">
        <h1>My Notes</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      {/* CREATE NOTE */}
      <section className="create-note-card">
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

        <button className="primary-btn" onClick={createNote}>
          Create Note
        </button>
      </section>

      {/* NOTES GRID */}
      <section className="notes-grid">
        {notes.map((note, index) => (
          <div
            key={note.id}
            className={`note-card ${getColor(index)}`}
          >
            {editingId === note.id ? (
              <div className="edit-note">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />

                <div className="note-actions">
                  <button onClick={() => updateNote(note.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h3>{note.title}</h3>
                <p>{note.content}</p>

                <div className="note-footer">
                  <small>
                    Created:{" "}
                    {note.created_at
                      ? new Date(note.created_at).toLocaleDateString()
                      : "—"}
                  </small>

                  <div className="note-actions">
                    <button
                      onClick={() => {
                        setEditingId(note.id);
                        setEditTitle(note.title);
                        setEditContent(note.content);
                      }}
                    >
                      Edit
                    </button>

                    <a href={`/versions?noteId=${note.id}`}>
                      View Versions
                    </a>

                    <button
                      className="danger-btn"
                      onClick={() => deleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </section>

      {/* EMPTY STATE */}
      {notes.length === 0 && (
        <p className="empty-state">
          You don’t have any notes yet. Create one above ✨
        </p>
      )}
    </div>
  );
}
