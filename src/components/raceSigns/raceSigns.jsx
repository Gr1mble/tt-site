import React, { useState, useEffect } from "react";
import { db, storage } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import "./raceSigns.css";

export const RaceSigns = () => {
  const [dataMap, setDataMap] = useState({});

  useEffect(() => {
    const raceSignsCollectionRef = collection(db, "raceSigns");

    const unsubscribe = onSnapshot(raceSignsCollectionRef, async (snapshot) => {
      const signsMap = {};

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
          ...docData,
          photo: photoURL,
        };
      });

      try {
        const filteredData = await Promise.all(dataPromises);
        filteredData.sort((a, b) => b.year.localeCompare(a.year)); // Sort data before mapping to hashmap
        filteredData.forEach((item) => {
          signsMap[item.id] = item;
        });
        setDataMap(signsMap);
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
          {Object.entries(dataMap).map(([id, item]) => (
            <div className="col item" key={id}>
              <h2 className="photo">{item.title}</h2>
              <img className="signPhoto" src={item.photo} alt={item.title} />
              <p className="photo">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
