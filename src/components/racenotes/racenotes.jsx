import { useEffect, useState } from "react";
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
  const [newDescription, setNewDescription] = useState("");
  const [motions, setMotions] = useState([{ member: "", motion: "" }]);

  const [modalShow, setModalShow] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const notesCollectionRef = collection(db, "notes");

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
    if (!newYear || !newDescription) {
      alert("Please enter both year and description.");
      return;
    }

    const filteredMotions = motions.filter(
      (m) => m.member.trim() || m.motion.trim()
    );

    try {
      if (selectedNote && selectedNote.id) {
        // Edit existing note
        await updateDoc(doc(db, "notes", selectedNote.id), {
          year: newYear,
          description: newDescription,
          motions: filteredMotions,
        });
      } else {
        // Add new note
        await addDoc(notesCollectionRef, {
          year: newYear,
          description: newDescription,
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
    setNewDescription(note.description);
    setNewYear(note.year);
    setMotions(note.motions || [{ member: "", motion: "" }]);
  };

  const resetStates = () => {
    setSelectedNote(null);
    setNewDescription("");
    setNewYear("");
    setMotions([{ member: "", motion: "" }]);
  };

  return (
    <div className="container raceNotes">
      <div className="row">
        <div
          className="col-sm d-flex justify-content-between align-items-center"
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
          className="col-md d-flex justify-content-between align-items-center"
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
          <h4>Description</h4>
          <p>{newDescription}</p>
          <br />
          <h4>Motions</h4>
          {selectedNote?.motions?.map((pair, index) => (
            <div className="motionContainer" key={index}>
              <p>Member: {pair.member}</p>
              <p>Motion: {pair.motion}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal show={modalShow} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedNote ? "Edit Note" : "Add Note"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Year</h5>
          <input
            type="number"
            placeholder="Year"
            value={newYear}
            className="modalInput"
            onChange={(e) => setNewYear(e.target.value)}
          />
          <h5>Description</h5>
          <input
            type="text"
            placeholder="Description"
            value={newDescription}
            className="modalInput"
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <br />
          <h5>Motions</h5>
          <div className="modalMotions">
            {motions.map((pair, index) => (
              <div key={index} className="motion-pair">
                <input
                  type="text"
                  placeholder="Member"
                  className="modalInput"
                  value={pair.member}
                  onChange={(e) => {
                    const updated = [...motions];
                    updated[index].member = e.target.value;
                    setMotions(updated);
                  }}
                />
                <input
                  type="text"
                  placeholder="Motion"
                  className="modalInput"
                  value={pair.motion}
                  onChange={(e) => {
                    const updated = [...motions];
                    updated[index].motion = e.target.value;
                    setMotions(updated);
                  }}
                />
              </div>
            ))}
          </div>
          <Button
            variant="link"
            onClick={() => setMotions([...motions, { member: "", motion: "" }])}
          >
            + Add Member/Motion
          </Button>
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
