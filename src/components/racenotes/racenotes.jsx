import { useEffect, useState, useRef } from "react";
import "./racenotes.css";
import { db, auth } from "../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Modal, Button } from "react-bootstrap";

export const Racenotes = () => {
  const [notes, setNotes] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [newOtherNotes, setnewOtherNotes] = useState("");
  const [motions, setMotions] = useState([
    { member: "", motion: "", second: "" },
  ]);

  const [modalShow, setModalShow] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const notesCollectionRef = collection(db, "notes");

  // Refs for textareas
  const motionRefs = useRef([]);
  const otherNotesRef = useRef(null);

  // Auto-resize helper
  const autoResize = (el) => {
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  const getNotes = async () => {
    try {
      const data = await getDocs(notesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitNotes = async () => {
    if (!newYear || !newOtherNotes) {
      alert("Please enter both year and description.");
      return;
    }

    const filteredMotions = motions.filter(
      (m) => m.member.trim() || m.motion.trim()
    );

    try {
      if (selectedNote && selectedNote.id) {
        await updateDoc(doc(db, "notes", selectedNote.id), {
          year: newYear,
          description: newOtherNotes,
          motions: filteredMotions,
        });
      } else {
        await addDoc(notesCollectionRef, {
          year: newYear,
          description: newOtherNotes,
          motions: filteredMotions,
        });
      }

      await getNotes();
      toggleModal();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const noteDoc = doc(db, "notes", id);
      await deleteDoc(noteDoc);
      resetStates();
      await getNotes();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleModal = () => {
    const closing = modalShow;
    setModalShow(!modalShow);
    if (closing) {
      resetStates();
    }
  };

  const showNote = (note) => () => {
    setSelectedNote(note);
    setnewOtherNotes(note.description);
    setNewYear(note.year);
    setMotions(note.motions || [{ member: "", motion: "", second: "" }]);
  };

  const resetStates = () => {
    setSelectedNote(null);
    setnewOtherNotes("");
    setNewYear("");
    setMotions([{ member: "", motion: "", second: "" }]);
  };

  // Auto-resize on open/edit
  useEffect(() => {
    if (modalShow) {
      // Resize motions
      motionRefs.current.forEach((ref) => autoResize(ref));
      // Resize other notes
      autoResize(otherNotesRef.current);
    }
  }, [modalShow, motions, newOtherNotes]);

  return (
    <div className="container raceNotes">
      {/* Header Row */}
      <div className="row">
        <div
          className="col-sm d-flex justify-content-between"
          style={{ borderBottom: "2px solid black" }}
        >
          <h3 id="yearsText" className="mr-3">
            Years
          </h3>
          <button
            hidden={!auth?.currentUser}
            onClick={() => {
              resetStates();
              toggleModal();
            }}
            className="toolButton"
            style={{ marginLeft: "auto" }}
          >
            +
          </button>
        </div>

        <div
          className="col-md d-flex justify-content-between"
          style={{
            borderLeft: "2px solid black",
            borderBottom: "2px solid black",
          }}
        >
          <h3 id="yearsText" className="mr-3">
            Notes
          </h3>
          <div className="toolButtonContainer" style={{ marginLeft: "auto" }}>
            <button
              type="button"
              hidden={!auth?.currentUser || !selectedNote}
              disabled={!selectedNote}
              className="toolButton"
              onClick={() => deleteNote(selectedNote?.id)}
            >
              Delete
            </button>
            <button
              type="button"
              hidden={!auth?.currentUser || !selectedNote}
              disabled={!selectedNote}
              className="toolButton"
              onClick={() => toggleModal()}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="row">
        <div className="col-sm">
          <div className="yearButtonContainer">
            {notes
              .sort((a, b) => b.year - a.year)
              .map((note) => (
                <button
                  className="yearButton"
                  key={note.id}
                  onClick={showNote(note)}
                >
                  {note.year}
                </button>
              ))}
          </div>
        </div>

        <div className="col-lg" style={{ borderLeft: "2px solid black" }}>
          <h4>Motions</h4>
          {selectedNote?.motions?.map((pair, index) => (
            <div className="motionContainer" key={index}>
              <p className="modalInfo">
                <b>Member:</b> {pair.member}
              </p>
              <p className="modalInfo">
                <b>Motion:</b> {pair.motion}
              </p>
              <p className="modalInfo">
                <b>Second?:</b> {pair.second}
              </p>
            </div>
          ))}
          <br />
          <h4>Other Notes</h4>
          <p>{newOtherNotes}</p>
        </div>
      </div>

      {/* Modal */}
      <Modal show={modalShow} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedNote ? "Edit Note" : "Add Note"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Race Year */}
          <div className="modalRow">
            <h5>Race Year</h5>
            <input
              type="number"
              placeholder="Year"
              value={newYear}
              className="modalInput"
              onChange={(e) => setNewYear(e.target.value)}
            />
          </div>

          {/* Motions */}
          <h5>Motions</h5>
          <div className="modalMotions">
            {motions.map((pair, index) => (
              <div className="modalChunk" key={index}>
                <div className="motion-pair">
                  <div className="motionField">
                    <label>Member</label>
                    <input
                      type="text"
                      placeholder="Member"
                      value={pair.member}
                      onChange={(e) => {
                        const updated = [...motions];
                        updated[index].member = e.target.value;
                        setMotions(updated);
                      }}
                    />
                  </div>
                  <div className="motionField">
                    <label>Second</label>
                    <input
                      type="text"
                      placeholder="Second"
                      value={pair.second}
                      onChange={(e) => {
                        const updated = [...motions];
                        updated[index].second = e.target.value;
                        setMotions(updated);
                      }}
                    />
                  </div>
                </div>
                <div className="motionField">
                  <label>Motion</label>
                  <textarea
                    ref={(el) => (motionRefs.current[index] = el)}
                    placeholder="Motion"
                    value={pair.motion}
                    onChange={(e) => {
                      const updated = [...motions];
                      updated[index].motion = e.target.value;
                      setMotions(updated);
                      autoResize(e.target);
                    }}
                    className="motionTextarea autoResize"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="primary"
              onClick={() =>
                setMotions([
                  ...motions,
                  { member: "", motion: "", second: "", isNew: true },
                ])
              }
            >
              + Add Member/Motion
            </Button>
          </div>

          <h5>Other Notes</h5>
          <textarea
            ref={otherNotesRef}
            placeholder="Description"
            value={newOtherNotes}
            className="motionTextarea autoResize"
            onChange={(e) => {
              setnewOtherNotes(e.target.value);
              autoResize(e.target);
            }}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={onSubmitNotes}>
            Save Note
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
