// src/lib/client.ts

// "use client"; // Ensure this is correctly placed/

// Creating a function to store the JWT token in localStorage
const clientAuth = (token: any) => {
  console.log("outside");
  // Correct check for window object
  if (typeof window !== "undefined") {
    console.log("inside");
    localStorage.setItem("access_token", token);
  }
};

export default clientAuth;
