import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
export const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [userRole,setRole]=useState(localStorage.getItem('role'))
  const [user,setUser]=useState([])
  const [events,setEvents]=useState([])
  const navigate = useNavigate();

  useEffect(() => {
    if (token && userRole==='Admin' && userId) {
      fetchUsers();
      fetchEvents()
    } else {
      navigate("/login");
      return
    }
  }, [token,userRole,userId, navigate]);

    const fetchUsers=async()=>{
        if (!token || userRole!=='Admin' || !userId) {
            navigate('/login')
            return;
          }
          try{
            let res=await fetch('https://deploy-test-msnv.onrender.com/user/admin-route',{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${token}`,
                    "Content-Type":"application/json"
                }
            })
            if(res.ok){
                let data=await res.json()
                setUser(data)
            }else if (res.status === 401) {
                setToken('');
                setRole('')
                setUserId('')
                localStorage.removeItem('role')
                localStorage.removeItem('userId')
                localStorage.removeItem('token');
                navigate("/login");
                return
              }
          }catch(err){
            alert(err)
          }
    }
    const updateRole=async(id,role)=>{
        if (!token || userRole!=='Admin' || !userId) {
            navigate('/login')
            return;
          }
          try{
            let res=await fetch(`https://deploy-test-msnv.onrender.com/user/update-role/${id}`,{
                method:"PATCH",
                headers:{
                    "Authorization":`Bearer ${token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({role})
            })
            if(res.ok){
                let data=await res.json()
                alert(data.message)
                await fetchUsers()
                await fetchEvents()
            }else if (res.status === 401) {
                setToken('');
                setRole('')
                setUserId('')
                localStorage.removeItem('role')
                localStorage.removeItem('userId')
                localStorage.removeItem('token');
                navigate("/login");
                return
              }
          }catch(err){
            alert(err)
          }
    }
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
            navigate("/login");
            return
          }
        } catch (err) {
          console.error("Error during logout:", err);
        }
      };

      const toggleActivityStatus=async(id,activity)=>{
        if (!token || userRole!=='Admin' || !userId) {
            navigate('/login')
            return;
          }
          try{
            let res=await fetch(`https://deploy-test-msnv.onrender.com/user/toggle-activity/${id}`,{
                method:"PATCH",
                headers:{
                    "Authorization":`Bearer ${token}`,
                    "Content-Type":"application/json"
                }
            })
            if(res.ok){
                let data=await res.json()
                alert(data.message)
                await fetchUsers()
                await fetchEvents()
            }else if (res.status === 401) {
                setToken('');
                setRole('')
                setUserId('')
                localStorage.removeItem('role')
                localStorage.removeItem('userId')
                localStorage.removeItem('token');
                navigate("/login");
                return
              }
          }catch(err){
            alert(err)
          }
      }

      const fetchEvents=async()=>{
        if (!token || userRole!=='Admin' || !userId) {
            navigate('/login')
            return;
          }
          try{ 
            let res = await fetch(`https://deploy-test-msnv.onrender.com/userEvent/all`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            });
            if (res.ok) {
              let data = await res.json();
              setEvents(data);
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
          }catch(err){
            alert(err)
          }
      }

      const handleDeleteEvent = async (id) => {
        if (!token || userRole!=='Admin' || !userId) {
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
              let data = await res.json();
              alert(data.message);
            await fetchEvents();
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

      const handleDeleteUser = async (id) => {
        if (!token || userRole!=='Admin' || !userId) {
            navigate("/login");
            return;
          }
        try {
          let res = await fetch(
            `https://deploy-test-msnv.onrender.com/user/${id}`,
            {
              method: "DELETE",
              headers:{
                "Authorization":`Bearer ${token}`,
                "Content-Type":"application/json"
              }
            }
          );
          if (res.ok) {
              let data = await res.json();
              alert(data.message);
              await fetchUsers();
              await fetchEvents()
          } else if (res.status === 401) {
            setToken('');
            setRole('')
            setUserId('')
            localStorage.removeItem('role')
            localStorage.removeItem('userId')
            localStorage.removeItem('token');
            navigate("/login");
            return
          }else {
            let data = await res.json();
            alert(data.message);
          }
        } catch (err) {
          alert(err);
        }
      };

  return (
    <div>
        <button id="logout" onClick={handleLogout} type="button">
              Logout
            </button>
            <div className='usersListAdminPage'>

        {user && user.map((ele)=>{
            return (
                <div className='usersItemAdminPage' key={ele._id}>
                  <h4>Email address: {ele.email}</h4>
                  <h4>Contact: {ele.phone}</h4>
                  <img src={ele.image} alt="userImage" />
                  <select style={{
                    height:'30px'
                  }} onChange={(e)=>{
                      updateRole(ele._id,e.target.value)
                    }} defaultValue={ele.role}>
                    <option value="User">User</option>
                    <option value="Organizer">Organizer</option>
                  </select>
                  <h4>Role: {ele.role}</h4>
                  <button style={{
                    backgroundColor : ele.activity ? 'Gray' : 'Blue',
                    boxSizing:'border-box',
                    padding:'12px 18px',
                    border:'none',
                    borderRadius:'12px'
                  }} onClick={()=>{
                    toggleActivityStatus(ele._id,ele.activity)
                  }}>{ele.activity ? 'Disable' : 'Enable'}</button>
                  <h4>Activity Status: {ele.activity ? 'Active' : 'Disabled'}</h4>
                  <button style={{
                    boxSizing:'border-box',
                    padding:'12px 18px',
                    border:'none',
                    borderRadius:'12px',
                    backgroundColor:'red',
                    color:'white'
                  }}  onClick={() => {
                    handleDeleteUser(ele._id);
                  }} >Delete User</button>
                </div>
            )
        })}
        </div>
        <div className="eventList">
              {events && events.map((ele) => (
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
    </div>
  )
}
