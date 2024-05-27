import React, { useEffect, useState } from "react";
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
import { Modal, Button, Alert } from "react-bootstrap";

export const Racenotes = () => {
  const [notes, setNotes] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const notesCollectionRef = collection(db, "notes");

  const [active, setActive] = useState(0);

  const getNotes = async () => {
    try {
      const data = await getDocs(notesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotes();
  });

  const onSubmitNotes = async () => {
    try {
      if (selectedNote && selectedNote.id) {
        await editDescription(selectedNote.id); // Edit existing note
      } else {
        await addDoc(notesCollectionRef, {
          year: newYear,
          description: newDescription,
        }); // Add new note
        getNotes();
        toggleModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const noteDoc = doc(db, "notes", id);
      await deleteDoc(noteDoc);
      await resetStates();
      await getNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const editDescription = async (id) => {
    try {
      const note = notes.find((note) => note.id === id);

      if (note) {
        await updateDoc(doc(db, "notes", id), {
          description: newDescription,
          year: newYear,
        });
        await getNotes();
      } else {
      }
    } catch (error) {
      console.log(error);
      alert("Please select a year");
    }
  };

  const toggleModal = () => {
    setModalShow(!modalShow);
  };

  const showNote = (note) => () => {
    setSelectedNote(note);
    setNewDescription(note.description);
    setNewYear(note.year);
  };

  const resetStates = () => {
    setSelectedNote(null);
    setNewDescription("");
    setNewYear("");
  };

  return (
    <div className="container raceNotes">
      <div className="row">
        <div
          className="col-sm d-flex justify-content-between align-items-center"
          style={{
            borderBottom: "2px solid black",
          }}
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
            style={{
              marginLeft: "auto",
            }}
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
          <div
            className="toolButtonContainer"
            style={{
              marginLeft: "auto",
            }}
          >
            <button
              type="button"
              hidden={!auth?.currentUser}
              disabled={!selectedNote}
              className="toolButton"
              onClick={() => deleteNote(selectedNote?.id)}
            >
              Delete
            </button>
            <button
              type="button"
              hidden={!auth?.currentUser}
              disabled={!selectedNote}
              className="toolButton"
              onClick={() => {
                toggleModal();
                editDescription(selectedNote?.id);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          {notes
            .sort((a, b) => b.year - a.year)
            .map((note, idx) => (
              <div className="col-lg" key={note.id}>
                <button className="yearButton" onClick={showNote(note)}>
                  {note.year}
                </button>
              </div>
            ))}
        </div>

        <div className="col-lg" style={{ borderLeft: "2px solid black" }}>
          <p>{newDescription}</p>
        </div>
      </div>

      <Modal show={modalShow} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="number"
            placeholder="Year"
            value={newYear}
            className="modalInput"
            onChange={(e) => setNewYear(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={newDescription}
            className="modalInput"
            onChange={(e) => setNewDescription(e.target.value)}
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
