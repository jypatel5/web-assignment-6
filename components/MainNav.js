import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import { useAtom } from "jotai"; 
import { searchHistoryAtom } from "@/store"; 
import { addToHistory } from "@/lib/userData";
import { readToken, removeToken } from "@/lib/authenticate";

export default function MainNav() {
  const router = useRouter();
  const [searchField, setSearchField] = useState('');
  const [isExpanded, setIsExpanded] = useState(false); 
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const token = readToken();
  const userName = token?.userName || null;

  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleLinkClick = () => setIsExpanded(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (searchField.trim() === "") return;
      const queryString = `title=true&q=${searchField}`;
      setSearchHistory(await addToHistory(queryString));
      router.push(`/artwork?${queryString}`);
      setSearchField("");
      setIsExpanded(false);
  };

  const logout = () => {
      setIsExpanded(false); // Collapse the menu
      removeToken(); // Remove token
      router.push("/login"); // Redirect to login
  };

  return (
    <>
      <Navbar className="fixed-top navbar-dark bg-primary" expanded={isExpanded} expand="lg">
        <Navbar.Brand className="ms-5">Jeetkumar Patel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto " onClick={handleLinkClick}>
                <Link href="/" passHref legacyBehavior>
                    <Nav.Link>Home</Nav.Link>
                </Link>
                {token && (
                    <Link href="/search" passHref legacyBehavior>
                        <Nav.Link>Advanced Search</Nav.Link>
                    </Link>
                )}
            </Nav>
            {token && (
                <>
                    <Form className="d-flex" onSubmit={handleSubmit}>
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value)}
                        />
                        <Button type="submit" variant="success">Search</Button>
                    </Form>
                    &nbsp;
                    <Nav>
                        <NavDropdown title={userName} id="user-dropdown" className="ms-auto me-5">
                            <Link href="/favourites" passHref legacyBehavior>
                                <NavDropdown.Item onClick={handleLinkClick}>
                                    Favourites
                                </NavDropdown.Item>
                            </Link>
                            <Link href="/history" passHref legacyBehavior>
                                <NavDropdown.Item onClick={handleLinkClick}>
                                    Search History
                                </NavDropdown.Item>
                            </Link>
                            <NavDropdown.Item onClick={logout}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </>
            )}
            {!token && (
                <Nav>
                    <Link href="/register" passHref legacyBehavior>
                        <Nav.Link active onClick={handleLinkClick}>
                            Register
                        </Nav.Link>
                    </Link>
                    <Link href="/login" passHref legacyBehavior>
                        <Nav.Link active onClick={handleLinkClick}>
                            Login
                        </Nav.Link>
                    </Link>
                </Nav>
            )}
        </Navbar.Collapse>
      </Navbar>

      <div style={{ paddingTop: '60px' }}>
      </div>
    </>
  );
}
