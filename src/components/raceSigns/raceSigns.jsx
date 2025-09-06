import { useState, useEffect } from "react";
import { db, storage } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import "./raceSigns.css";

export const RaceSigns = () => {
  const [dataMap, setDataMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raceSignsCollectionRef = collection(db, "raceSigns");

    const fetchImageUrls = async (signs) => {
      const urlPromises = signs.map((sign) =>
        getDownloadURL(ref(storage, `signPhotos/sign${sign.year}.JPG`))
          .then((url) => ({ ...sign, photo: url }))
          .catch((error) => {
            console.error("Error fetching photo URL:", error);
            return { ...sign, photo: "" }; // Fallback in case of an error
          })
      );

      return Promise.all(urlPromises);
    };

    const unsubscribe = onSnapshot(raceSignsCollectionRef, async (snapshot) => {
      const signs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      try {
        const signsWithUrls = await fetchImageUrls(signs);
        signsWithUrls.sort((a, b) => b.year.localeCompare(a.year));
        setDataMap(
          signsWithUrls.reduce((map, sign) => ({ ...map, [sign.id]: sign }), {})
        );
        setLoading(false);
      } catch (error) {
        console.error("Error processing race signs:", error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading images...</div>; // Placeholder loading state
  }

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
              <img
                className="signPhoto"
                src={item.photo || "/path/to/placeholder.jpg"} // Placeholder image
                alt={item.title}
                loading="lazy" // Lazy loading
              />
              <p className="photo">{item.desc}</p>
              <br></br>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
