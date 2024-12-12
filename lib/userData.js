// my-app/lib/userData.js

import { getToken } from './authenticate';

// Helper function to handle fetch requests with authorization
async function fetchData(url, options = {}) {
  const token = getToken(); // Get the token from localStorage
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `JWT ${token}`, // Include JWT in the authorization header
    ...options.headers, // Merge any additional headers passed in options
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 200) {
      return response.json(); // Return the response data if successful
    } else {
      return []; // Return an empty array if the request failed
    }
  } catch (error) {
    console.error('Error:', error);
    return []; // Return an empty array in case of an error
  }
}

// Add a listing to the user's favourites
export async function addToFavourites(id) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`;
  const options = {
    method: 'PUT', // Use PUT to add the item
  };
  return await fetchData(url, options);
}

// Remove a listing from the user's favourites
export async function removeFromFavourites(id) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`;
  const options = {
    method: 'DELETE', // Use DELETE to remove the item
  };
  return await fetchData(url, options);
}

// Get all the user's favourite listings
export async function getFavourites() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/favourites`;
  return await fetchData(url);
}

// Add a listing to the user's history
export async function addToHistory(id) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/history/${id}`;
  const options = {
    method: 'PUT', // Use PUT to add the item
  };
  return await fetchData(url, options);
}

// Remove a listing from the user's history
export async function removeFromHistory(id) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/history/${id}`;
  const options = {
    method: 'DELETE', // Use DELETE to remove the item
  };
  return await fetchData(url, options);
}

// Get all the user's history listings
export async function getHistory() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/history`;
  return await fetchData(url);
}
