/**************************************************************************** 
* I declare that this assignment is my own work in accordance with the Seneca Academic 
* Policy. No part of this assignment has been copied manually or electronically from 
* any other source (including web sites) or distributed to other students. 
* 
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html 
* 
* Assignment: 2247 / 5 
* Student Name: Abhi Mansukhbhai Chakrani 
* Student Email: amchakrani@myseneca.ca 
* Course/Section: WEB422/ZAA 
* 
*****************************************************************************/ 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Row, Col, Pagination, Card } from 'react-bootstrap';
import Error from 'next/error';
import ArtworkCard from '../../components/ArtworkCard';
import validObjectIDList from '@/public/data/validObjectIDList.json';
const PER_PAGE = 12;


export default function Artwork() {
  const [artworkList, setArtworkList] = useState(null);
  const [page, setPage] = useState(1);

  const router = useRouter();
  const finalQuery = router.asPath.split('?')[1];

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`
  );

  useEffect(() => {
    if (data?.objectIDs && data.objectIDs.length > 0) {
      let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
      const results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        results.push(filteredResults.slice(i, i + PER_PAGE));
      }
      setArtworkList(results);
      setPage(1);
    } else {
      setArtworkList([]); 
      
    }
  }, [data]);

  const previousPage = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));
  const nextPage = () => setPage((prev) => (prev < artworkList.length ? prev + 1 : prev));

  if (error) return <Error statusCode={404} />;
  if (!artworkList) return null;

  return (
    <>
      <Row className="gy-4">
        {artworkList.length > 0 ? (
          artworkList[page - 1].map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))
        ) : (
          <Card>
            <Card.Body>
              <h4>Nothing here</h4>
              <p>Try searching for something else.</p>
            </Card.Body>
          </Card>
        )}
      </Row>
      {artworkList.length > 0 && (
        <Row>
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
}
