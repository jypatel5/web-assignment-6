import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { Row, Col, Card } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";

export default function Favourites(){
    const [favourites] = useAtom(favouritesAtom);
    if (!favourites) return null;

    return (
        <><br></br>
          <Row className="gy-4">
            {favourites.length > 0 ? (
              favourites.map((objectID) => (
                <Col lg={3} key={objectID}>
                  <ArtworkCard objectID={objectID} />
                </Col>
              ))
            ) : (
                <Col>
                <Card>
                  <Card.Body>
                    <h4>Nothing Here</h4>
                    <p>Try adding some new artwork to the list.</p>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </>
      );
}