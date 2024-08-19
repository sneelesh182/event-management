import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
  phone: "",
  avatar: null,
};

export const Signup = () => {
  const [credential, setCredential] = useState(initialState);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setCredential((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setCredential((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", credential.email);
    formData.append("password", credential.password);
    formData.append("phone", credential.phone);
    if (credential.avatar) {
      formData.append("avatar", credential.avatar);
    }

    try {
      let res = await fetch(
        "https://deploy-test-msnv.onrender.com/user/register",
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        let data = await res.json();
        await fetchUsers();
        alert(data.message);
      } else {
        let data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };
  const fetchUsers = async () => {
    try {
      let res = await fetch(`https://deploy-test-msnv.onrender.com/user/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        let data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      alert(err);
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      let res = await fetch(
        `https://deploy-test-msnv.onrender.com/user/${id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        await fetchUsers();
        let data = await res.json();
        alert(data.message);
      } else {
        let data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      alert(err);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} id="signupForm">
        <input
          type="email"
          name="email"
          id="email"
          value={credential.email}
          placeholder="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          value={credential.password}
          placeholder="password"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          id="phone"
          value={credential.phone}
          placeholder="phone"
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="avatar"
          id="avatar"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign up</button>
        <button onClick={handleLogin} type="button">
          Login
        </button>
      </form>
      <div className="userList">
        {users &&
          users.map((ele) => {
            return (
              <div className="userItem" key={ele._id}>
                <button
                  onClick={() => {
                    handleDeleteUser(ele._id);
                  }}
                >
                  Delete
                </button>
                <h4>Email:{ele.email}</h4>
                <h4>Phone:{ele.phone}</h4>
                <img src={ele.image} alt="userImage" />
                <h4>Role: {ele.role}</h4>
                <h4>Activity Status: {ele.activity ? "Active" : "Disabled"}</h4>
              </div>
            );
          })}
      </div>
    </div>
  );
};
