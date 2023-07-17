import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuthentication } from "../util/use-authentication";
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import { Container } from "react-bootstrap";

const Profile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const { currentUser } = useAuthentication();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:9999/users/${id}`)
      .then((response) => {
        setUserData(response.data);
        setEditedData({ ...response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:9999/users/${id}`, editedData)
      .then((response) => {
        setUserData(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    setEditedData({ ...userData });
    setIsEditing(false);
  };

  return (
    <>
      <Meta title={"Profile"} />
      <BreadCrumb title="Profile" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="profile-container">
          <h1>User Profile</h1>
          {!isEditing ? (
            <>
              <p>
                <strong>Name:</strong> {userData.name}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Role:</strong> {currentUser.role}
              </p>
              <button onClick={handleEdit}>Edit</button>
              <Link style={{ marginLeft: "70px" }} to={`/changePassword/${userData.email}`}>
                Change Password
              </Link>
            </>
          ) : (
            <>
              <label>
                <strong>Name:</strong>
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                <strong>Email:</strong>
                <input
                  type="text"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                />
              </label>
              <br />
              <br />
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default Profile;
