import { Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import useSWR from 'swr';
import Error from 'next/error';
const ArtworkCard = ({ objectID }) => {
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`, fetcher);

    if (error) return <Error statusCode={404} />;
    if (!data) return null;

    const {
        primaryImageSmall = 'https://via.placeholder.com/375x375.png?text=[+Not+Available+]',
        title = 'N/A',
        objectDate = 'N/A',
        classification = 'N/A',
        medium = 'N/A'
    } = data;

    return (
        <Card>
            <Card.Img variant="top" src={primaryImageSmall ||'https://via.placeholder.com/375x375.png?text=[+Not+Available+]'}  alt={title} />
            <Card.Body>
                <Card.Title>{title || 'N/A'}</Card.Title>
                <Card.Text>
                    <strong>Date:</strong> {objectDate|| 'N/A'}<br />
                    <strong>Classification:</strong> {classification|| 'N/A'}<br />
                    <strong>Medium:</strong> {medium|| 'N/A'}
                </Card.Text>
                <Link href={`/artwork/${objectID}`} passHref>
                    <Button variant="primary">ID: {objectID|| 'N/A'}</Button>
                </Link>
            </Card.Body>
        </Card>
    );
};

export default ArtworkCard;
