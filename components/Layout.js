import MainNav from './MainNav';
import Container from 'react-bootstrap/Container';

export default function Layout({ children }) {
  return (
    <>
      <MainNav />
      <br />
      <Container>
        {children}
      </Container>
      <br />
    </>
  );
}
