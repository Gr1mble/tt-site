import React, { useState, useEffect } from "react";
import { db, storage } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import "./raceSigns.css";

export const RaceSigns = () => {
  const [raceSigns, setRaceSigns] = useState([]);

  const raceSignsCollectionRef = collection(db, "raceSigns");

  useEffect(() => {
    const unsubscribe = onSnapshot(raceSignsCollectionRef, async (snapshot) => {
      const dataPromises = snapshot.docs.map(async (doc) => {
        const docData = doc.data();
        let photoURL = "";
        try {
          photoURL = await getDownloadURL(
            ref(storage, `signPhotos/sign${docData.year}.JPG`)
          );
        } catch (error) {
          console.error("Error fetching photo URL:", error);
        }
        return {
          id: doc.id,
          title: docData.title,
          photo: photoURL,
          ...docData,
        };
      });

      try {
        const filteredData = await Promise.all(dataPromises);
        filteredData.sort((a, b) => b.year.localeCompare(a.year));
        setRaceSigns(filteredData);
      } catch (error) {
        console.error("Error processing race signs:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container raceSigns">
      <p>
        With every Race comes a sign that defines the year.
        <br />
        Below are the Race signs that we used to define not only our Race but
        the year leading up to it.
      </p>
      <br />
      <br />
      <div className="container raceSign text-center">
        <div className="row">
          {raceSigns.map((raceSign) => (
            <div className="col" key={raceSign.id}>
              <p className="row photo">{raceSign.title}</p>
              <img
                className="row signPhoto"
                src={raceSign.photo}
                alt={raceSign.title}
              />
              <p className="row photo">{raceSign.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
