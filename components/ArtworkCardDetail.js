import { useEffect, useState } from "react";
import useSWR from "swr";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import Error from "next/error";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";

export default function ArtworkCardDetail({ objectID }) {
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList, objectID]);

  const favouritesClicked = async () => {
    if (showAdded) {
        
      const updatedFavourites = await removeFromFavourites(objectID);
      setFavouritesList(updatedFavourites);
    } else {
      const updatedFavourites = await addToFavourites(objectID);
      setFavouritesList(updatedFavourites);
    }
    setShowAdded(!showAdded);
  };

  if (!data) {
    return null;
  }
  if (error) {
    return <Error statusCode={404} />;
  }

  const {
    artistDisplayName,
    creditLine,
    dimensions,
    artistWikidata_URL,
    title,
    primaryImage,
    objectDate,
    classification,
    medium,
  } = data;

  return (
    <Card>
      {primaryImage && <Card.Img variant="top" src={primaryImage} />}
      <Card.Body>
        <Card.Text>
          <h4>{title}</h4>
          <strong>Date:</strong> {objectDate || "N/A"} <br />
          <strong>Classification:</strong> {classification || "N/A"} <br />
          <strong>Medium:</strong> {medium || "N/A"} <br />
          <strong>Artist:</strong> {artistDisplayName || "N/A"}
          {artistWikidata_URL && (
            <Link href={artistWikidata_URL} target="_blank" rel="noreferrer" passHref legacyBehavior>
              &quot;wiki&quot;
            </Link>
          )}
          <br />
          <strong>Credit Line:</strong> {creditLine || "N/A"} <br />
          <strong>Dimensions:</strong> {dimensions || "N/A"}
        </Card.Text>
        <button
          className={`btn btn-${showAdded ? "primary" : "outline-primary"}`}
          onClick={favouritesClicked}
        >
          + Favourite {showAdded ? "(added)" : ""}
        </button>
      </Card.Body>
    </Card>
  );
}
