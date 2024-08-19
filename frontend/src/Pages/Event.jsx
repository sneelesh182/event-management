import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
  eventName: "",
  price: "",
  capacity: "",
};

export const Event = () => {
  const [events, setEvents] = useState(initialState);
  const [eventDetails, setEventDetails] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEvent, setRegisteredEvent] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [role,setRole]=useState(localStorage.getItem('role'))
  const navigate = useNavigate();

  useEffect(() => {
    if (token && role==='User' && userId) {
      fetchEvents();
      fetchAllEvents();
    } else {
      navigate("/login");
    }
  }, [token,role,userId, navigate]);

  const fetchEvents = async () => {
    if (!token || role!=='User' || !userId) {
      navigate('/login')
      return;
    }
    try {
      setEventDetails([]); 
      let res = await fetch(`https://deploy-test-msnv.onrender.com/userEvent`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        let data = await res.json();
        setEventDetails(data);
        
      } else if (res.status === 401) {
        setToken('');
        setRole('')
        setUserId('')
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate("/login");
        return
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvents((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || role!=='User' || !userId) {
      navigate("/login");
      return;
    }
    try {
      let res = await fetch(`https://deploy-test-msnv.onrender.com/userEvent`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(events),
      });
      if (res.ok) {
        await fetchEvents();
        setEvents(initialState);
      } else if (res.status === 401) {
        setToken('');
        setRole('')
        setUserId('')
        localStorage.removeItem('role')
        localStorage.removeItem('userId')
        localStorage.removeItem('token');
        navigate("/login");
        return
      }
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!token || role!=='User' || !userId) {
      navigate("/login");
      return;
    }
    try {
      let res = await fetch(
        `https://deploy-test-msnv.onrender.com/userEvent/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        await fetchEvents();
        let data = await res.json();
        alert(data.message);
      } else if (res.status === 401) {
        setToken('');
        setRole('')
        setUserId('')
        localStorage.removeItem('role')
        localStorage.removeItem('userId')
        localStorage.removeItem('token');
        navigate("/login");
        return
      } else {
        let data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const handleLogout = async () => {
    try {
      let res = await fetch(
        `https://deploy-test-msnv.onrender.com/user/logout`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setToken('');
        setRole('')
        setUserId('')
        localStorage.removeItem('role')
        localStorage.removeItem('token');
        localStorage.removeItem('userId')
        setEventDetails([]);
        setAllEvents([]);
        navigate("/login");
        return
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  async function fetchAllEvents() {
    if (!token || role!=='User' || !userId) {
      navigate('/login')
      return;
    }
    try {
      setAllEvents([]); 
      let res = await fetch(`https://deploy-test-msnv.onrender.com/userEvent/all`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        let data = await res.json();
        setAllEvents(data);
      } else if (res.status === 401) {
        setToken('');
        setRole('')
        setUserId('')
        localStorage.removeItem('role')
        localStorage.removeItem('userId')
        localStorage.removeItem('token');
        navigate("/login");
        return
      }
    } catch (err) {
      console.error("Error fetching all events:", err);
    }
  }

  const handleRegisterEvent = async (id) => {
    try {
      setIsLoading(true);
      let res = await fetch(`https://deploy-test-msnv.onrender.com/userEvent/register-event/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (res.ok) {
        setRegisteredEvent(data);
        fetchAllEvents(); 
        alert("Successfully registered for the event!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error registering for event:", err);
      alert("An error occurred while registering for the event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {token ? (
        <>
          <form id="eventForm" onSubmit={handleSubmit}>
            <input
              type="text"
              name="eventName"
              id="eventName"
              value={events.eventName}
              placeholder="event name"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              id="price"
              value={events.price}
              placeholder="price"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="capacity"
              id="capacity"
              value={events.capacity}
              placeholder="capacity"
              onChange={handleChange}
              required
            />
            <button type="submit">Create Event</button>
            <button id="logout" onClick={handleLogout} type="button">
              Logout
            </button>
          </form>
          <div id="eventContainer">
            <div className="eventList">
              {eventDetails.map((ele) => (
                <div className="eventItem" key={ele._id}>
                  <h4>Created by: {ele.user.email}</h4>
                  <h4>Contact: {ele.user.phone}</h4>
                  <img src={ele.user.image} alt="userImage" />
                  <h4>Role: {ele.user.role}</h4>
                  <h4>Activity Status: {ele.user.activity ? 'Active' : 'Disabled'}</h4>
                  <h4>Event name: {ele.eventName}</h4>
                  <h4>Price: {ele.price}</h4>
                  <h4>Capacity: {ele.capacity}</h4>
                  <button onClick={() => handleDeleteEvent(ele._id)}>
                    Cancel Event
                  </button>
                </div>
              ))}
            </div>

            <div className="registeredByYouList">
              {isLoading && <div className="loading">Loading...</div>}
              {!registeredEvent && <h1>No events registered by you yet</h1>}
              {registeredEvent && registeredEvent.map((ele) => {
                return (
                  <div className="registeredByYouItem" key={ele._id}>
                    <h4>Created by: {ele.user.email}</h4>
                    <h4>Contact: {ele.user.phone}</h4>
                    <img src={ele.user.image} alt="userImage" />
                    <h4>Role: {ele.user.role}</h4>
                  <h4>Activity Status: {ele.user.activity ? 'Active' : 'Disabled'}</h4>
                    <h4>Event name: {ele.eventName}</h4>
                    <h4>Price: {ele.price}</h4>
                    <h4>Capacity: {ele.capacity}</h4>
                  </div>
                )
              })}
            </div>
            <h1>Events by other creators</h1>
            <div className="allEventList">
              {allEvents.map((ele) => (
                <div className="allEventItem" key={ele._id}>
                  <h4>Created by: {ele.user.email}</h4>
                  <h4>Contact: {ele.user.phone}</h4>
                  <img src={ele.user.image} alt="userImage" />
                  <h4>Role: {ele.user.role}</h4>
                  <h4>Activity Status: {ele.user.activity ? 'Active' : 'Disabled'}</h4>
                  <h4>Event name: {ele.eventName}</h4>
                  <h4>Price: {ele.price}</h4>
                  <h4>Capacity: {ele.capacity}</h4>
                  <button 
                    onClick={() => handleRegisterEvent(ele._id)}
                    disabled={ele.registeredUsers?.includes(userId)}
                  >
                    {ele.registeredUsers?.includes(userId) ? 'Already Registered' : 'Register'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>
          <h1>Unauthorized. Please Login</h1>
        </div>
      )}
    </div>
  );
};
